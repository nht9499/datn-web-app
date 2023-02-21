<template>
  <q-card class="q-mt-md">
    <q-card-section>
      <div class="row flex justify-between">
        <q-card style="width: 39%; height: fit-content">
          <q-card-section>
            <div class="flex justify-between">
              <div>
                <q-icon class="list-icon" name="dns" />
                <span class="text-bold"> Thống kê hệ thống</span>
              </div>
            </div>
            <div class="row q-gutter-md q-mt-xs">
              <div class="border-card col">
                <q-card-section style="padding-right: 7px">
                  <div style="font-size: 0.8rem; font-weight: 600">Tổng người dùng</div>
                  <div
                    class="q-mt-md"
                    style="font-size: 2.5rem; font-weight: 600; line-height: 0.8">
                    {{ statisticsDetail?.totalUserThisYear }}
                  </div>
                  <div class="text-caption">Người dùng</div>
                </q-card-section>
              </div>
              <div class="border-card col">
                <q-card-section style="padding-right: 7px">
                  <div style="font-size: 0.8rem; font-weight: 600">Tổng file hệ thống</div>
                  <div
                    class="q-mt-md"
                    style="font-size: 2.5rem; font-weight: 600; line-height: 0.8">
                    {{ userDetail?.data?.length }}
                  </div>
                  <div class="text-caption">File</div>
                </q-card-section>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card style="width: 52%">
          <q-card-section>
            <div class="flex justify-between">
              <div>
                <q-icon class="list-icon" name="person" />
                <span class="text-bold"> Thống kê theo tháng</span>
              </div>
              <q-select
                disable
                v-model="patientStatisticMonth"
                :options="statisticsOptions"
                borderless
                dense
                style="width: 100px; position: relative; bottom: 8px; left: 5px">
                <template #selected-item="scoped">
                  <span class="text-body1 text-bold text-primary">{{ scoped.opt }}</span>
                </template>
              </q-select>
            </div>
            <div class="row q-gutter-md">
              <div class="border-card col">
                <q-card-section style="padding-right: 7px">
                  <div style="font-size: 0.8rem; font-weight: 600">Đăng ký mới</div>
                  <div
                    class="q-mt-md"
                    style="font-size: 2.5rem; font-weight: 600; line-height: 0.8">
                    {{ statThisMonth.newUserCount }}
                  </div>
                  <div class="text-caption">Người dùng</div>
                  <div
                    class="float-right q-mt-xs q-pb-sm text-bold"
                    :class="
                      statPrevMonth.newUserCount <= statThisMonth.newUserCount
                        ? 'text-positive'
                        : 'text-negative'
                    ">
                    {{
                      $filters.percentDiff(statPrevMonth.newUserCount, statThisMonth.newUserCount)
                    }}%
                    <q-icon
                      class="text-bold"
                      style="position: relative; bottom: 2px; left: -3px"
                      :name="
                        statPrevMonth.newUserCount <= statThisMonth.newUserCount
                          ? 'arrow_upward'
                          : 'arrow_downward'
                      "></q-icon>
                  </div>
                </q-card-section>
              </div>
              <div class="border-card col">
                <q-card-section style="padding-right: 7px">
                  <div style="font-size: 0.8rem; font-weight: 600">File đăng tải</div>
                  <div
                    class="q-mt-md"
                    style="font-size: 2.5rem; font-weight: 600; line-height: 0.8">
                    {{ statThisMonth.fileCount }}
                  </div>
                  <div class="text-caption">File</div>
                  <div
                    class="float-right q-mt-xs q-pb-sm text-bold"
                    :class="
                      statPrevMonth.fileCount <= statThisMonth.fileCount
                        ? 'text-positive'
                        : 'text-negative'
                    ">
                    {{ $filters.percentDiff(statPrevMonth.fileCount, statThisMonth.fileCount) }}%
                    <q-icon
                      class="text-bold"
                      style="position: relative; bottom: 2px; left: -3px"
                      :name="
                        statPrevMonth.fileCount <= statThisMonth.fileCount
                          ? 'arrow_upward'
                          : 'arrow_downward'
                      "></q-icon>
                  </div>
                </q-card-section>
              </div>
              <div class="border-card col">
                <q-card-section style="padding-right: 7px">
                  <div style="font-size: 0.8rem; font-weight: 600">Số lần kiểm tra</div>
                  <div
                    class="q-mt-md"
                    style="font-size: 2.5rem; font-weight: 600; line-height: 0.8">
                    {{ statThisMonth.testCount }}
                  </div>
                  <div class="text-caption">lần</div>
                  <div
                    class="float-right q-mt-xs q-pb-sm text-bold"
                    :class="
                      statPrevMonth.testCount <= statThisMonth.testCount
                        ? 'text-positive'
                        : 'text-negative'
                    ">
                    {{ $filters.percentDiff(statPrevMonth.testCount, statThisMonth.testCount) }}%
                    <q-icon
                      class="text-bold"
                      style="position: relative; bottom: 2px; left: -3px"
                      :name="
                        statPrevMonth.testCount <= statThisMonth.testCount
                          ? 'arrow_upward'
                          : 'arrow_downward'
                      "></q-icon>
                  </div>
                </q-card-section>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="flex flex-center q-mt-md" style="height: calc(100vh-700px)">
        <apexchart :options="testsChartOptions" :series="testsSeries"></apexchart>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, ref, onMounted, computed, watch } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'
  import globalFilter from '@/helpers/filters'
  import { useFetchStatistics } from 'src/hooks/useFetchStatistics'
  import { useFetchUser } from 'src/hooks/useFetchUser'
  import { useEnhancer } from '@/app/enhancer'
  import { standardizedParams } from '@/util/object'

  export default defineComponent({
    name: 'Dashboard',
    components: {
      apexchart: VueApexCharts,
    },
    setup() {
      const { fetchStatistics, statisticsDetail } = useFetchStatistics()
      const { fetchUserById, userDetail } = useFetchUser()
      const { showGlobalLoading, route, router, hideGlobalLoading, authStore } = useEnhancer()

      const patientStatisticMonth = ref(globalFilter.getThisMonthFormat(new Date()))
      const statisticsOptions = globalFilter.getStatisticOptions()

      const testsSeries = computed(() => {
        return [
          {
            name: 'Số lần kiểm tra',
            type: 'line',
            data: statisticsDetail.value?.statisticsByMonthList.map((stat) => stat.testCount) ?? [
              0,
            ],
          },
        ]
      })
      const testsChartOptions = computed(() => {
        return {
          chart: {
            height: 300,
            width: 900,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'straight',
          },
          title: {
            text: 'Số lần kiểm tra theo tháng',
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'],
              opacity: 0.5,
            },
          },
          xaxis: {
            // categories: ['T1'],
            categories: statisticsDetail.value?.statisticsByMonthList?.map((stat) =>
              globalFilter.getStatMonthLabel(stat.monthId)
            ) ?? [''],
          },
        }
      })

      const nullStat = {
        monthId: globalFilter.getThisMonthFormat(new Date()),
        fileCount: 0,
        newUserCount: 0,
        testCount: 0,
      }
      const statThisMonth = ref(nullStat)
      const statPrevMonth = ref(nullStat)

      onMounted(async () => {
        showGlobalLoading()
        await fetchStatistics()
        await fetchUserById(authStore.uid)
        statisticsDetail.value?.statisticsByMonthList?.map((stat) => {
          if (stat.monthId === globalFilter.getThisMonthFormat(new Date())) {
            statThisMonth.value = stat
          }
          if (stat.monthId === globalFilter.getPrevMonthFormat(new Date())) {
            statPrevMonth.value = stat
          }
        })
        hideGlobalLoading()
      })

      return {
        userDetail,
        statisticsDetail,
        testsSeries,
        testsChartOptions,
        patientStatisticMonth,
        statisticsOptions,
        statThisMonth,
        statPrevMonth,
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
</style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Trang chủ'
</route>
