import { useCallback, useEffect, useState } from 'react'
import api, { getCsrfToken } from '../../services/api'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import UploadField from '../../components/admin/UploadField'

const configs = {
  Projects: {
    endpoint: 'projects',
    singular: 'Project',
    titleKey: 'title',
    fields: [
      ['title', 'Title', 'text', true],
      ['description', 'Description', 'textarea'],
      ['detailedDescription', 'Detailed description', 'textarea'],
      ['technologies', 'Technologies (comma separated)', 'text'],
      ['image', 'Cover image URL', 'text'],
      ['gallery', 'Gallery URLs (comma separated)', 'textarea'],
      ['githubUrl', 'GitHub URL', 'text'],
      ['liveUrl', 'Live demo URL', 'text'],
      ['category', 'Category', 'text'],
      ['featured', 'Featured project', 'checkbox'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  Experience: {
    endpoint: 'experience',
    singular: 'Experience',
    titleKey: 'position',
    fields: [
      ['company', 'Company', 'text', true],
      ['position', 'Position', 'text', true],
      ['employmentType', 'Employment type', 'text'],
      ['location', 'Location', 'text'],
      ['description', 'Description', 'textarea'],
      ['responsibilities', 'Responsibilities (one per line)', 'textarea'],
      ['technologies', 'Technologies (comma separated)', 'text'],
      ['startDate', 'Start date', 'date', true],
      ['endDate', 'End date', 'date'],
      ['currentlyWorking', 'Currently working', 'checkbox'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  Certificates: {
    endpoint: 'certificates',
    singular: 'Certificate',
    titleKey: 'title',
    fields: [
      ['title', 'Title', 'text', true],
      ['issuingOrganization', 'Issuing organization', 'text', true],
      ['issueDate', 'Issue date', 'date', true],
      ['expiryDate', 'Expiry date', 'date'],
      ['credentialId', 'Credential ID', 'text'],
      ['credentialUrl', 'Credential URL', 'text'],
      ['image', 'Certificate image URL', 'text'],
      ['description', 'Description', 'textarea'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  Skills: {
    endpoint: 'skills',
    singular: 'Skill',
    titleKey: 'name',
    fields: [
      ['name', 'Skill name', 'text', true],
      ['category', 'Category', 'text'],
      ['description', 'Description', 'textarea'],
      ['proficiency', 'Proficiency (0-100)', 'number'],
      ['icon', 'Icon name or URL', 'text'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  Education: {
    endpoint: 'education',
    singular: 'Education',
    titleKey: 'institution',
    fields: [
      ['institution', 'Institution', 'text', true],
      ['degree', 'Degree', 'text'],
      ['fieldOfStudy', 'Field of study', 'text'],
      ['startDate', 'Start date', 'date'],
      ['endDate', 'End date', 'date'],
      ['description', 'Description', 'textarea'],
      ['displayOrder', 'Display order', 'number'],
    ],
  },
  Profile: {
    endpoint: 'profile',
    singular: 'Profile',
    titleKey: 'name',
    fields: [
      ['name', 'Name', 'text', true],
      ['headline', 'Headline', 'text'],
      ['bio', 'About me', 'textarea'],
      ['profileImage', 'Profile image URL', 'text'],
      ['email', 'Email', 'email'],
      ['location', 'Location', 'text'],
      ['resumeUrl', 'Resume URL', 'text'],
      ['linkedIn', 'LinkedIn URL', 'text'],
      ['github', 'GitHub URL', 'text'],
      ['twitter', 'Twitter URL', 'text'],
      ['website', 'Website URL', 'text'],
    ],
  },
}

const arrayFields = new Set(['technologies', 'gallery', 'responsibilities'])

const toFormValue = (key, item) => {
  if (!item) return ''
  if (['linkedIn', 'github', 'twitter', 'website'].includes(key)) {
    return item.socialLinks?.[key] || ''
  }
  const value = item[key]
  if (value === null || value === undefined) {
    if (key === 'featured' || key === 'currentlyWorking') return false
    return ''
  }
  if (arrayFields.has(key)) {
    if (Array.isArray(value)) {
      return key === 'responsibilities' ? value.join('\n') : value.join(', ')
    }
    return String(value)
  }
  if (['startDate', 'endDate', 'issueDate', 'expiryDate'].includes(key) && value) {
    if (typeof value === 'string') return value.slice(0, 10)
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    const dateObj = new Date(value)
    return Number.isNaN(dateObj.getTime()) ? '' : dateObj.toISOString().slice(0, 10)
  }
  if (key === 'featured' || key === 'currentlyWorking') {
    return Boolean(value)
  }
  return value
}

const fromFormValue = (key, value) => {
  if (key === 'technologies' || key === 'gallery') {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim()).filter(Boolean)
    }
    return []
  }
  if (key === 'responsibilities') {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split('\n').map((item) => item.trim()).filter(Boolean)
    }
    return []
  }
  if (['startDate', 'endDate', 'issueDate', 'expiryDate'].includes(key)) {
    if (!value || value === '') return null
    return value
  }
  if (value === '' && ['displayOrder', 'proficiency'].includes(key)) return undefined
  if (key === 'displayOrder' || key === 'proficiency') {
    return value !== '' && value !== undefined && value !== null ? Number(value) : undefined
  }
  if (key === 'featured' || key === 'currentlyWorking') return Boolean(value)
  return value
}

function ContentListPage({ type }) {
  const config = configs[type]
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const endpoint = type === 'Profile'
        ? '/api/admin/profile'
        : `/api/admin/${config.endpoint}`
      const response = await api.get(endpoint)
      if (type === 'Profile') {
        setItems(response.data.data ? [response.data.data] : [])
      } else {
        setItems(Array.isArray(response.data.data) ? response.data.data : [])
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load content.')
    } finally {
      setLoading(false)
    }
  }, [config, type])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load, type])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const openCreate = () => {
    setEditing(null)
    setForm(
      Object.fromEntries(
        config.fields.map(([key]) => [
          key,
          key === 'featured' || key === 'currentlyWorking' ? false : '',
        ]),
      ),
    )
    setError('')
    setEditorOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm(Object.fromEntries(config.fields.map(([key]) => [key, toFormValue(key, item)])))
    setError('')
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditing(null)
    setForm({})
    setError('')
  }

  const save = async (event) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    try {
      await getCsrfToken()
      let payload = Object.fromEntries(
        config.fields.map(([key]) => [key, fromFormValue(key, form[key])]),
      )

      if (type === 'Experience' && form.currentlyWorking) {
        payload.endDate = null
      }

      if (type === 'Profile') {
        const socialLinks = {
          linkedIn: payload.linkedIn || '',
          github: payload.github || '',
          twitter: payload.twitter || '',
          website: payload.website || '',
        }
        payload = { ...payload, socialLinks }
        delete payload.linkedIn
        delete payload.github
        delete payload.twitter
        delete payload.website
      }

      payload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined),
      )

      const isEdit = Boolean(editing)
      if (type === 'Profile') {
        await api.put('/api/admin/profile', payload)
      } else if (isEdit) {
        await api.put(`/api/admin/${config.endpoint}/${editing._id}`, payload)
      } else {
        await api.post(`/api/admin/${config.endpoint}`, payload)
      }

      closeEditor()
      setToast(`${config.singular} ${isEdit ? 'updated' : 'created'} successfully.`)
      await load()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save content.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm || saving) return
    setSaving(true)
    setError('')
    try {
      await getCsrfToken()
      await api.delete(`/api/admin/${config.endpoint}/${confirm._id}`)
      setConfirm(null)
      setToast(`${config.singular} deleted successfully.`)
      await load()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete content.')
    } finally {
      setSaving(false)
    }
  }

  const title = (item) => {
    if (!item) return 'Untitled'
    if (type === 'Experience') {
      return item.position ? `${item.position}${item.company ? ` at ${item.company}` : ''}` : 'Untitled Experience'
    }
    if (type === 'Education') {
      return item.degree ? `${item.degree}${item.institution ? ` (${item.institution})` : ''}` : item.institution || 'Untitled Education'
    }
    return item[config.titleKey] || item.name || item.title || 'Untitled'
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h1>{type}</h1>
        </div>
        {type !== 'Profile' ? (
          <button className="admin-primary-button compact" type="button" onClick={openCreate}>
            Add {config.singular}
          </button>
        ) : null}
      </div>

      {error && !editorOpen ? <div className="admin-alert admin-alert-error" role="alert">{error}</div> : null}

      <section className="admin-panel">
        {loading ? (
          <div className="admin-empty-state">
            <div className="admin-skeleton"></div>
            <p>Loading {type.toLowerCase()}...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon" aria-hidden="true"></div>
            <h2>No {type.toLowerCase()} yet</h2>
            <p>Add the first entry to begin managing this section.</p>
            {type !== 'Profile' ? (
              <button className="admin-secondary-button" type="button" onClick={openCreate}>Add entry</button>
            ) : null}
          </div>
        ) : (
          <div className="admin-list-preview">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>{config.singular}</th><th>Updated</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id || 'profile'}>
                      <td><strong>{title(item)}</strong></td>
                      <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Not available'}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="admin-secondary-button compact" type="button" onClick={() => openEdit(item)}>Edit</button>
                          {type !== 'Profile' ? (
                            <button className="admin-danger-text" type="button" onClick={() => setConfirm(item)}>Delete</button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {editorOpen ? (
        <div className="admin-dialog-backdrop" role="presentation">
          <section className="admin-editor" role="dialog" aria-modal="true" aria-label={`${editing ? 'Edit' : 'Add'} ${config.singular}`}>
            <div className="admin-panel-heading">
              <div>
                <p className="admin-eyebrow">{editing ? 'Edit' : 'Add'}</p>
                <h2>{config.singular}</h2>
              </div>
              <button className="admin-icon-button" type="button" onClick={closeEditor} aria-label="Close">×</button>
            </div>
            {error ? <div className="admin-alert admin-alert-error" role="alert" style={{ margin: '16px 22px 0' }}>{error}</div> : null}
            <form className="admin-editor-form" onSubmit={save}>
              {config.fields.map(([key, label, typeName, required]) => {
                const isFullWidth = typeName === 'textarea' || key === 'technologies' || key === 'responsibilities'
                const isCurrentlyWorking = key === 'endDate' && Boolean(form.currentlyWorking)

                return (
                  <label
                    key={key}
                    className={typeName === 'checkbox' ? 'admin-checkbox-label' : ''}
                    style={isFullWidth ? { gridColumn: '1 / -1' } : undefined}
                  >
                    {['profileImage', 'resumeUrl', 'image', 'gallery'].includes(key) ? (
                      <>
                        <UploadField
                          fieldKey={key}
                          label={label}
                          value={form[key] ?? ''}
                          purpose={
                            key === 'profileImage' ? 'profile'
                              : key === 'resumeUrl' ? 'resume'
                                : key === 'gallery' ? 'gallery'
                                  : type === 'Certificates' ? 'certificate'
                                    : 'project'
                          }
                          multiple={key === 'gallery'}
                          onChange={(url) => setForm((current) => ({ ...current, [key]: url }))}
                          onGalleryChange={(urls) => setForm((current) => ({
                            ...current,
                            gallery: [
                              ...(
                                typeof current.gallery === 'string'
                                  ? current.gallery.split(',').map((entry) => entry.trim()).filter(Boolean)
                                  : []
                              ),
                              ...urls,
                            ].join(', '),
                          }))}
                        />
                        {key === 'gallery' ? (
                          <textarea
                            value={form[key] ?? ''}
                            onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                            placeholder="Enter URLs separated by commas"
                            rows="2"
                          />
                        ) : (
                          <input
                            type="text"
                            value={form[key] ?? ''}
                            onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                            placeholder="Or enter a URL"
                          />
                        )}
                      </>
                    ) : typeName === 'checkbox' ? (
                      <>
                        <input
                          type="checkbox"
                          checked={Boolean(form[key])}
                          onChange={(event) => {
                            const checked = event.target.checked
                            setForm((current) => {
                              const updated = { ...current, [key]: checked }
                              if (key === 'currentlyWorking' && checked) {
                                updated.endDate = ''
                              }
                              return updated
                            })
                          }}
                        />
                        {label}
                      </>
                    ) : typeName === 'textarea' ? (
                      <>
                        {label}
                        <textarea
                          value={form[key] ?? ''}
                          onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                          rows="4"
                          required={required}
                        />
                      </>
                    ) : (
                      <>
                        {label}
                        <input
                          type={typeName}
                          value={form[key] ?? ''}
                          disabled={isCurrentlyWorking}
                          onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                          required={required && !isCurrentlyWorking}
                        />
                      </>
                    )}
                  </label>
                )
              })}
              <div className="admin-editor-actions">
                <button className="admin-secondary-button" type="button" onClick={closeEditor}>Cancel</button>
                <button className="admin-primary-button" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={`Delete ${config.singular}?`}
        message={`This permanently removes "${confirm ? title(confirm) : ''}".`}
        confirmLabel={saving ? 'Deleting...' : 'Delete'}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />

      {toast ? (
        <button className="admin-toast" type="button" onClick={() => setToast('')}>
          {toast}<span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  )
}

export default ContentListPage
