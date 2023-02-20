import { ref } from 'vue'
export const useAsyncCall = () => {
  const loading = ref(false)
  const errorMsg = ref('')
  const successMsg = ref('')

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setErrorMsg = (mes = '') => {
    errorMsg.value = mes
  }

  const setSuccessMsg = (mes = '') => {
    successMsg.value = mes
  }

  return { loading, setLoading, errorMsg, setErrorMsg, successMsg, setSuccessMsg }
}
