<template>
  <q-card
    class="q-mb-md"
    v-if="(authStore.isStaff || authStore.isAccountant) && finalList.length > 0">
    <div class="flex justify-between items-center q-px-md q-py-sm">
      <p class="q-table__title">Tài xế chưa kích hoạt</p>
      <span v-if="finalList.length > 4">
        <q-btn size="sm" dense outline icon="chevron_right" no-caps @click="executeScroll" />
      </span>
    </div>
    <q-virtual-scroll
      ref="virtualListRef"
      :items="finalList"
      virtual-scroll-horizontal
      v-slot="{ item, index }">
      <q-card flat class="q-mb-md q-mx-sm" style="border: solid 1px #0000001f">
        <q-item :key="index">
          <q-item-section avatar>
            <q-btn
              size="md"
              color="primary"
              no-caps
              dense
              push
              glossy
              label="Chi tiết"
              @click="clickEdit(item)" />
          </q-item-section>
          <q-item-section class="justify-start">
            <q-item-label class="text-body2">{{ item.name }}</q-item-label>
            <q-item-label caption>
              {{ item?.telephone ?? 'Chưa có số điện thoại' }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{
              $filters.dateFormat(item.createdAt, 'DD/MM HH:mm')
            }}</q-item-label>
            <q-badge class="q-mt-xs" :color="$filters.getDriverStatusColor(item.status)">
              {{ $filters.getDriverStatusLabel(item.status) }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-card>
    </q-virtual-scroll>
  </q-card>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchDrivers } from '@/hooks/useFetchDriver'
  import { DriverStatus } from '@/constants/enums'

  export default defineComponent({
    name: 'DriverWaitingList',
    emits: ['isEmpty'],
    setup(_, { emit }) {
      const { listDriversWaiting, subscribeDriverAvailable } = useFetchDrivers()
      const { authStore, router } = useEnhancer()
      const unsubscribeDriverAvailable = ref()
      const virtualListRef = ref()
      const finalList = ref([])

      const clickEdit = (row: AnyObject) => {
        router.push({ name: 'drivers-id-detail', params: { id: row.uid } })
      }

      const executeScroll = () => {
        virtualListRef.value.scrollTo(finalList.value.length, 'start-force')
      }

      watch(listDriversWaiting, (list) => {
        const wait: any = []
        const tooLong: any = []
        const deletionRequest: any = []
        list.map((item: any) => {
          if (item.status === DriverStatus.WAITING) {
            wait.push(item)
          } else if (item.status === DriverStatus.WAITING_TOO_LONG) {
            tooLong.push(item)
          } else {
            deletionRequest.push(item)
          }
        })
        finalList.value = tooLong.concat(wait).concat(deletionRequest)
        if (finalList.value.length === 0) {
          emit('isEmpty', true)
        } else {
          emit('isEmpty', false)
        }
        // finalList.value = []
      })

      onMounted(() => {
        if (!authStore.isAdmin) {
          unsubscribeDriverAvailable.value = subscribeDriverAvailable()
        }
      })

      onBeforeUnmount(() => {
        unsubscribeDriverAvailable.value && unsubscribeDriverAvailable.value()
      })

      return {
        virtualListRef,
        finalList,
        authStore,
        clickEdit,
        executeScroll,
      }
    },
  })
</script>
