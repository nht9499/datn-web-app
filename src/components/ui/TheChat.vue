<script lang="ts">
  import { computed, defineAsyncComponent, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
  // import { useFetchChats } from '@/hooks/useFetchChat'
  import { useEnhancer } from '@/app/enhancer'
  import { emojisType, emojis } from '@/constants/emojis'
  import { auth } from '@/constants/define'
  export default defineComponent({
    name: 'TheChat',
    components: {
      TheGalleries: defineAsyncComponent(() => import('./shared/TheGalleries.vue')),
    },
    props: {
      taskId: {
        type: String,
        default: () => '',
      },
      openChat: {
        type: Boolean,
        default: false,
      },
      isDeactivateChat: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['close'],
    setup(props, { emit }) {
      // const { listMessages, createMessage, subscribeTaskAvailable } = useFetchChats()
      const { authStore, showNotify } = useEnhancer()

      const scrollAreaRef = ref()
      const unsubscribe = ref()
      const text = ref('')
      const activeTab = ref('Frequently')

      const renderEmojiTab = computed<{ key: string; value: string }[]>(() =>
        Object.keys(emojisType).map((key) => ({ key, value: emojisType[key] }))
      )

      const renderEmojis = computed<{ key: string; value: string }[]>(() => {
        const objectMapEmoji = emojis[activeTab.value]
        return Object.keys(objectMapEmoji).map((key) => ({ key, value: objectMapEmoji[key] }))
      })

      const renderMessages = computed(() => Object.freeze(listMessages.value))

      const firstLabel = computed(() => auth.firstCharacter?.[authStore.role] ?? '')
      const isMe = (senderAuthInfo: AuthInfo) => authStore.uid === senderAuthInfo.uid

      const close = () => {
        emit('close')
      }

      const animateScroll = () => {
        scrollAreaRef.value.setScrollPercentage(
          'vertical',
          scrollAreaRef.value.$el.clientHeight,
          1000
        )
      }

      const send = () => {
        if (!text.value) return
        createMessage(props.taskId, text.value)
          .catch(() => {
            showNotify('Tin nhắn chưa được gửi, thử lại sau', 'negative')
          })
          .finally(() => {
            text.value = ''
            animateScroll()
          })
      }

      const handlePickEmoji = (emoji: string) => {
        text.value = text.value + emoji
      }

      watch(
        () => props.taskId,
        (newValue: string) => {
          unsubscribe.value = subscribeTaskAvailable(newValue)
        },
        {
          immediate: true,
        }
      )

      watch(
        () => props.openChat,
        (data) => {
          data && animateScroll()
        }
      )

      // TODO: Unsubscribe
      onBeforeUnmount(() => {
        unsubscribe.value && unsubscribe.value()
      })

      return {
        scrollAreaRef,
        text,
        close,
        send,
        renderMessages,
        activeTab,
        firstLabel,
        renderEmojiTab,
        renderEmojis,
        handlePickEmoji,
        isMe,
      }
    },
  })
</script>
<template>
  <div class="flex justify-between items-center q-px-sm q-py-xs">
    <span class="text-subtitle2">Chat với khách hàng</span>
    <q-btn icon="arrow_forward" flat round dense size="md" @click="close">
      <q-tooltip class="bg-dark text-body2 text-white"> Ẩn cửa sổ chat </q-tooltip>
    </q-btn>
  </div>
  <q-separator />
  <q-scroll-area ref="scrollAreaRef" style="height: calc(100% - 100px)">
    <div class="q-pa-sm row justify-center">
      <div class="full-width">
        <q-chat-message
          v-for="(message, index) in renderMessages"
          :key="index"
          :sent="isMe(message.senderAuthInfo)"
          :text-color="isMe(message.senderAuthInfo) ? 'white' : 'dark'"
          :bg-color="isMe(message.senderAuthInfo) ? 'primary' : 'grey-3'">
          <!-- <template #name>{{ isMe(message.senderAuthInfo) ? 'tôi' : 'KH' }}</template> -->
          <template #stamp>
            <span class="text-caption">
              {{ $filters.dateFromNow(message.createdAt) }}
            </span>
          </template>
          <template #avatar>
            <q-avatar
              :class="
                isMe(message.senderAuthInfo)
                  ? 'q-message-avatar--sent'
                  : 'q-message-avatar--received'
              "
              :color="isMe(message.senderAuthInfo) ? 'blue' : 'red'"
              size="md"
              text-color="white">
              {{ isMe(message.senderAuthInfo) ? firstLabel : 'KH' }}
            </q-avatar>
          </template>
          <div>
            <div v-for="(mes, mesIndex) in message.content" :key="mesIndex" class="text-body2">
              {{ mes }}
            </div>
            <TheGalleries :attachment-list="message.attachedImageUrlList || []" />
            <div
              v-for="(url, urlIndex) in message.attachedImageUrlList || []"
              :key="urlIndex + '1'"
              class="q-mb-xs">
              <q-img :src="url" />
            </div>
          </div>
        </q-chat-message>
        <p
          v-if="!renderMessages.length"
          class="text-body2 text-center q-mt-sm text-italic text-grey-8">
          Không có tin nhắn
        </p>
      </div>
    </div>
  </q-scroll-area>
  <template v-if="!isDeactivateChat">
    <q-separator />
    <div class="q-pa-sm">
      <q-input dense outlined v-model="text" placeholder="Aa" @keypress.enter="send">
        <template #append>
          <q-icon name="insert_emoticon" class="cursor-pointer">
            <q-popup-proxy style="width: 300px; height: 300px">
              <q-tabs
                v-model="activeTab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator>
                <q-tab
                  v-for="tab in renderEmojiTab"
                  :key="tab.key"
                  :name="tab.key"
                  :icon="tab.value" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel v-for="tab in renderEmojiTab" :key="tab.key" :name="tab.key">
                  <div class="row items-center">
                    <q-btn
                      flat
                      round
                      dense
                      v-for="emoji in renderEmojis"
                      :key="emoji.key"
                      class="text-subtitle1"
                      @click="() => handlePickEmoji(emoji.value)">
                      {{ emoji.value }}
                    </q-btn>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template #after v-if="text !== ''">
          <q-btn round dense color="primary" flat icon="send" @click="send" />
        </template>
      </q-input>
    </div>
  </template>
</template>
<style lang="scss" scoped>
  .my-emoji {
    vertical-align: middle;
    height: 2em;
    width: 2em;
  }
</style>
