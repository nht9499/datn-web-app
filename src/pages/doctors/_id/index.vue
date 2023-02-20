<template>
  <div class="bg-white shadow-2 rounded-borders q-pa-sm q-mt-sm flex flex-center justify-between">
    <div class="flex items-center">
      <q-btn
        color="primary"
        size="14px"
        dense
        flat
        round
        icon="keyboard_backspace"
        @click="onBack" />
      <h1 class="text-h6 text-weight-medium">Thông tin bác sĩ</h1>
    </div>
  </div>
  <div class="q-mt-none q-mb-md row q-gutter-md">
    <div class="col">
      <q-card>
        <div class="q-mx-md q-pt-md flex justify-between">
          <div>
            <q-icon name="person" size="md" color="grey-7"></q-icon>
            <span class="text-bold q-ml-sm">Hồ sơ bác sĩ</span>
          </div>
          <q-btn @click="clickEditProfile" outline round color="primary" icon="edit" />
        </div>
        <div class="q-mx-lg q-my-md border-card">
          <q-card-section horizontal>
            <q-card-section class="q-pr-xs">
              <q-avatar size="8vw">
                <q-img :src="defaultAvatar" />
              </q-avatar>
            </q-card-section>
            <q-card-section
              class="q-px-xs"
              style="width: 100%; display: flex; justify-content: center; align-items: center">
              <q-list dense class="q-gutter-xs">
                <div class="row">
                  <div>
                    <q-icon class="list-icon" name="face" />
                    <span class="text-bold">{{ doctorDetail.fullName }}</span>
                  </div>
                </div>
                <div class="row">
                  <div>
                    <q-icon
                      class="list-icon"
                      :name="doctorDetail.gender === 'male' ? 'male' : 'female'" />
                    <span>{{ $filters.getGenderLabel(doctorDetail.gender) }}</span>
                  </div>
                </div>
                <div class="row">
                  <div>
                    <q-icon class="list-icon" name="cake" />
                    <span>{{ $filters.dateFormat(doctorDetail.dob, 'DD/MM/YYYY') }}</span>
                  </div>
                </div>
                <div class="row">
                  <div>
                    <q-icon class="list-icon" name="phone_iphone" />
                    <span>{{ doctorDetail.phoneNumber }}</span>
                  </div>
                </div>
              </q-list>
            </q-card-section>
          </q-card-section>
        </div>
        <q-card-section>
          <div>
            <p class="text-bold">Thông tin tài khoản</p>
            <div class="q-ml-sm">
              <p class="text-body2">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>Email:
                {{ doctorDetail.email }}
              </p>
              <p class="text-body2">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>Trạng thái:
                <q-chip
                  size="11px"
                  class="q-px-xs q-py-none"
                  :color="$filters.getDoctorStatusColor(doctorDetail.status)"
                  text-color="white"
                  >{{ $filters.getDoctorStatus(doctorDetail.status) }}</q-chip
                >
              </p>
              <p class="text-body2 q-mb-xs">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>Gia nhập:
                {{ $filters.dateFormat(doctorDetail.createdAt, 'DD/MM/YYYY') }}
              </p>
              <p class="text-body2">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>Duyệt:
                {{ $filters.dateFormat(doctorDetail.updatedAt, 'DD/MM/YYYY') }}
              </p>
            </div>
          </div>
          <div class="q-mt-md">
            <p class="text-bold">Chuyên khoa</p>
            <div class="q-ml-sm">
              <p class="text-body2">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{ doctorDetail.specialty }}
              </p>
            </div>
          </div>
          <div class="q-mt-md">
            <p class="text-bold">Kinh nghiệm</p>
            <div v-for="ex in doctorDetail.workExperienceList" :key="ex.workplace" class="q-ml-sm">
              <p class="text-body2">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>{{ ex.workplace }}
              </p>
              <div class="q-ml-sm">
                <p class="text-body2">
                  <q-icon size="7px" name="panorama_fish_eye" class="q-mr-sm"></q-icon
                  >{{ ex.title }}
                </p>
              </div>
            </div>
          </div>
          <div class="q-mt-md">
            <p class="text-bold">Các giấy tờ liên quan</p>
            <div class="q-gutter-sm q-mt-xs">
              <q-img
                v-for="img in listUrl"
                :key="img"
                @click="clickImg(img)"
                style="height: 60px; max-width: 60px; cursor: zoom-in"
                :src="img ?? 'https://cdn.quasar.dev/img/avatar.png'" />
            </div>
            <q-dialog maximized v-model="dialogImg">
              <div
                class="flex flex-center"
                @click="dialogImg = false"
                style="width: 100vw; height: 100vh; box-shadow: none; cursor: zoom-out">
                <q-img
                  @click="dialogImg = false"
                  style="height: 500px; max-width: 900px; box-shadow: none; cursor: zoom-out"
                  fit="contain"
                  :src="selectedImg ?? 'https://cdn.quasar.dev/img/avatar.png'" />
              </div>
            </q-dialog>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col">
      <q-card>
        <div class="q-px-md q-pt-md">
          <q-icon name="attach_money" size="md" color="grey-7"></q-icon>
          <span class="text-bold q-ml-sm">Đơn giá</span>
          <div class="flex justify-center q-py-md">
            <div>
              <span class="text-h3">{{
                $filters.currencyFormat(
                  doctorPrivate.costPerMau ?? settingStore.doctorCostPerMau,
                  false
                )
              }}</span>
              <span class="text-title">đ/MAU</span>
            </div>
          </div>
          <div class="flex justify-end q-pb-md">
            <q-btn
              icon="cached"
              label="Thay đổi"
              color="primary"
              padding="5px 10px 5px 10px"
              outline
              @click="clickMAU"
              no-caps></q-btn>
          </div>
        </div>
      </q-card>
      <q-card class="q-mt-md">
        <div class="q-px-md q-pt-md">
          <q-icon name="table_view" size="md" color="grey-7"></q-icon>
          <span class="text-bold q-ml-sm">Thống kê thu nhập</span>
        </div>
        <div class="q-mx-lg q-my-md border-card">
          <q-card-section style="width: 100%">
            <div class="row" style="height: 30px">
              <span class="text-bold">Tổng kết năm</span>
              <q-select
                v-model="statisticsYear"
                :options="options"
                borderless
                dense
                style="width: 60px; position: relative; bottom: 8px; left: 5px">
                <template #selected-item="scoped">
                  <span class="text-body1 text-bold text-primary">{{ scoped.opt }}</span>
                </template>
              </q-select>
            </div>
            <div class="text-body2 q-ml-sm">
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{ summaryStatistics.appointmentCount }} buổi tư vấn
              </p>
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{ summaryStatistics.mauCount }} MAU
              </p>
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{ $filters.convertToMilion(summaryStatistics.appointmentsTotalFee) }} doanh thu
              </p>
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{ $filters.convertToMilion(summaryStatistics.mauTotalCost) }} chi phí
              </p>
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                ><span class="bg-amber-2 q-px-sm text-bold"
                  >{{ $filters.convertToMilion(summaryStatistics.finalIncome) }} thu nhập</span
                >
              </p>
            </div>
          </q-card-section>
        </div>
        <q-card-section v-if="statisticsInfo">
          <q-table
            dense
            hide-pagination
            table-header-class="text-bold"
            :rows="statisticsInfo.statisticsByMonthList"
            :columns="columns"
            row-key="name"
            separator="cell" />
        </q-card-section>
      </q-card>
    </div>
    <div class="col">
      <q-card class="q-pb-sm">
        <div class="q-mx-md q-pt-md">
          <q-icon name="currency_exchange" size="md" color="grey-7"></q-icon>
          <span class="text-bold q-ml-sm">Quản lý tiền</span>
        </div>
        <div class="q-mx-lg q-my-md border-card">
          <q-card-section style="width: 100%">
            <div class="flex justify-between">
              <div>
                <p class="text-bold">Số dư khả dụng</p>
                <div class="text-body2 q-ml-sm q-mb-md">
                  <p>
                    <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                    ><span class="bg-amber-2 q-px-sm text-bold">{{
                      $filters.currencyFormat(balanceInfo.currentBalance)
                    }}</span>
                  </p>
                </div>
              </div>
              <q-btn
                style="height: 42px"
                @click="clickEditBalance"
                outline
                round
                color="primary"
                icon="edit" />
            </div>
            <p class="text-bold">Thông tin chuyển khoản Momo</p>
            <div class="text-body2 q-ml-sm">
              <p v-if="balanceInfo?.bankAccountList?.length > 0">
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{ balanceInfo.bankAccountList[0]?.bankAccountName }} <br />
                <span class="q-ml-md">{{ balanceInfo.bankAccountList[0]?.bankAccountNumber }}</span>
              </p>
              <p v-else class="text-italic">Người dùng chưa nhập thông tin</p>
            </div>
          </q-card-section>
        </div>
        <div
          v-for="withdrawal in listWithdrawalWaiting"
          :key="withdrawal.id"
          class="q-mx-lg q-my-md border-card-orange">
          <q-card-section style="width: 100%">
            <p class="text-bold">Yêu cầu rút tiền</p>
            <div class="text-body2 q-ml-sm q-mb-md">
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>Ngày yêu cầu:
                <span class="bg-amber-2 q-px-sm text-bold">{{
                  $filters.dateFormat(withdrawal.createdAt, 'HH:mm - DD/MM/YYYY')
                }}</span>
              </p>
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon>Số tiền:
                <span class="bg-amber-2 q-px-sm text-bold">{{
                  $filters.currencyFormat(withdrawal.withdrawalTransaction.withdrawalAmount)
                }}</span>
              </p>
            </div>
            <p class="text-bold">Hành động</p>
            <div class="row q-gutter-sm q-pt-xs">
              <q-btn
                icon="do_disturb"
                label="Thất bại"
                color="negative"
                padding="5px 10px 5px 10px"
                outline
                class="col"
                no-caps></q-btn>
              <q-btn
                icon="task_alt"
                label="Thành công"
                color="primary"
                padding="5px 10px 5px 10px"
                outline
                class="col"
                no-caps></q-btn>
            </div>
          </q-card-section>
        </div>
        <div class="q-mx-lg q-my-md border-card">
          <q-card-section style="width: 100%">
            <div class="row" style="height: 30px">
              <span class="text-bold">Lịch sử năm</span>
              <q-select
                v-model="transactionsYear"
                :options="options"
                borderless
                dense
                style="width: 60px; position: relative; bottom: 8px; left: 5px">
                <template #selected-item="scoped">
                  <span class="text-body1 text-bold text-primary">{{ scoped.opt }}</span>
                </template>
              </q-select>
            </div>
            <div
              v-for="transaction in listTransactions"
              :key="transaction.id"
              class="text-body2 q-ml-sm">
              <p>
                <q-icon size="7px" name="circle" class="q-mr-sm"></q-icon
                >{{
                  $filters.dateFormat(transaction.createdAt, 'DD/MM') +
                  ' - ' +
                  displayTransactionText(
                    transaction.type,
                    transaction.withdrawalTransaction?.status,
                    transaction.incomeTransaction?.monthId
                  )
                }}
                <span class="text-bold text-italic">
                  {{
                    $filters.currencyFormat(
                      transaction.withdrawalTransaction?.withdrawalAmount ??
                        transaction.incomeTransaction?.incomeAmount ??
                        transaction.depositTransaction?.depositAmount
                    )
                  }}</span
                >
              </p>
              <div class="q-ml-sm q-mb-sm">
                <p
                  v-if="transaction.withdrawalTransaction?.status !== 'waiting'"
                  class="text-body2">
                  <q-icon size="7px" name="panorama_fish_eye" class="q-mr-sm"></q-icon>Số dư
                  {{ $filters.currencyFormat(transaction.balanceAfterTransaction) }}
                </p>
              </div>
            </div>
          </q-card-section>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchDoctors } from '@/hooks/useFetchDoctors'
  import globalFilter from '@/helpers/filters'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  export default defineComponent({
    name: 'DoctorDetail',
    components: {},
    setup() {
      const { route, router, showGlobalLoading, hideGlobalLoading, settingStore } = useEnhancer()
      const {
        fetchDoctorById,
        doctorDetail,
        balanceInfo,
        listTransactions,
        statisticsInfo,
        doctorPrivate,
        listWithdrawal,
      } = useFetchDoctors()

      const dialogImg = ref(false)
      const selectedImg = ref(null)
      const summaryStatistics = computed(() => {
        const summary = {
          appointmentCount: 0,
          mauCount: 0,
          appointmentsTotalFee: 0,
          mauTotalCost: 0,
          finalIncome: 0,
        }
        if (statisticsInfo.value) {
          statisticsInfo.value.statisticsByMonthList?.map((stat) => {
            summary.appointmentCount += stat.appointmentsCount
            summary.mauCount += stat.mauCount
            summary.appointmentsTotalFee += stat.appointmentsTotalFee
            summary.mauTotalCost += stat.mauTotalCost
            summary.finalIncome += stat.finalIncome
          })
        }
        return summary
      })

      const listWithdrawalWaiting = computed(() => {
        if (listWithdrawal.value?.length > 0) {
          const list = []
          listWithdrawal.value.map((transaction) => {
            if (transaction?.withdrawalTransaction?.status === 'waiting') list.push(transaction)
          })
          return list
        } else return []
      })

      const listUrl = computed(() => {
        let list = []
        doctorPrivate?.value?.personalIdCardImageUrlList?.map((url) => {
          list.push(url)
        })
        doctorPrivate?.value?.practisingCertificateImageUrlList?.map((url) => {
          list.push(url)
        })
        doctorPrivate?.value?.otherCertificateImageUrlList?.map((url) => {
          list.push(url)
        })
        return list
      })

      const displayTransactionText = (type, status, monthId) => {
        if (type === 'withdrawal') {
          if (status === 'waiting') return 'Yêu cầu rút'
          if (status === 'transfered') return 'Đã chuyển khoản'
          if (status === 'rejected') return 'Đã từ chối rút'
          if (status === 'canceledByDoctor') return 'Bác sĩ hủy yêu cầu rút'
        }
        if (type === 'deposit') return 'Đã nạp'
        if (type === 'income') return 'Thu nhập tháng ' + +monthId.slice(-2)
      }

      const columns = [
        {
          name: 'date',
          label: 'Tháng',
          field: (row) => +row.monthId.slice(-2),
          align: 'left',
          headerStyle: 'font-weight: 1000',
        },
        {
          name: 'appointmentsCount',
          label: 'Tư vấn',
          field: (row) => row.appointmentsCount,
          align: 'left',
          headerStyle: 'font-weight: 1000',
        },
        {
          name: 'appointmentsTotalFee',
          label: 'Doanh thu',
          field: (row) => globalFilter.convertToMilionShort(row.appointmentsTotalFee),
          align: 'left',
          headerStyle: 'font-weight: 1000',
        },
        {
          name: 'mauCount',
          label: 'MAU',
          field: (row) => row.mauCount,
          align: 'left',
          headerStyle: 'font-weight: 1000',
        },
        {
          name: 'mauTotalCost',
          label: 'Chi phí',
          field: (row) => globalFilter.convertToMilionShort(row.mauTotalCost),
          align: 'left',
          headerStyle: 'font-weight: 1000',
        },
        {
          name: 'finalIncome',
          label: 'Thu nhập',
          field: (row) => globalFilter.convertToMilionShort(row.finalIncome),
          align: 'left',
          headerStyle: 'font-weight: 1000',
        },
      ]

      const onBack = () => {
        router.back()
      }
      const clickMAU = () => {
        console.log(settingStore)
      }
      const clickImg = (img) => {
        selectedImg.value = img
        dialogImg.value = true
      }
      const clickEditProfile = () => {
        console.log('a')
      }
      const clickEditBalance = () => {
        console.log('b')
      }

      const statisticsYear = ref(new Date().getFullYear())
      const transactionsYear = ref(new Date().getFullYear())
      const options = [2023, 2024]
      // watch(
      //   () => route.params,
      //   (params) => {
      //     fetchDoctorById(params.id as string, route.query)
      //   },
      //   {
      //     immediate: true,
      //   }
      // )
      watch(
        () => route.query,
        async (newParams) => {
          showGlobalLoading()
          await fetchDoctorById(route.params.id as string, route.query)
          hideGlobalLoading()
        },
        {
          immediate: true,
        }
      )
      watch(
        () => statisticsYear.value,
        (value) => {
          router.push({
            query: { ...route.query, statisticsYear: value },
          })
        },
        {
          immediate: true,
        }
      )
      watch(
        () => transactionsYear.value,
        (value) => {
          router.push({
            query: { ...route.query, transactionsYear: value },
          })
        },
        {
          immediate: true,
        }
      )
      return {
        transactionsYear,
        statisticsYear,
        options,
        columns,
        dialogImg,
        doctorDetail,
        selectedImg,
        listUrl,
        doctorPrivate,
        balanceInfo,
        listTransactions,
        listWithdrawalWaiting,
        statisticsInfo,
        settingStore,
        summaryStatistics,
        defaultAvatar,
        clickEditProfile,
        clickEditBalance,
        clickMAU,
        clickImg,
        displayTransactionText,
        onBack,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .border-card {
    background-image: repeating-linear-gradient(
        1deg,
        #bdbdbd,
        #bdbdbd 9px,
        transparent 9px,
        transparent 16px,
        #bdbdbd 16px
      ),
      repeating-linear-gradient(
        91deg,
        #bdbdbd,
        #bdbdbd 9px,
        transparent 9px,
        transparent 16px,
        #bdbdbd 16px
      ),
      repeating-linear-gradient(
        181deg,
        #bdbdbd,
        #bdbdbd 9px,
        transparent 9px,
        transparent 16px,
        #bdbdbd 16px
      ),
      repeating-linear-gradient(
        271deg,
        #bdbdbd,
        #bdbdbd 9px,
        transparent 9px,
        transparent 16px,
        #bdbdbd 16px
      );
    background-size: 2px 100%, 100% 2px, 2px 100%, 100% 2px;
    background-position: 0 0, 0 0, 100% 0, 0 100%;
    background-repeat: no-repeat;
  }
  .border-card-orange {
    background-image: repeating-linear-gradient(
        1deg,
        #ff9901,
        #ff9901 9px,
        transparent 9px,
        transparent 16px,
        #ff9901 16px
      ),
      repeating-linear-gradient(
        91deg,
        #ff9901,
        #ff9901 9px,
        transparent 9px,
        transparent 16px,
        #ff9901 16px
      ),
      repeating-linear-gradient(
        181deg,
        #ff9901,
        #ff9901 9px,
        transparent 9px,
        transparent 16px,
        #ff9901 16px
      ),
      repeating-linear-gradient(
        271deg,
        #ff9901,
        #ff9901 9px,
        transparent 9px,
        transparent 16px,
        #ff9901 16px
      );
    background-size: 2px 100%, 100% 2px, 2px 100%, 100% 2px;
    background-position: 0 0, 0 0, 100% 0, 0 100%;
    background-repeat: no-repeat;
  }
  .list-icon {
    font-size: 1.2rem;
    position: relative;
    bottom: 3px;
    margin-right: 10px;
  }
</style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
