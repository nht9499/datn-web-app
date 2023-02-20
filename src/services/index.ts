import { collection, query, getDocs } from "firebase/firestore";
import { db } from '@/services/config'
// firebaseApps previously initialized using initializeApp()
export const usersRef = collection(db, "usersData")
export const tasksRef = collection(db, "tasks")

export const snapshotToDoc = <T>(doc: any) => {
  const docData = doc.data() as T
  const docObject: T = {
    ...docData,
    id: doc.id,
  }

  return docObject
}

const getData = async () => {
  try {
    const q = query(usersRef)
    const querySnapshot = await getDocs(q);
    const data: any = [];
    querySnapshot.forEach(doc => {
      const snap = doc.data();
      data.push(snap);
    })
  } catch (error) {
    console.warn(error)
  }
}

export {
  getData
}