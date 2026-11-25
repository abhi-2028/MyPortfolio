import { EventEmitter } from 'node:events';
import { Writable } from 'node:stream';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const uploadStreamMock = vi.fn();
const destroyMock = vi.fn();

vi.mock('../src/config/cloudinary.js', () => ({
  configureCloudinary: () => ({
    uploader: {
      upload_stream: uploadStreamMock,
      destroy: destroyMock,
    },
  }),
}));

const { uploadBuffer, validateUploadFile } = await import('../src/services/uploadService.js');

const createMockUploadStream = (onComplete) => {
  const chunks = [];
  return new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(chunk);
      callback();
    },
    final(callback) {
      callback();
      onComplete(Buffer.concat(chunks));
    },
  });
};

describe('uploadService', () => {
  beforeEach(() => {
    uploadStreamMock.mockReset();
    destroyMock.mockReset();
  });

  it('rejects missing or unsupported files', () => {
    expect(() => validateUploadFile(null)).toThrow('A file is required.');
    expect(() =>
      validateUploadFile({ mimetype: 'image/gif', buffer: Buffer.from('gif') }),
    ).toThrow('Only JPEG, PNG, WebP, and PDF files are allowed.');
  });

  it('streams buffer with timeout and agent options', async () => {
    uploadStreamMock.mockImplementation((options, callback) =>
      createMockUploadStream(() => {
        callback(null, { public_id: 'portfolio/project/demo', secure_url: 'https://res.cloudinary.com/demo.webp' });
      }),
    );

    const file = {
      mimetype: 'image/webp',
      originalname: 'cover.webp',
      buffer: Buffer.from('mock-image-bytes'),
    };

    const result = await uploadBuffer(file, 'project');
    expect(result.public_id).toBe('portfolio/project/demo');
    expect(uploadStreamMock).toHaveBeenCalledTimes(1);

    const passedOptions = uploadStreamMock.mock.calls[0][0];
    expect(passedOptions.folder).toBe('portfolio/project');
    expect(passedOptions.resource_type).toBe('image');
    expect(passedOptions.timeout).toBeGreaterThanOrEqual(60000);
    expect(passedOptions.agent).toBeDefined();
  });

  it('retries once on transient 499 TimeoutError and succeeds', async () => {
    let attempts = 0;
    uploadStreamMock.mockImplementation((_options, callback) =>
      createMockUploadStream(() => {
        attempts += 1;
        if (attempts === 1) {
          callback({ message: 'Request Timeout', http_code: 499, name: 'TimeoutError' });
          return;
        }
        callback(null, { public_id: 'portfolio/project/retried' });
      }),
    );

    const result = await uploadBuffer(
      { mimetype: 'image/png', originalname: 'cover.png', buffer: Buffer.from('png') },
      'project',
    );
    expect(result.public_id).toBe('portfolio/project/retried');
    expect(uploadStreamMock).toHaveBeenCalledTimes(2);
  });

  it('maps repeated 499 TimeoutError to 504 with clear message', async () => {
    uploadStreamMock.mockImplementation((_options, callback) =>
      createMockUploadStream(() => {
        callback({ message: 'Request Timeout', http_code: 499, name: 'TimeoutError' });
      }),
    );

    await expect(
      uploadBuffer(
        { mimetype: 'image/jpeg', originalname: 'big.jpg', buffer: Buffer.from('jpg') },
        'project',
      ),
    ).rejects.toMatchObject({
      statusCode: 504,
      message: expect.stringContaining('timed out'),
    });
    expect(uploadStreamMock).toHaveBeenCalledTimes(2);
  });

  it('preserves 403 status on Cloudinary permission error without retrying', async () => {
    uploadStreamMock.mockImplementation((_options, callback) => {
      const dummy = new EventEmitter();
      dummy.write = () => true;
      dummy.end = () => callback({ message: 'Forbidden', http_code: 403 });
      dummy.on = EventEmitter.prototype.on;
      dummy.once = EventEmitter.prototype.once;
      dummy.emit = EventEmitter.prototype.emit;
      return dummy;
    });

    await expect(
      uploadBuffer(
        { mimetype: 'image/png', originalname: 'cover.png', buffer: Buffer.from('png') },
        'project',
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(uploadStreamMock).toHaveBeenCalledTimes(1);
  });
});
