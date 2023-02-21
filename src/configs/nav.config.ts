import { AppRole } from '@/constants/enums'
import shipperIcon from '@/assets/img/movers-icon.svg?url'
import staffIcon from '@/assets/img/customer-care-icon.svg?url'

export const navConfigs: RouterLink[] = [
  {
    name: 'dashboard', // uniq
    title: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    level: 0,
    groups: [AppRole.admin, AppRole.staff],
    children: [],
  },
  // {
  //   name: 'doctors',
  //   title: 'Quản lý Bác sĩ',
  //   icon: 'group',
  //   path: '/doctors',
  //   level: 0,
  //   groups: [AppRole.admin, AppRole.staff],
  //   children: [],
  // },
  {
    name: 'tests',
    title: 'Kiểm tra tương đồng',
    icon: 'bug_report',
    path: '/tests',
    level: 0,
    groups: [AppRole.admin, AppRole.staff, AppRole.user],
    children: [],
  },
  {
    name: 'storage',
    title: 'Quản lý kho ngữ liệu',
    icon: 'storage',
    path: '/storage',
    level: 0,
    groups: [AppRole.admin, AppRole.staff, AppRole.user],
    children: [],
  },
  {
    name: 'histories',
    title: 'Lịch sử kiểm tra',
    icon: 'history',
    path: '/histories',
    level: 0,
    groups: [AppRole.admin, AppRole.staff, AppRole.user],
    children: [],
  },
  {
    name: 'organizations',
    title: 'Tổ chức',
    icon: 'group',
    path: '/organizations',
    level: 0,
    groups: [AppRole.admin, AppRole.staff, AppRole.user],
    children: [],
  },
]

export const guardConfig = {
  children: navConfigs,
}

export const getRedirectConfig = (role: string) => {
  const config = {
    [AppRole.admin]: '/tests',
    [AppRole.accountant]: '/tests',
    [AppRole.staff]: '/tests',
  } as AnyObject

  return config?.[role] ?? '/'
}
