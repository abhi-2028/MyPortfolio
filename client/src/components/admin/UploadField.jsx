import { useState } from 'react'
import api, { getCsrfToken } from '../../services/api'

const uploadPurpose = {
  profileImage: 'profile',
  profile: 'profile',
  image: 'project',
  gallery: 'gallery',
  resumeUrl: 'resume',
}

const OPTIMIZE_THRESHOLD_BYTES = 250 * 1024
const MAX_IMAGE_DIMENSION = 1600
const UPLOAD_TIMEOUT_MS = 180000

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })

const optimizeImageForUpload = async (file) => {
  if (!file || !file.type?.startsWith('image/') || file.size <= OPTIMIZE_THRESHOLD_BYTES) {
    return file
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('Image decode failed'))
      element.src = objectUrl
    })

    const { naturalWidth, naturalHeight } = img
    if (!naturalWidth || !naturalHeight) return file

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(naturalWidth, naturalHeight))
    const targetWidth = Math.max(1, Math.round(naturalWidth * scale))
    const targetHeight = Math.max(1, Math.round(naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

    const webpBlob = await canvasToBlob(canvas, 'image/webp', 0.85)
    let chosenBlob = webpBlob && webpBlob.type === 'image/webp' ? webpBlob : null

    if (!chosenBlob || chosenBlob.size >= file.size) {
      const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', 0.85)
      if (jpegBlob && (!chosenBlob || jpegBlob.size < chosenBlob.size)) {
        chosenBlob = jpegBlob
      }
    }

    if (!chosenBlob || chosenBlob.size >= file.size) {
      return file
    }

    const ext = chosenBlob.type === 'image/webp' ? 'webp' : 'jpg'
    const baseName = (file.name || 'upload').replace(/\.[^/.]+$/, '')
    return new File([chosenBlob], `${baseName}.${ext}`, {
      type: chosenBlob.type,
      lastModified: Date.now(),
    })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function UploadField({
  fieldKey,
  label,
  value,
  onChange,
  onGalleryChange,
  multiple = false,
  purpose: purposeOverride,
}) {
  const [uploading, setUploading] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [localPreview, setLocalPreview] = useState('')

  const preview = localPreview || (typeof value === 'string' ? value : '')

  const purpose = purposeOverride || uploadPurpose[fieldKey] || 'project'

  const upload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError('')
    setProgress(0)
    setStatusText('')

    try {
      await getCsrfToken()
      const uploadedUrls = []

      for (const rawFile of files) {
        const isPdf = rawFile.type === 'application/pdf'
        if (!isPdf && !['image/jpeg', 'image/png', 'image/webp'].includes(rawFile.type)) {
          throw new Error('Only JPEG, PNG, WebP, and PDF files are allowed.')
        }
        if (rawFile.size > 10 * 1024 * 1024) {
          throw new Error('Each file must be 10 MB or smaller.')
        }

        let file = rawFile
        if (!isPdf) {
          setStatusText('Optimizing image...')
          file = await optimizeImageForUpload(rawFile)
        }
        setStatusText('Uploading...')

        const formData = new FormData()
        formData.append('file', file)
        if (!multiple && preview) {
          try {
            const existing = await api.get(`/api/admin/uploads?purpose=${purpose}`)
            const match = existing.data.data.find(
              (upload) => upload.secureUrl === preview || upload.url === preview,
            )
            if (match) formData.append('replacementPublicId', match.publicId)
          } catch {
            // Upload can proceed without replacement cleanup.
          }
        }

        const response = await api.post(
          `/api/admin/uploads/${purpose}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: UPLOAD_TIMEOUT_MS,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
              }
            },
          },
        )

        uploadedUrls.push(response.data.data.secureUrl)
        if (!multiple) {
          setLocalPreview(response.data.data.secureUrl)
          onChange(response.data.data.secureUrl)
        }
      }

      if (multiple) {
        onGalleryChange(uploadedUrls)
        setLocalPreview(uploadedUrls.join(', '))
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Upload failed.')
    } finally {
      setUploading(false)
      setStatusText('')
      event.target.value = ''
    }
  }

  const remove = async () => {
    try {
      await getCsrfToken()
      const existing = await api.get(`/api/admin/uploads?purpose=${purpose}`)
      const match = existing.data.data.find(
        (upload) => upload.secureUrl === preview || upload.url === preview,
      )
      if (match) await api.delete(`/api/admin/uploads/${match._id}`)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to remove the uploaded file.')
      return
    }
    setLocalPreview('')
    onChange('')
  }

  const isImage = typeof preview === 'string' && preview.trim() !== '' && !preview.toLowerCase().endsWith('.pdf')

  return (
    <div className="admin-upload-field">
      <span>{label}</span>
      {preview ? (
        isImage ? (
          <img className="admin-upload-preview" src={preview} alt="" />
        ) : (
          <a className="admin-upload-link" href={preview} target="_blank" rel="noreferrer">View current document</a>
        )
      ) : null}
      <input
        type="file"
        accept={fieldKey === 'resumeUrl' ? '.pdf,application/pdf' : 'image/jpeg,image/png,image/webp'}
        multiple={multiple}
        onChange={upload}
        disabled={uploading}
      />
      {uploading ? (
        <div className="admin-upload-progress">
          <span style={{ width: `${progress}%` }}></span>
          <small>{statusText ? `${statusText} ${progress}%` : `${progress}%`}</small>
        </div>
      ) : null}
      {preview && !multiple ? (
        <button className="admin-danger-text" type="button" onClick={remove}>Remove</button>
      ) : null}
      {error ? <small className="admin-upload-error">{error}</small> : null}
    </div>
  )
}

export default UploadField
