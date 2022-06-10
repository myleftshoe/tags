export const alpha = (prop) => (a, b) => a[prop].localeCompare(b[prop])

export const num = (prop) => (a, b) => Number(a[prop]) > Number(b[prop]) ? 1 : -1