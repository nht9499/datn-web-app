<template>
  <q-input ref="inputRef" v-model="amount" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { CurrencyInputOptions, useCurrencyInput } from 'vue-currency-input'

export default defineComponent({
  name: 'QCurrencyInput',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    initialValue: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { inputRef, setValue } = useCurrencyInput(props.options as CurrencyInputOptions)
    const amount = ref(props.modelValue || props.initialValue)
    watch(
      () => props.modelValue,
      (value: any) => {
        setValue(value)
      }
    )
    return { inputRef, amount }
  },
})
</script>
