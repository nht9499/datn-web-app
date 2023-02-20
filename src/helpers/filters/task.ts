import { task } from '@/constants/define'

export const inject = () => ({
  getTaskStatusLabel(key: string) {
    return task.taskStatus?.[key] ?? ''
  },
  getTaskStatusColor(key: string) {
    return task.taskStatusColors?.[key] ?? ''
  },
  getTaskActionLabel(key: string) {
    return task.taskActions?.[key] ?? ''
  }
})