
// TODO runtime env
export const isDev = import.meta.env.VITE_MODE === 'dev'
export const isStag = import.meta.env.VITE_MODE === 'stag'
export const isProd = import.meta.env.VITE_MODE === 'prod'
export const envMode = import.meta.env.VITE_MODE
