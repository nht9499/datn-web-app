<template>
  <!-- style="height: calc(100vh - 230px)" -->
  <div>
    <q-table
      class="table-staff"
      row-key="id"
      style="max-height: calc(100vh - 205px)"
      v-model:pagination="pagination"
      :rows="listDoctors"
      :columns="columns"
      separator="horizontal"
      no-data-label="Không có dữ liệu"
      hide-pagination
      binary-state-sort>
      <template #top>
        <q-space />
        <div class="col">
          <the-search />
        </div>
      </template>

      <template #body-cell-name="props">
        <q-td :props="props">
          <q-avatar class="q-mr-xs" size="md">
            <img :src="props.row.avatarImageUrl ?? defaultAvatar" />
          </q-avatar>
          {{ props.row.fullName }}
        </q-td>
      </template>

      <template #body-cell-birthday="props">
        <q-td :props="props">
          {{ $filters.dateFormat(props.row.birthday, 'DD/MM/YYYY') }}
        </q-td>
      </template>

      <template #body-cell-contact="props">
        <q-td :props="props">
          <div class="text-caption text-italic">
            <q-icon size="xs" name="mail" />
            {{ props.row.email || '-' }}
          </div>
          <div class="text-caption text-italic">
            <q-icon size="xs" name="call" />
            {{ props.row.phoneNumber || '-' }}
          </div>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            rounded
            class="q-px-sm q-py-xs"
            :color="$filters.getDoctorStatusColor(props.row.status)">
            {{ $filters.getDoctorStatus(props.row.status) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-withdrawal="props">
        <q-td :props="props">
          <q-badge
            v-if="props.row.lastWithdrawalSnapshot"
            rounded
            class="q-px-sm q-py-xs"
            :color="$filters.getTransferColor(props.row.lastWithdrawalSnapshot?.status)">
            {{ $filters.dateFormat(props.row.lastWithdrawalSnapshot?.createdAt) }}
          </q-badge>
          <span v-else>test</span>
        </q-td>
      </template>

      <template #body-cell-updatedAt="props">
        <q-td :props="props">
          {{ $filters.dateFromNow(props.row.updatedAt || null) }}
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" style="min-width: 100px; padding: 0px">
          <q-btn
            style="min-width: 62px"
            class="q-ml-sm"
            no-caps
            flat
            dense
            size="small"
            color="primary"
            label="Công cụ"
            icon-right="expand_more">
            <q-menu>
              <q-list style="min-width: 180px">
                <q-item dense clickable v-close-popup @click="clickEdit(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon size="xs" name="edit" />
                  </q-item-section>
                  <q-item-section class="text-body2">Thông tin chi tiết</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>

      <template #bottom v-if="isLoadmore">
        <div class="text-center full-width">
          <q-btn
            padding="xs md"
            :loading="loading"
            color="white"
            icon="cached"
            text-color="black"
            no-caps
            label="Tải thêm"
            @click="onLoadmore" />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, watch, ComputedRef } from 'vue'
  import { QTableProps } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchDoctors } from '@/hooks/useFetchDoctors'
  import TheSearch from './Search.vue'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  // import globalFilter from '@/helpers/filters'
  import { Status } from '@/constants/enums'

  export default defineComponent({
    name: 'DoctorList',
    components: {
      TheSearch,
    },
    setup() {
      const { loading, fetchDoctors, listDoctors, isLoadmore } = useFetchDoctors()
      const { route, router, authStore, showGlobalLoading, hideGlobalLoading } = useEnhancer()
      const pagination = ref({
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      })

      const columns: ComputedRef<QTableProps['columns']> = computed(() => [
        {
          name: 'name',
          required: true,
          label: 'Bác sĩ',
          align: 'left',
          field: (row: AnyObject) => row?.fullName,
        },
        // {
        //   name: 'gender',
        //   required: true,
        //   label: 'Giới tính',
        //   align: 'left',
        //   field: (row: AnyObject) => row?.gender,
        //   format: (val: string) => globalFilter.getGenderLabel(val),
        // },
        {
          name: 'birthday',
          required: true,
          label: 'Ngày sinh',
          align: 'left',
          field: (row: AnyObject) => row?.birthday,
        },
        {
          name: 'specialty',
          required: true,
          label: 'Chuyên khoa',
          align: 'left',
          field: (row: AnyObject) => row?.specialty,
        },
        {
          name: 'contact',
          required: true,
          label: 'Liên hệ',
          align: 'left',
          field: (row: AnyObject) => row?.email,
        },
        {
          name: 'withdrawal',
          required: true,
          label: 'Yêu cầu rút tiền',
          align: 'left',
          field: (row: AnyObject) => row?.lastWithdrawalSnapshot,
        },
        {
          name: 'status',
          required: true,
          label: 'Trạng thái',
          align: 'left',
          field: (row: AnyObject) => row?.status,
        },
        // {
        //   name: 'createdAt',
        //   align: 'center',
        //   label: 'Ngày tạo',
        //   field: 'createdAt',
        // },
        {
          name: 'updatedAt',
          align: 'center',
          label: 'Cập nhật',
          field: 'updatedAt',
          sortable: true,
          sortOrder: 'ad',
          headerClasses: 'no-pointer-events',
        },
        { name: 'actions', align: 'center', label: '', field: 'name' },
      ])

      const onLoadmore = () => {
        fetchDoctors(route.query, true)
      }

      const clickEdit = (row: AnyObject) => {
        console.log(listDoctors.value)
        router.push({ name: 'doctors-id', params: { id: row.uid } })
      }
      watch(
        () => route.query,
        async (newParams) => {
          showGlobalLoading()
          const params = newParams
          await fetchDoctors(params)
          hideGlobalLoading()
        },
        {
          immediate: true,
        }
      )
      return {
        authStore,
        pagination,
        listDoctors,
        columns,
        loading,
        isLoadmore,
        clickEdit,
        onLoadmore,
        Status,
        defaultAvatar,
      }
    },
  })
</script>
<style lang="scss" scoped>
  :deep(.table-staff) {
    max-height: 100%;
    max-width: 100%;
    th {
      background-color: #fff !important;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    th:last-child,
    td:last-child {
      background-color: #fff !important;
      position: sticky;
      right: 0;
      box-shadow: -6px 0 6px 0px rgba(0, 0, 0, 0.15);
    }
  }
</style>
