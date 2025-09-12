export const updateAt = (arr, idx, patch) =>
    arr.map((v, i) => (i === idx ? { ...v, ...patch } : v));

export const removeAt = (arr, idx) => arr.filter((_, i) => i !== idx);
