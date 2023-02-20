import { COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import { storage } from '@/services/config'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { organizationApi } from '@/api/organization'

export const useImage = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  // const url = ref()
  
  const uploadImage = async (payload: any) => {
    try {
      // setLoading(true)
      // const storageRef = ref(storage, `${COLLECTION_NAME.FILES}/${name}.png`);
      // return await uploadBytes(storageRef, blob).then(async() => {
      //   return await getDownloadURL(storageRef).then((downloadURL) => {
      //     setLoading(false)
      //     return downloadURL
      //   });
      // });
      return await organizationApi.uploadFile('mock', payload)
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
  }

  
  return {
    // url,
    loading,
    errorMsg,
    uploadImage
  }
}