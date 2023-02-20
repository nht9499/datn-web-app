<template>
  <q-card flat>
    <div class="row q-col-gutter-sm">
      <div class="col-3 col-md-3">
        <q-select
          v-model="selectedSearchKey"
          :options="supportFields"
          outlined
          dense
          options-dense
          emit-value
          @update:model-value="onChangeSearchKey"
          map-options
          options-cover />
      </div>
      <div class="col">
        <q-input
          v-if="selectedSearchKey === 'name'"
          @keypress.enter="clickSearchBtn"
          dense
          outlined
          v-model="name"
          label="Theo tên" />
        <q-input
          v-if="selectedSearchKey === 'telephone'"
          @keypress.enter="clickSearchBtn"
          dense
          outlined
          v-model="telephone"
          label="Theo số điện thoại" />
        <q-input
          v-if="selectedSearchKey === 'bikeNumber'"
          @keypress.enter="clickSearchBtn"
          dense
          outlined
          v-model="bikeNumber"
          label="Theo biển số xe" />
        <q-select
          v-if="selectedSearchKey === 'gender'"
          @keypress.enter="clickSearchBtn"
          dense
          outlined
          v-model="gender"
          :options="genderOptions"
          :option-label="(opt) => $filters.getGenderLabel(opt)"
          label="Theo giới tính" />
        <q-select
          v-if="selectedSearchKey === 'status'"
          @keypress.enter="clickSearchBtn"
          outlined
          dense
          v-model="status"
          multiple
          :options="statusOptions"
          :option-label="(opt) => $filters.getDriverStatusLabel(opt)"
          options-dense
          label="Theo trạng thái">
          <template #selected-item="scope">
            <!-- <q-chip removable dense @remove="scope.removeAtIndex(scope.index)" :class="scope.opt">
              {{ $filters.getDriverStatusLabel(scope.opt) }}
            </q-chip> -->
            <q-badge
              removable
              @remove="scope.removeAtIndex(scope.index)"
              rounded
              class="q-px-sm q-py-xs q-mr-xs q-mt-xs"
              :color="$filters.getDriverStatusColor(scope.opt)">
              {{ $filters.getDriverStatusLabel(scope.opt) }}
            </q-badge>
          </template>
        </q-select>
        <q-select
          v-if="selectedSearchKey === 'workingStatus'"
          @keypress.enter="clickSearchBtn"
          outlined
          dense
          v-model="workingStatus"
          multiple
          :options="workingStatusOptions"
          :option-label="(opt) => $filters.getWorkingStatusLabel(opt)"
          options-dense
          label="Theo trạng thái hoạt động">
          <template #selected-item="scope">
            <!-- <q-chip removable dense @remove="scope.removeAtIndex(scope.index)" :class="scope.opt">
              {{ $filters.getDriverStatusLabel(scope.opt) }}
            </q-chip> -->
            <q-badge
              removable
              @remove="scope.removeAtIndex(scope.index)"
              rounded
              class="q-px-sm q-py-xs q-mr-xs q-mt-xs"
              :color="$filters.getWorkingStatusColor(scope.opt)">
              {{ $filters.getWorkingStatusLabel(scope.opt) }}
            </q-badge>
          </template>
        </q-select>
      </div>
      <div class="col-4 col-md-3">
        <div class="flex items-center q-gutter-sm">
          <q-btn
            icon="search"
            class="bg-gradient-primary"
            text-color="white"
            label="Tìm kiếm"
            rounded
            no-caps
            @click="clickSearchBtn" />
          <q-btn
            class="q-px-sm"
            v-if="!defaultCondition"
            color="red"
            flat
            no-caps
            label="Xóa bộ lọc"
            @click="handleReset" />
        </div>
      </div>
    </div>
    <div class="row q-mt-sm">
      <div class="col-9 flex items-center">
        <div v-if="hasCondition && false">
          <span v-if="hasCondition" class="text-caption text-weight-medium text-dark q-mr-lg"
            >Kết quả:</span
          >
          <!-- <span v-if="queryParams.uid" class="text-caption q-mr-md">
            <span class="text-weight-medium">ID: </span>
            {{ queryParams.uid }}
          </span> -->
          <span v-if="queryParams.name" class="text-caption q-mr-md">
            <span class="text-weight-medium">Tên: </span>
            {{ queryParams.name }}
          </span>
          <span v-if="queryParams.telephone" class="text-caption q-mr-md">
            <span class="text-weight-medium">Số điện thoại: </span>
            {{ queryParams.telephone }}
          </span>
          <span v-if="queryParams.bikeNumber" class="text-caption q-mr-md">
            <span class="text-weight-medium">Biển số xe: </span>
            {{ queryParams.bikeNumber }}
          </span>
          <span v-if="queryParams.gender" class="text-caption q-mr-md">
            <span class="text-weight-medium">Giới tính: </span>
            {{ queryParams.gender }}
          </span>
          <span v-if="queryParams.sort" class="text-caption q-mr-md">
            <span class="text-weight-medium">Tiền ký quỹ: </span>
            {{ queryParams.sort.split(',')[1] === 'desc' ? 'Giảm dần' : 'Tăng dần' }}
          </span>
          <!-- <span
            v-if="
              (queryParams.status && queryParams.status.length === 1) ||
              selectedSearchKey === 'status'
            "
            class="text-caption"> -->
          <span v-if="queryParams.status.length > 0" class="text-caption">
            <span class="text-weight-medium">Trạng thái: </span>
            <!-- <q-chip dense v-for="status in queryParams.status" :key="status" :class="status">
              {{ $filters.getDriverStatusLabel(status) }}
            </q-chip> -->
            <q-badge
              v-for="status in queryParams.status"
              :key="status"
              rounded
              class="q-px-sm q-py-xs q-mr-xs"
              :color="$filters.getDriverStatusColor(status)">
              {{ $filters.getDriverStatusLabel(status) }}
            </q-badge>
          </span>
        </div>
      </div>
      <!-- <div class="col-3">
        <div class="flex items-center justify-end">
          <q-btn
            icon="search"
            class="bg-gradient-primary"
            text-color="white"
            label="Tìm kiếm"
            rounded
            no-caps
            @click="clickSearchBtn" />
          <q-btn
            v-if="!defaultCondition"
            color="red"
            flat
            no-caps
            label="Xóa bộ lọc"
            @click="handleReset" />
        </div>
      </div> -->
    </div>
  </q-card>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, toRefs, onMounted, ref, watch } from 'vue'
  import { standardizedParams } from '@/util/object'
  import { useEnhancer } from '@/app/enhancer'
  import { DriverStatus, Gender, WorkingStatus } from '@/constants/enums'
  import globalFilter from '@/helpers/filters'

  export default defineComponent({
    name: 'TheSearch',
    props: {
      isSort: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['onSearch'],
    setup(props, { emit }) {
      const defaultState = {
        uid: '',
        status: [DriverStatus.ACTIVE] as string[],
        name: '',
        gender: '',
        telephone: '',
        bikeNumber: '',
        sort: '',
        workingStatus: [],
      }
      const state = reactive({ ...defaultState })

      const { route, router } = useEnhancer()

      const selectedSearchKey = ref('status')

      const defaultCondition = computed(
        () =>
          queryParams.value.status?.includes(DriverStatus.ACTIVE) &&
          queryParams.value.status?.length === 1 &&
          Object.keys(queryParams.value).length === 1
      )
      // const hasCondition = computed(() => !defaultCondition.value)
      const hasCondition = computed(() => Object.keys(route.query).length > 0)
      const queryParams = computed<AnyObject>(() => ({
        ...route.query,
        status: !route.query?.status ? [] : [route.query.status].flatMap((item) => item),
      }))

      watch(
        () => props.isSort,
        () => {
          const tempStatus = route.query.status ?? null
          handleDefault()
          selectedSearchKey.value = 'status'
          if (tempStatus) {
            state.status = tempStatus
          }
        }
      )

      const clickSearchBtn = () => {
        if (route.query?.sort) state.sort = ''
        handleSearch()
      }

      const handleSearch = () => {
        if (state.name || state.telephone)
          state.status = [DriverStatus.ACTIVE, DriverStatus.DEACTIVE]
        if (state.workingStatus.length) state.status = []
        const query = standardizedParams({
          ...(state.uid && {
            uid: state.uid,
          }),
          ...(state.name && {
            name: state.name.toLowerCase(),
          }),
          ...(state.telephone && {
            telephone: state.telephone,
          }),
          ...(state.gender &&
            state.gender !== 'all' && {
              gender: state.gender,
            }),
          ...(state.status && {
            status: state.status,
          }),
          ...(state.workingStatus.length > 0 && {
            workingStatus: state.workingStatus,
          }),
          ...(state.sort && {
            sort: state.sort,
          }),
          ...(state.bikeNumber && {
            bikeNumber: state.bikeNumber,
          }),
        })
        emit('onSearch')
        router.push({ name: route.name as string, query })
      }

      const onChangeSearchKey = () => {
        handleDefault()
        clickSearchBtn()
      }
      const handleReset = () => {
        handleDefault()
        handleSearch()
        selectedSearchKey.value = 'status'
      }
      const handleDefault = () => {
        Object.assign(state, defaultState)
      }

      onMounted(async () => {
        Object.assign(state, {
          uid: route.query?.uid ?? '',
          status: !route.query?.status
            ? [DriverStatus.ACTIVE]
            : [route.query.status].flatMap((item) => item),
          gender: route.query?.gender ?? '',
          name: route.query?.name ?? '',
          telephone: route.query?.telephone ?? '',
          bikeNumber: route.query?.bikeNumber ?? '',
          workingStatus: !route.query?.workingStatus
            ? []
            : [route.query.workingStatus].flatMap((item) => item),
          sort: route.query?.sort ?? '',
        })
        if (route.query?.telephone) {
          selectedSearchKey.value = 'telephone'
        } else if (route.query?.bikeNumber) {
          selectedSearchKey.value = 'bikeNumber'
        } else if (route.query?.gender) {
          selectedSearchKey.value = 'gender'
        } else if (route.query?.name) {
          selectedSearchKey.value = 'name'
        } else if (route.query?.workingStatus) {
          selectedSearchKey.value = 'workingStatus'
        } else {
          selectedSearchKey.value = 'status'
        }
        handleSearch()
      })

      return {
        ...toRefs(state),
        queryParams,
        hasCondition,
        selectedSearchKey,
        defaultCondition,
        statusOptions: [
          DriverStatus.WAITING,
          DriverStatus.WAITING_TOO_LONG,
          DriverStatus.ACTIVE,
          DriverStatus.DEACTIVE,
          DriverStatus.DELETION_REQUESTED,
          DriverStatus.DELETED,
        ],
        workingStatusOptions: [
          WorkingStatus.OOS,
          WorkingStatus.OOS_TOO_LONG,
          WorkingStatus.WAITING,
          WorkingStatus.WORKING,
        ],
        genderOptions: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.ALL],
        supportFields: [
          {
            label: 'Tìm theo tên',
            value: 'name',
          },
          {
            label: 'Tìm theo số điện thoại',
            value: 'telephone',
          },
          // {
          //   label: 'Tìm theo biển số xe',
          //   value: 'bikeNumber',
          // },
          // {
          //   label: 'Tìm theo giới tính',
          //   value: 'gender',
          // },
          {
            label: 'Tìm theo trạng thái',
            value: 'status',
          },
          {
            label: 'Tìm theo trạng thái hoạt động',
            value: 'workingStatus',
          },
        ],

        handleSearch,
        onChangeSearchKey,
        handleReset,
        clickSearchBtn,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .waiting {
    background-color: $waiting;
  }
  .waiting_too_long {
    background-color: $waiting_too_long;
  }
  .active {
    background-color: $active;
  }
  .deactive {
    background-color: $deactive;
  }
</style>
