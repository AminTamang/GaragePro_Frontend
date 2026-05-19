import { useEffect, useState } from 'react';
import { validateFields, hasErrors } from '../utils/formValidation';

function FieldInput({ field, value, onChange, disabled }) {
  const common = {
    name: field.name,
    value: value ?? '',
    placeholder: field.placeholder || field.label,
    onChange: (e) => onChange(field.name, e.target.value),
    disabled: disabled,
  };

  if (field.type === 'textarea') {
    return <textarea {...common} />;
  }

  if (field.type === 'select') {
    return (
      <select {...common} value={value ?? ''}>
        <option value="">{field.placeholder || `Select ${field.label}`}</option>
        {(field.options || []).map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type || 'text'}
      {...common}
      min={field.min}
      max={field.max}
      step={field.step}
    />
  );
}

export default function CrudForm({ fields, values, onChange, onSubmit, submitLabel, errors: externalErrors, disabled, children }) {
  const [errors, setErrors] = useState(externalErrors || {});

  useEffect(() => {
    if (externalErrors) setErrors(externalErrors);
  }, [externalErrors]);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateFields(fields, values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSubmit(values);
  }

  return (
    <form className="crud-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.name} className={field.fullWidth ? 'full-width' : ''}>
            <span className="field-label">{field.label}{field.required ? ' *' : ''}</span>
            <FieldInput field={field} value={values[field.name]} onChange={onChange} disabled={disabled} />
            {errors[field.name] && <small className="field-error">{errors[field.name]}</small>}
            {field.hint && !errors[field.name] && <small className="field-hint">{field.hint}</small>}
          </label>
        ))}
      </div>
      {children}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={disabled}>{submitLabel}</button>
      </div>
    </form>
  );
}
