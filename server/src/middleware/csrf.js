import crypto from 'crypto';

export const issueCsrfToken = (request, response) => {
  const existing = request.cookies?.portfolio_csrf;
  const token = existing || crypto.randomBytes(32).toString('hex');
  const isProduction = process.env.NODE_ENV === 'production';

  if (!existing) {
    response.cookie('portfolio_csrf', token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
  }

  response.status(200).json({ success: true, data: { csrfToken: token } });
};

export const verifyCsrf = (request, response, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    next();
    return;
  }

  const cookieToken = request.cookies?.portfolio_csrf;
  const headerToken = request.get('X-CSRF-Token');

  if (!cookieToken || !headerToken) {
    const error = new Error('CSRF token is required.');
    error.statusCode = 403;
    next(error);
    return;
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);

  if (
    cookieBuffer.length !== headerBuffer.length ||
    !crypto.timingSafeEqual(cookieBuffer, headerBuffer)
  ) {
    const error = new Error('Invalid CSRF token.');
    error.statusCode = 403;
    next(error);
    return;
  }

  next();
};
