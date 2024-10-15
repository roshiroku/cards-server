export function boolean($default = false) {
  return { type: Boolean, default: $default };
}

export function number(required = false) {
  return { type: Number, required };
}

export function string(required = false, maxLength = 256) {
  const requiredFn = typeof required == "function" ? required : () => required;

  return {
    type: String,
    trim: true,
    validate: {
      validator(value) {
        return !requiredFn.call(this) || (value && value.length > 1);
      },
      message: "Path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length (2)."
    },
    required: requiredFn,
    maxLength
  };
}

export function phone(required = false) {
  return {
    type: String,
    match: /0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/,
    required,
  };
}

export function url(required = false) {
  return {
    type: String,
    match: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/,
    trim: true,
    lowercase: true,
    required
  }
}

export function email(required = false) {
  return {
    type: String,
    match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    trim: true,
    lowercase: true,
    unique: true,
    required
  }
}

export function image(required = false) {
  return {
    url: url(required),
    alt: string(required),
  };
}
