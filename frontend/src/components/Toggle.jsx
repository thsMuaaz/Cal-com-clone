import './Toggle.css'

/**
 * Accessible on/off control (Cal.com-style pill switch).
 */
export function Toggle({ checked, onChange, id, label, disabled }) {
  return (
    <label className="toggle" htmlFor={id}>
      {label != null && <span className="toggle__label">{label}</span>}
      <span className="toggle__track">
        <input
          id={id}
          type="checkbox"
          className="toggle__input"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="toggle__thumb" aria-hidden />
      </span>
    </label>
  )
}
