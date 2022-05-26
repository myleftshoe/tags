const isProd = process.env.NODE_ENV === 'production'

export const ATRIA_COOKIE = isProd ? process.env.ATRIA_COOKIE : import.meta.env.VITE_ATRIA_COOKIE
export const MINEW_USERNAME = isProd ? process.env.MINEW_USERNAME : import.meta.env.VITE_MINEW_USERNAME
export const MINEW_PASSWORD = isProd ? process.env.MINEW_PASSWORD : import.meta.env.VITE_MINEW_PASSWORD
export const AUTHCODE = isProd ? process.env.AUTHCODE : import.meta.env.VITE_AUTHCODE
export const COOKIE = isProd ? process.env.COOKIE : import.meta.env.VITE_COOKIE
