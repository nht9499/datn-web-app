// eslint-disable-next-line @typescript-eslint/no-unused-vars
const msg = Object.entries(import.meta.glob<any>('/src/locales/vi/*.yml', { eager: true })).map(([key, value]) => {
  return value.default
})

export default msg.reduce((pre, cur) => {
  return { ...pre, ...cur }
}, {})

