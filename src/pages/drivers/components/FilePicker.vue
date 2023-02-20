<template>
  <div class="flex items-center">
    <q-img
      v-if="horizontal"
      @click="dialog = true"
      style="height: 175px; max-width: 300px; cursor: zoom-in"
      :fit="fit"
      :src="img ?? 'https://cdn.quasar.dev/img/avatar.png'" />
    <q-avatar v-else rounded :size="`${size}px`">
      <q-img
        @click="dialog = true"
        :src="img ?? 'https://cdn.quasar.dev/img/avatar.png'"
        :fit="fit"
        style="height: 175px; max-width: 300px; cursor: zoom-in" />
    </q-avatar>
    <div class="q-ml-md">
      <q-btn
        :disable="authStore.isAccountant"
        size="md"
        text-color="white"
        icon="upload"
        label="Tải ảnh lên"
        @click="onPickFile"
        class="bg-gradient-primary" />
    </div>
    <q-file class="hidden" ref="filePicker" accept=".gif, .jpg, image/*" v-model="file" />
  </div>
  <q-dialog maximized v-model="dialog">
    <div
      class="flex flex-center"
      @click="dialog = false"
      style="width: 100vw; height: 100vh; box-shadow: none; cursor: zoom-out">
      <q-img
        @click="dialog = false"
        style="height: 500px; max-width: 900px; box-shadow: none; cursor: zoom-out"
        fit="contain"
        :src="img ?? 'https://cdn.quasar.dev/img/avatar.png'" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref, watch } from 'vue'
  // import { useImage } from '@/hooks/useImage'
  import { useEnhancer } from '@/app/enhancer'
  import avatarDefault from '@/assets/img/user.png'
  import { driverApi } from '@/api/driver'

  export default defineComponent({
    name: 'FilePicker',
    props: {
      size: {
        type: Number,
        default: () => 12,
      },
      img: {
        type: String,
        default: () => avatarDefault,
      },
      horizontal: {
        type: Boolean,
        default: () => false,
      },
      fit: {
        type: String,
        default: () => 'cover',
      },
    },
    emits: ['onAvtChange'],
    setup(props, { emit }) {
      const state = reactive({
        uid: '',
        name: '',
        gender: '',
        telephone: '',
        status: [],
        hover: false,
      })
      const filePicker = ref()
      const file = ref(null)
      const dialog = ref(false)
      // const { uploadImage } = useImage()
      const { authStore } = useEnhancer()

      // watch(
      //   file,
      //   async () => {
      //     if (file.value) {
      //       const { type } = file.value
      //       const blob = new Blob([file.value], { type: type })
      //       const date = Math.round(new Date().getTime() / 1000)
      //       const url = await uploadImage(blob, date)
      //       emit('onAvtChange', url)
      //     }
      //   },
      //   { immediate: true }
      // )
      const blobToBase64 = (blob: Blob) => {
        return new Promise((resolve, _) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      }
      watch(
        file,
        async () => {
          if (file.value) {
            const { type } = file.value
            const blob = new Blob([file.value], { type: type })
            const base64 = await blobToBase64(blob)
            const res = await driverApi.uploadImage({
              imageSource: {
                type: 'driverProfile',
              },
              imageBase64: (base64 as string).replace(/^data:.+;base64,/, ''),
            })
            emit('onAvtChange', res.imageUrl)
          }
        },
        { immediate: true }
      )

      const onPickFile = () => {
        filePicker.value.pickFiles()
      }

      return {
        ...toRefs(state),
        filePicker,
        file,
        authStore,
        dialog,

        onPickFile,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .img-caption {
    background: rgba($color: #000000, $alpha: 0.47);
  }
</style>
