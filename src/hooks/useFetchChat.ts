import { db } from '@/services/config'
import { COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import {
  collection,
  query,
  orderBy,
  doc,
  QuerySnapshot,
  DocumentData,
  onSnapshot,
} from 'firebase/firestore'
import { transformResponse } from '@/transform/object'
import { useImmer } from './useImmer'
import { taskApi } from '@/api/task'

export const useFetchChats = () => {
  const { loading } = useAsyncCall()
  const [listMessages, setListMessages] = useImmer([] as MessageClient[])

  const subscribeTaskAvailable = (id: string) => {
    const taskRef = doc(db, COLLECTION_NAME.TASKS, id)
    const messagesRef = collection(taskRef, COLLECTION_NAME.TASKS_MESSAGES)
    const composeCondition = [orderBy('createdAt', 'asc')]
    const q = query(messagesRef, ...composeCondition)
    return onSnapshot(q, (snapshot) => handleResult(snapshot))
  }

  const handleResult = (documentSnapshots: QuerySnapshot<DocumentData>) => {
    const listData = documentSnapshots.docs.map(transformResponse) as TaskMessageServerResponse[]
    const transformList = listData.map((item) => ({ ...item, content: [item.content] }))
    const groupedList = transformList.reduce((grouped: MessageClient[], mes: MessageClient) => {
      if (grouped.length === 0) grouped.unshift(mes)
      // *: Grouped by uid
      else if (grouped?.[0]?.senderAuthInfo.uid === mes.senderAuthInfo.uid) {
        Object.assign(grouped[0], {
          content: [...grouped?.[0]?.content, ...mes.content],
          createdAt: mes.createdAt,
        })
      } else grouped.unshift(mes)
      return grouped
    }, [])

    setListMessages((messages) => {
      Object.assign(messages, groupedList.reverse())
    })
  }

  const createMessage = async (taskId: string, content: string) => {
    return taskApi.sendMessage(taskId, { content, attachedImageBase64List: [] })
  }

  const resetData = () => {
    setListMessages((messages) => {
      messages.length = 0
    })
  }

  return {
    loading,
    listMessages,
    createMessage,
    subscribeTaskAvailable,
    resetData,
  }
}
