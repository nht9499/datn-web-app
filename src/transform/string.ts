export const formatSecond = (second: number) => {
  let hour_str = `${Math.floor(second / 60)}`
  let second_str = `${Math.ceil(second % 60)}`
  if (hour_str.length === 1) {
    hour_str = `0${hour_str}`
  }
  if (second_str.length === 1) {
    second_str = `0${second_str}`
  }
  return `${hour_str}:${second_str}`
}

export const getToken = (payload: any) => {
  try {
    const data = JSON.parse(payload)
    return data?.auth?.token
  } catch (error) {
    return null
  }
}

export const nameAsArrayFromName = (name: string) => {
  const words = name.toLocaleLowerCase().split(' ')
  let nameAsArray = []
  // for (let i = 1; i <= words.length; i++) {
  //   for (let j = 0; j < words.length - i + 1; j++) {
  //     nameAsArray.push(words.slice(j, j + i).join(' '))
  //   }
  // }
  for (let i = 1; i <= words.length; i++) {
    nameAsArray.push(words.slice(0, 0 + i).join(' '))
    nameAsArray.push(words.slice(words.length - i, words.length).join(' '))
  }
  nameAsArray = [...new Set(nameAsArray)]
  return nameAsArray
}
