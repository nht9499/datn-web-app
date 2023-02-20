import { driver, gender, notify, status, work, tagList } from '@/constants/define'

export const inject = () => ({
  getDriverStatusLabel(key: string) {
    return driver.driverStatus?.[key] ?? ''
  },
  getDriverStatusColor(key: string) {
    return driver.driverStatusColor?.[key] ?? ''
  },
  getGenderLabel(key: string) {
    return gender.genderOpt?.[key] ?? ''
  },
  getStatus(key: string) {
    return status.statusOpt?.[key] ?? ''
  },
  getStatusColor(key: string) {
    return status.statusColors?.[key] ?? ''
  },
  getWorkingStatusColor(key: string) {
    return work.workingStatusColors?.[key] ?? ''
  },
  nameToArray(name: string) {
    const array = name.toLowerCase().split(' ')
    const nameAsArray: string[] = []
    array.forEach((item, index) => {
      for (let i = index; i < array.length; i++) {
        if (i === index) nameAsArray.push(item)
        else {
          let final = ''
          for (let j = index; j <= i; j++) {
            final += array[j] + ' '
          }
          nameAsArray.push(final.trim())
        }
      }
    })
    return nameAsArray
  },
  getIconNotify(key: string) {
    return notify.notifyIcon?.[key] ?? ''
  },
  getNotifyColor(key: string) {
    return notify.notifyColor?.[key] ?? ''
  },
  getWorkingStatusLabel(key: string) {
    return work.workingStatus?.[key] ?? ''
  },
  removeAccents(name: string) {
    const AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ]
    for (let i=0; i<AccentsMap.length; i++) {
      const re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      const char = AccentsMap[i][0];
      name = name.replace(re, char);
    }
    return name
  },
  getTagLabel(key: string) {
    return tagList.tagList?.[key] ?? ''
  },
  getTagIcon(key: string) {
    return tagList.tagListIcon?.[key] ?? ''
  },
})