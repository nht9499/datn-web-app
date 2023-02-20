import { inject, provide, readonly, ref } from "vue";

export const initMeta = () => {
  const defaultTitle = ref('')

  const setTitle = (title: string) => {
    defaultTitle.value = title
  }

  provide('setTitle', setTitle)

  return {
    title: readonly(defaultTitle)
  }
}

export const useMeta = () => ({
  setTitle: inject('setTitle') as (e: string) => void,
})