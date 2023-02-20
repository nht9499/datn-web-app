<template>
  <q-item
    clickable
    v-close-popup
    :active="isActive"
    :to="path"
    active-class="text-primary bg-primary-light text-weight-medium">
    <q-item-section avatar> <q-icon :name="icon" /> </q-item-section>
    <q-item-section>{{ title }}</q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useEnhancer } from '@/app/enhancer'
export default defineComponent({
  name: 'EssentialLink',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '/',
    },
    icon: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      default: () => 0,
    },
    children: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { route } = useEnhancer()

    const isActive = computed(() => {
      return route.name.startsWith(props.name)
    })

    return {
      isActive,
    }
  },
})
</script>
