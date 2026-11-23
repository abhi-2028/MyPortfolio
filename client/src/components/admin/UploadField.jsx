import { useState } from 'react'
import api, { getCsrfToken } from '../../services/api'

const uploadPurpose = {
  profileImage: 'profile',
  profile: 'profile',
  image: 'project',
  gallery: 'gallery',
  resumeUrl: 'resume',
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

    try {
      await getCsrfToken()
      const uploadedUrls = []

      for (const file of files) {
        const isPdf = file.type === 'application/pdf'
        if (!isPdf && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Only JPEG, PNG, WebP, and PDF files are allowed.')
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Each file must be 10 MB or smaller.')
        }

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
            onUploadProgress: (event) => {
              if (event.total) setProgress(Math.round((event.loaded / event.total) * 100))
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
          <small>{progress}%</small>
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
