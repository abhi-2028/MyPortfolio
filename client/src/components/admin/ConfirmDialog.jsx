function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="admin-dialog-backdrop" role="presentation">
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
        <h2 id="admin-dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="admin-dialog-actions">
          <button className="admin-secondary-button" type="button" onClick={onCancel}>Cancel</button>
          <button className="admin-danger-button" type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
