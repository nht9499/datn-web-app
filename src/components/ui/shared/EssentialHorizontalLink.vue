<template>
  <q-btn
    v-if="children.length === 0"
    :class="['q-mr-sm', { 'bg-gradient-primary': isActive }]"
    flat
    rounded
    no-caps
    :icon="icon"
    :disable="hidden"
    :label="title"
    :text-color="isActive ? 'white' : 'black'"
    :to="path" />
  <q-btn-dropdown
    v-else
    :label="title"
    :icon="icon"
    :disable="hidden"
    flat
    rounded
    no-caps
    dropdown-icon="expand_more"
    :menu-offset="[64, 8]"
    :class="['q-mr-sm', isActive ? 'text-white text-weight-bold bg-gradient-primary' : '']">
    <q-list>
      <EssentialLink v-for="child in children" :key="child" v-bind="child"></EssentialLink>
    </q-list>
    <!-- <q-menu fit transition-show="jump-down" transition-hide="jump-up" :offset="[0, 8]">
    </q-menu> -->
  </q-btn-dropdown>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useEnhancer } from '@/app/enhancer'
import EssentialLink from './EssentialLink.vue'
export default defineComponent({
  name: 'EssentialHorizontalLink',
  components: {
    EssentialLink,
  },
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
      default: '#',
    },
    icon: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      default: () => 0,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    children: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { route } = useEnhancer()

    const isActive = computed(() => {
      const matching = props.name.split('_')
      return matching.some((key) => route.name.match(new RegExp(key, 'g')))
    })

    const isHorizontal = computed(() => true)

    return {
      isActive,
      isHorizontal,
    }
  },
})
</script>
