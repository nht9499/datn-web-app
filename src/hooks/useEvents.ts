import { inject, provide } from "vue";
import mitt from 'mitt';
import { EventType } from '@/constants/enums'

export const initEvents = () => {
  const emitter = mitt();
  provide('emit', emitter.emit)
  provide('on', emitter.on)
  provide('off', emitter.off)
}

export const useEvents = () => ({
  emit: inject('emit') as (e: string, payload?: AnyObject) => void,
  on: inject('on') as (e: string, handler: (payload?: AnyObject) => void) => void,
  off: inject('off') as (e: string) => void
})

export {
  EventType
}