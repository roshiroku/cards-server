export function pick(o, keys) {
  const res = {};
  keys.forEach(k => res[k] = o[k]);
  return res;
}

export function omit(o, keys) {
  const res = {};
  Object.keys(o).forEach(k => !keys.includes(k) && (res[k] = o[k]));
  return res;
}
