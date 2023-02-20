<template>
  <div class="q-mt-md">
    <driver-waiting-list @is-empty="waitingList" />

    <q-table
      class="table-task"
      row-key="id"
      v-model:pagination="pagination"
      :style="
        authStore.isAdmin || waitingDriver
          ? 'max-height: calc(100vh - 130px)'
          : 'max-height: calc(100vh - 260px)'
      "
      :rows="listDrivers"
      :columns="columns"
      :loading="loading"
      hide-pagination
      @request="onRequest"
      no-data-label="Không có dữ liệu"
      binary-state-sort>
      <template #loading>
        <q-inner-loading showing>
          <q-spinner-ios size="50px" color="primary" />
        </q-inner-loading>
      </template>

      <template #top>
        <div class="col-12 q-table__title q-mb-xs">Quản lý tài xế</div>
        <div class="col-12">
          <the-search :is-sort="sort" @on-search="onSearch" />
        </div>
      </template>

      <template #body-cell-contact="props">
        <q-td :props="props">
          <div class="text-caption text-italic">
            <q-icon size="xs" name="mail" />
            {{ props.row.email || '-' }}
          </div>
          <div class="text-caption text-italic">
            <q-icon size="xs" name="call" />
            {{ props.row.telephone || '0xxxxxxx' }}
          </div>
          <div class="text-caption text-italic">
            <q-icon size="xs" name="home" />
            {{ props.row.address || '-' }}
          </div>
        </q-td>
      </template>

      <template #body-cell-workingStatus="props">
        <q-td :props="props">
          <q-badge
            rounded
            class="q-px-sm q-py-xs"
            :color="$filters.getWorkingStatusColor(props.row.workingStatus ?? 'null')">
            {{ $filters.getWorkingStatusLabel(props.row.workingStatus ?? 'null') }}
          </q-badge>
        </q-td>
      </template>
      <template #body-cell-driverType="props">
        <q-td :props="props">
          <span v-if="props.row.authInfo.driverAccountType === 'sevenSeaterCar'">Xe 7 chỗ</span>
          <span v-if="props.row.authInfo.driverAccountType === 'fourSeaterCar'">Xe 4 chỗ</span>
          <span v-if="props.row.authInfo.driverAccountType === 'bike'">Xe máy</span>
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            rounded
            class="q-px-sm q-py-xs"
            :color="$filters.getDriverStatusColor(props.row.status)">
            {{ $filters.getDriverStatusLabel(props.row.status) }}
          </q-badge>
        </q-td>
      </template>
      <template #body-cell-rating="props">
        <q-td :props="props">
          <div class="flex flex-center">
            <q-icon color="primary" size="xs" name="star" />
            <span class="text-weight-bold q-mr-xs">{{ props.row.averageRating ?? 5 }}</span> ({{
              props.row.totalReviewCount ?? 0
            }})
          </div>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" style="width: 120px; padding: 0px">
          <q-btn
            style="width: 85px"
            class="q-ml-sm"
            no-caps
            flat
            dense
            size="small"
            color="primary"
            label="Công cụ"
            icon-right="expand_more">
            <q-menu>
              <q-list style="min-width: 210px">
                <!-- <q-item
                  v-if="
                    props.row.status === DriverStatus.WAITING ||
                    props.row.status === DriverStatus.WAITING_TOO_LONG
                  "
                  clickable
                  dense
                  v-close-popup>
                  <q-item-section dense avatar>
                    <q-icon size="sm" dense color="primary" name="check" />
                  </q-item-section>
                  <q-item-section class="text-primary" @click="clickActive(props.row)"
                    >Kích hoạt tài xế</q-item-section
                  >
                </q-item> -->
                <q-item dense clickable v-close-popup @click="clickDetail(props.row.uid)">
                  <q-item-section style="min-width: 12px" dense avatar>
                    <q-icon size="xs" dense name="edit" />
                  </q-item-section>
                  <q-item-section>Thông tin chi tiết</q-item-section>
                </q-item>
                <q-item
                  v-if="props.row.status === DriverStatus.ACTIVE && !authStore.isStaff"
                  dense
                  clickable
                  @click="handleClickDeposit(props.row)"
                  v-close-popup>
                  <q-item-section style="min-width: 12px" dense avatar>
                    <q-icon size="xs" dense name="attach_money" />
                  </q-item-section>
                  <q-item-section>Tiền ký quỹ</q-item-section>
                </q-item>
                <q-item
                  v-if="props.row.status === DriverStatus.ACTIVE && !authStore.isStaff"
                  dense
                  clickable
                  @click="handleClickDebt(props.row)"
                  v-close-popup>
                  <q-item-section style="min-width: 12px" dense avatar>
                    <q-icon size="xs" dense name="account_balance" />
                  </q-item-section>
                  <q-item-section>Công nợ</q-item-section>
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
    <q-dialog v-model="depositDialog" @hide="hideDepositDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h5">Cập nhật tiền ký quỹ</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-sm">
          <div class="q-mb-md">
            <span class="text-body1">{{ driverClick.name }} - {{ driverClick.telephone }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-body2">Tiền ký quỹ</span>
            <span class="text-body2">
              {{ $filters.currencyFormat(driverClick.currentDeposit, null) }}
            </span>
          </div>
          <q-currency-input
            v-model="money"
            outlined
            dense
            label="Số tiền cộng thêm"
            :options="{ currency: 'VND', currencyDisplay: 'hidden' }"
            suffix="đ" />
          <div class="flex justify-between">
            <span class="text-body2">Số tiền sau khi cộng thêm</span>
            <span class="text-body1">
              {{ $filters.currencyFormat(driverClick.currentDeposit + money, null) }}
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy bỏ" @click="hideDepositDialog" />
          <q-btn
            label="Cập nhật"
            class="bg-gradient-primary"
            text-color="white"
            @click="handleUpdateDeposit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="debtDialog" @hide="hideDebtDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h5">Công nợ</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-sm">
          <div class="q-mb-md">
            <span class="text-body1">{{ driverClick.name }} - {{ driverClick.telephone }}</span>
          </div>
          <div v-for="debt in listDebts" :key="debt.id" class="flex justify-between">
            <span class="text-body2"
              >Đơn hàng #{{ debt.orderId }} ({{ $filters.dateFormat(debt.createdAt) }})</span
            >
            <span class="text-body2">
              {{ $filters.currencyFormat(debt.debtAmount) }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-body2 text-bold q-pt-sm">Công nợ</span>
            <span
              class="text-body2 text-bold q-pt-sm"
              :style="listDebts.length > 0 ? 'border-top: 1px solid #000' : ''">
              {{ $filters.currencyFormat(driverClick.currentDebtAmount) }}
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy bỏ" @click="hideDebtDialog" />
          <q-btn
            label="Thanh toán"
            class="bg-gradient-primary"
            text-color="white"
            @click="handleDebtSettlement" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, watch, onMounted } from 'vue'
  import { useQuasar } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { QCurrencyInput } from '@/components'
  import { DriverStatus } from '@/constants/enums'
  import { useFetchDrivers } from '@/hooks/useFetchDriver'
  import { standardizedParams } from '@/util/object'
  import globalFilter from '@/helpers/filters'
  import TheSearch from './components/Search.vue'
  import DriverWaitingList from './components/WaitingList.vue'

  export default defineComponent({
    name: 'DriverList',
    components: {
      TheSearch,
      QCurrencyInput,
      DriverWaitingList,
    },
    setup() {
      const { router, route, authStore, showNotify } = useEnhancer()
      const $q = useQuasar()
      const {
        loading,
        fetchDrivers,
        listDrivers,
        isLoadmore,
        updateDeposit,
        settleDebt,
        listDebts,
        fetchDebts,
      } = useFetchDrivers()
      const defaultPage = ref({
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      })
      const pagination = ref({
        sortBy: 'currentDeposit',
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      })
      const sort = ref(false)
      const depositDialog = ref(false)
      const debtDialog = ref(false)
      const money = ref(null)
      const driverClick = ref()
      const waitingDriver = ref(false)

      const columns = computed(() => [
        {
          name: 'name',
          required: true,
          label: 'Tên',
          align: 'left',
          field: 'name',
          // field: (row: any) => row,
          // format: (row: any) => row.name + ' - ' + globalFilter.yearFormat(row.birthday),
        },
        {
          name: 'gender',
          required: true,
          label: 'Giới tính',
          align: 'left',
          field: 'gender',
          format: (val: string) => globalFilter.getGenderLabel(val),
        },
        // {
        //   name: 'telephone',
        //   required: true,
        //   label: 'Số điện thoại',
        //   align: 'left',
        //   field: 'telephone',
        // },
        {
          name: 'contact',
          required: true,
          label: 'Liên hệ',
          align: 'left',
        },
        {
          name: 'driverType',
          required: true,
          label: 'Loại xe',
          align: 'left',
          field: 'authRole',
        },
        {
          name: 'bikeNumber',
          required: true,
          label: 'Biển số xe',
          align: 'left',
          field: 'bikeNumber',
        },
        {
          name: 'currentDeposit',
          align: 'left',
          label: 'Tiền ký quỹ',
          field: 'currentDeposit',
          format: (val: string) => globalFilter.currencyFormat(val),
          sortable: true,
          style: authStore.isAdmin || authStore.isAccountant ? '' : 'display: none',
          headerStyle: authStore.isAdmin || authStore.isAccountant ? '' : 'display: none',
        },
        {
          name: 'currentDebtAmount',
          align: 'left',
          label: 'Công nợ',
          field: 'currentDebtAmount',
          sortable: true,
          format: (val: string) => globalFilter.currencyFormat(val),
          style: authStore.isAdmin || authStore.isAccountant ? '' : 'display: none',
          headerStyle: authStore.isAdmin || authStore.isAccountant ? '' : 'display: none',
        },
        {
          name: 'workingStatus',
          align: 'center',
          label: 'Trạng thái hoạt động',
          field: 'workingStatus',
        },
        {
          name: 'rating',
          align: 'center',
          label: 'Đánh giá',
          field: 'totalRating',
        },
        {
          name: 'createdAt',
          align: 'center',
          label: 'Ngày đăng ký',
          field: 'createdAt',
          format: (val: string) => globalFilter.dateFormat(val),
        },
        { name: 'status', align: 'center', label: 'Trạng thái' },
        { name: 'actions', align: 'center' },
      ])

      watch(
        () => route.query,
        async (params) => {
          // if (Object.keys(params).length === 0) return
          await fetchDrivers(params, false)
        },
        {
          immediate: true,
        }
      )

      onMounted(() => {
        const sortCondition: any = route.query.sort
        if (sortCondition) {
          const array = sortCondition.split(',')
          if (array[1] === 'desc') pagination.value.descending = true
        }
      })

      const clickDetail = (uid: string) => {
        router.push({ name: 'drivers-id-detail', params: { id: uid } })
      }

      const hideDepositDialog = () => {
        depositDialog.value = false
        money.value = null
        driverClick.value = null
      }
      const handleClickDeposit = (driver: any) => {
        driverClick.value = driver
        depositDialog.value = true
      }
      const handleUpdateDeposit = () => {
        if (!money.value) return showNotify(`Bạn hãy nhập số tiền cần cộng thêm`, 'negative')
        $q.dialog({
          html: true,
          title: 'Cập nhật tiền ký quỹ',
          message: `Bạn có chắc muốn cộng thêm cho tài xế: <br> ${driverClick.value.name} <b>${money.value}</b> đồng`,
          cancel: {
            flat: true,
            color: 'black',
            label: 'Không',
          },
          ok: {
            flat: true,
            color: 'primary',
            label: 'Có',
          },
        }).onOk(() => handleUpdate())
      }
      const handleUpdate = async () => {
        const payload = {
          driverAuthInfo: driverClick.value.authInfo as AuthInfo,
          depositAmount: money.value ?? 0,
        }
        await updateDeposit(payload)
        hideDepositDialog()
        fetchDrivers(route.query)
      }

      const handleClickDebt = async (driver: any) => {
        driverClick.value = driver
        await fetchDebts(driver.id, { notPaid: true })
        debtDialog.value = true
      }
      const handleDebtSettlement = () => {
        $q.dialog({
          html: true,
          title: 'Thanh toán công nợ',
          message: `Bạn có chắc muốn thanh toán công nợ cho tài xế: <br> ${driverClick.value.name}`,
          cancel: {
            flat: true,
            color: 'black',
            label: 'Không',
          },
          ok: {
            flat: true,
            color: 'primary',
            label: 'Có',
          },
        }).onOk(async () => {
          const payload = {
            driverAuthInfo: driverClick.value.authInfo as AuthInfo,
          }
          await settleDebt(payload)
          hideDebtDialog()
          fetchDrivers(route.query)
        })
      }
      const hideDebtDialog = () => {
        debtDialog.value = false
        driverClick.value = null
      }

      const onRequest = (props: AnyObject) => {
        const { sortBy, descending } = props.pagination
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
        router.push({
          name: route.name as string,
          query: standardizedParams({
            // ...route.query,
            // status: DriverStatus.ACTIVE,
            ...(route.query.status && {
              status: route.query.status,
            }),
            sort: sortBy && `${sortBy},${descending ? 'desc' : 'asc'}`,
          }),
        })
        sort.value = !sort.value
      }

      const onLoadmore = () => {
        fetchDrivers(route.query, true)
      }

      const onSearch = () => {
        Object.assign(pagination.value, defaultPage.value)
      }

      const waitingList = (val) => {
        waitingDriver.value = val
      }

      return {
        columns,
        loading,
        DriverStatus: { ...DriverStatus },
        isLoadmore,
        listDrivers,
        pagination,
        authStore,
        depositDialog,
        driverClick,
        money,
        sort,
        waitingDriver,

        onRequest,
        clickDetail,
        onLoadmore,
        handleClickDeposit,
        hideDepositDialog,
        handleUpdateDeposit,
        onSearch,
        waitingList,
        handleClickDebt,
        debtDialog,
        hideDebtDialog,
        handleDebtSettlement,

        listDebts,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.table-task) {
    height: fit-content;
    max-width: 100%;

    td:last-child {
      background-color: #fff !important;
    }
    tr th {
      position: sticky;
      z-index: 2;
      background: #fff;
    }
    thead tr:last-child th {
      top: 48px;
      z-index: 3;
    }
    thead tr:first-child th {
      top: 0;
      z-index: 1;
    }
    tr:first-child th:first-child {
      z-index: 3;
    }
    td:first-child {
      z-index: 1;
    }
    td:last-child,
    th:last-child {
      position: sticky;
      right: 0;
      box-shadow: -6px 0 6px 0px rgba(0, 0, 0, 0.15);
    }
  }
</style>

<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Quản lý tài xế'
</route>
