export function validateFields(fields, values) {
  const errors = {};

  for (const field of fields) {
    const raw = values[field.name];
    const value = raw === null || raw === undefined ? '' : String(raw).trim();

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }

    if (!value) continue;

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.name] = 'Enter a valid email address.';
    }

    if (field.type === 'number') {
      const num = Number(raw);
      if (Number.isNaN(num)) {
        errors[field.name] = `${field.label} must be a number.`;
      } else {
        if (field.min !== undefined && num < field.min) {
          errors[field.name] = `${field.label} must be at least ${field.min}.`;
        }
        if (field.max !== undefined && num > field.max) {
          errors[field.name] = `${field.label} must be at most ${field.max}.`;
        }
      }
    }

    if (field.minLength && value.length < field.minLength) {
      errors[field.name] = `${field.label} must be at least ${field.minLength} characters.`;
    }
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
