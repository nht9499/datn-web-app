<template>
  <q-card flat>
    <div class="row q-col-gutter-sm">
      <div class="col-4 col-md-3">
        <q-select
          v-model="statusFilter"
          :options="supportFields"
          label="Lọc theo trạng thái"
          outlined
          dense
          options-dense
          emit-value
          map-options
          options-cover />
      </div>
      <div class="col">
        <q-input
          v-model="name"
          outlined
          @clear="handleReset"
          clearable
          @keypress.enter="handleSearch"
          label="Nhập tên Bác sĩ cần tìm, vd: le thanh binh"
          dense />
      </div>
      <div class="col-4 col-md-3">
        <div class="flex items-center">
          <q-btn
            icon="search"
            class="bg-gradient-primary"
            text-color="white"
            label="Tìm kiếm"
            rounded
            no-caps
            @click="handleSearch" />
          <q-btn
            v-if="hasCondition"
            color="red"
            flat
            no-caps
            label="Xóa bộ lọc"
            @click="handleReset" />
        </div>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
  import { standardizedParams } from '@/util/object'
  import { useEnhancer } from '@/app/enhancer'
  import { AppRole, Status, DoctorStatus } from '@/constants/enums'
  import isEmpty from 'lodash/isEmpty'
  import globalFilter from '@/helpers/filters'

  export default defineComponent({
    name: 'TheSearch',
    setup() {
      const initialState = {
        accountType: '',
        status: '',
        name: '',
      }
      const state = reactive({ ...initialState })
      const statusFilter = ref('all')

      const { route, router } = useEnhancer()

      const hasCondition = computed(() => !isEmpty(route.query))
      const queryParams = computed<AnyObject>(() => ({
        ...route.query,
      }))

      const resetState = () => {
        Object.assign(state, initialState)
        statusFilter.value = 'all'
      }

      const handleSearch = () => {
        const query = standardizedParams({
          ...(state.name && {
            name: globalFilter.removeAccents(state?.name?.toLowerCase() ?? ''),
          }),
          ...(statusFilter.value !== 'all' && {
            status: statusFilter.value,
          }),
        })
        router.push({ name: route.name as string, query })
      }
      const handleReset = () => {
        resetState()
        router.push({ name: route.name as string, query: {} })
      }

      onMounted(() => {
        // TODO set initial query params
        Object.assign(state, {
          name: route.query?.name ?? '',
          status: route.query?.status ?? '',
          accountType: route.query?.accountType ?? '',
        })
        route.query?.status && (statusFilter.value = route.query.status)
      })

      return {
        ...toRefs(state),
        queryParams,
        handleSearch,
        hasCondition,
        handleReset,
        statusFilter,
        statusOptions: [
          {
            label: 'Tất cả',
            value: '',
          },
          {
            label: globalFilter.getStatus(Status.ACTIVE),
            value: Status.ACTIVE,
          },
          {
            label: globalFilter.getStatus(Status.DEACTIVE),
            value: Status.DEACTIVE,
          },
        ],
        typeOptions: [
          {
            label: 'Tất cả',
            value: '',
          },
          {
            label: globalFilter.getRoleLabel(AppRole.staff),
            value: AppRole.staff,
          },
          {
            label: globalFilter.getRoleLabel(AppRole.accountant),
            value: AppRole.accountant,
          },
        ],
        supportFields: [
          {
            label: globalFilter.getDoctorStatus(DoctorStatus.inReview),
            value: DoctorStatus.inReview,
          },
          {
            label: globalFilter.getDoctorStatus(DoctorStatus.activated),
            value: DoctorStatus.activated,
          },
          {
            label: globalFilter.getDoctorStatus(DoctorStatus.deactivated),
            value: DoctorStatus.deactivated,
          },
          {
            label: 'Tất cả',
            value: 'all',
          },
        ],
      }
    },
  })
</script>
<style lang="scss" scoped></style>
