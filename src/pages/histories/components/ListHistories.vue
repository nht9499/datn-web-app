<template>
  <!-- style="height: calc(100vh - 230px)" -->
  <div>
    <q-table
      title="Lịch sử kiểm tra tương đồng"
      class="table-staff"
      row-key="id"
      style="max-height: calc(100vh - 205px)"
      v-model:pagination="pagination"
      :rows="listTests"
      :columns="columns"
      separator="horizontal"
      no-data-label="Không có dữ liệu"
      hide-pagination
      binary-state-sort>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            rounded
            class="q-px-sm q-py-xs"
            :color="$filters.getTestStatusColor(props.row.status)">
            {{ $filters.getTestStatus(props.row.status) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-createdAt="props">
        <q-td :props="props">
          {{ $filters.dateFromNow(props.row.createdAt || null) }}
        </q-td>
      </template>

      <template #body-cell-type="props">
        <q-td :props="props">
          {{ $filters.getTestType(props.row.type)
          }}<span v-if="props.row.type === 'organization'"
            >: {{ props.row.organizationSnapshot.name }}</span
          >
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
  import { defineComponent, ref, computed, onMounted, ComputedRef } from 'vue'
  import { QTableProps } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  import { useFetchTestResult } from '@/hooks/useFetchTestResults'
  // import globalFilter from '@/helpers/filters'
  import { Status } from '@/constants/enums'

  export default defineComponent({
    name: 'ListHistories',
    components: {},
    setup() {
      const { fetchTests, listTests } = useFetchTestResult()
      const { route, router, authStore, showGlobalLoading, hideGlobalLoading } = useEnhancer()
      const pagination = ref({
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      })

      const mockData = [
        {
          uid: 'a',
          userUid: 'user-mock-uid',
          status: 'done',
          matchPercent: 76,
          createdAt: 9999999,
        },
      ]

      const columns: ComputedRef<QTableProps['columns']> = computed(() => [
        {
          name: 'createdAt',
          align: 'center',
          label: 'Ngày thực hiện',
          field: 'createdAt',
        },
        {
          name: 'status',
          required: true,
          label: 'Trạng thái',
          align: 'center',
          field: (row: AnyObject) => row?.status,
        },
        {
          name: 'type',
          required: true,
          label: 'Kho ngữ liệu',
          align: 'center',
          field: (row: AnyObject) => row?.type,
        },
        // {
        //   name: 'percent',
        //   required: true,
        //   label: 'Phần trăm tương đồng',
        //   align: 'center',
        //   field: (row: AnyObject) => row?.matchPercent,
        // },
        { name: 'actions', align: 'center', label: '', field: 'name' },
      ])

      const onLoadmore = () => {
        fetchDoctors(route.query, true)
      }

      const clickEdit = (row: AnyObject) => {
        router.push({ name: 'histories-id', params: { id: row.uid } })
      }
      onMounted(async () => {
        showGlobalLoading()
        await fetchTests()
        hideGlobalLoading()
      })
      return {
        mockData,
        authStore,
        pagination,
        columns,
        clickEdit,
        onLoadmore,
        Status,
        defaultAvatar,
        listTests,
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
