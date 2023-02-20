<template>
  <div class="bg-white shadow-2 rounded-borders q-pa-md q-mt-md flex flex-center justify-between">
    <h1 class="text-h6 text-weight-medium q-mr-sm">Thống kê theo</h1>
    <q-select
      class="text-body q-mr-sm"
      dense
      outlined
      map-options
      emit-value
      @update:model-value="handleStatisticBy"
      v-model="statisticBy"
      :options="statisticByOptions" />
    <q-select
      class="text-body"
      dense
      outlined
      map-options
      emit-value
      v-model="statisticId"
      :options="statisticIdOptions"></q-select>
    <q-space></q-space>

    <q-space></q-space>
    <q-tabs
      v-model="modeView"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      inline-label
      narrow-indicator>
      <q-tab name="chart" label="Biểu đồ" icon="insights" no-caps />
      <q-tab name="table" label="Bảng" icon="toc" no-caps />
    </q-tabs>
  </div>
  <section class="q-pt-md" v-show="modeView === 'chart'">
    <div class="row q-gutter-sm">
      <template v-for="summaryCard in summaryCards" :key="summaryCard.title">
        <summary-card
          class="col"
          @click="handleStatisticType(summaryCard.id)"
          :title="summaryCard.title"
          :icon="summaryCard.icon"
          :color="summaryCard.iconColor"
          :active="statisticType === summaryCard.id"
          :main-index="summaryCard.mainIndex"
          :warning="summaryCard.warning"
          :task-chart="summaryCard.id === 'order'"
          :sub-index="summaryCard.subIndex"
          :is-increase="summaryCard.isIncrease"
          :description-html="summaryCard.descriptionHtml" />
      </template>
    </div>
  </section>
  <q-card class="q-mt-md column" style="height: calc(100vh - 355px)" v-show="modeView === 'chart'">
    <q-card-section class="row">
      <h1 class="text-h6 text-weight-medium q-mr-sm self-center">{{ chartTitle }}</h1>
      <q-select
        class="text-body"
        map-options
        emit-value
        dense
        outlined
        v-model="sizeChart"
        :options="options"></q-select>
    </q-card-section>
    <q-card-section class="col">
      <div class="full-height">
        <apexchart
          type="line"
          width="100%"
          height="100%"
          :options="chartOptions"
          :series="series" />
      </div>
    </q-card-section>
  </q-card>
  <q-table
    v-show="modeView === 'table'"
    class="q-mt-md"
    :rows="statisticTable"
    :columns="columns"
    :pagination="{ rowsPerPage: 0 }"
    hide-pagination
    separator="horizontal"
    row-key="categories">
    <template #body-cell-amount="props">
      <q-td :props="props">
        <span class="text-weight-bold">
          {{ props.row.amount }}
        </span>
      </q-td>
    </template>
    <template #body-cell-up="props">
      <q-td :props="props">
        <q-badge :color="props.row.up >= 0 ? 'green' : 'red'">
          {{ `${props.row.up}%` }}
        </q-badge>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'
import SummaryCard from './components/SummaryCard.vue'
import VueApexCharts from 'vue3-apexcharts'
import { useEnhancer } from '@/app/enhancer'
import globalFilter from '@/helpers/filters'
import dayjs from 'dayjs'
import { useFetchStatistics } from 'src/hooks/useFetchStatistics'
export default defineComponent({
  name: 'Dashboard',
  components: {
    SummaryCard,
    apexchart: VueApexCharts,
  },
  setup() {
    const {
      fetchStatisticById,
      fetchStatisticsChart,
      summaryCards,
      listStatistics,
      statisticTable,
    } = useFetchStatistics()
    const { route, router } = useEnhancer()
    const statisticBy: Ref<StatisticBy> = ref('byWeek')
    const statisticType: Ref<StatisticType> = ref('user')
    const statisticId = ref('')
    const sizeChart = ref(12)
    const modeView = ref('chart')
    const columns = [
      {
        name: 'group',
        label: 'Nhóm',
        align: 'left',
        field: 'group',
      },
      {
        name: 'categories',
        label: 'Hạng mục',
        field: 'categories',
        align: 'left',
      },
      {
        name: 'amount',
        label: 'Số lượng',
        field: 'amount',
        align: 'right',
      },
      {
        name: 'unit',
        label: 'Đơn vị',
        field: 'unit',
        align: 'left',
      },
      {
        name: 'up',
        label: '% Up',
        field: 'up',
        align: 'left',
      },
    ]
    const dashboardTitle = computed(() => {
      const mapping = {
        byDay: 'Thống kê theo ngày',
        byWeek: 'Thống kê theo tuần',
        byMonth: 'Thống kê theo tháng',
        byYear: 'Thống kê theo năm',
      }
      return mapping?.[statisticBy.value as StatisticBy] ?? ''
    })
    const statisticTypeData = computed(() => {
      const mapping = {
        user: {
          label: 'Khách hàng',
          unit: 'người',
        },
        driver: {
          label: 'Tài xế',
          unit: 'người',
        },
        order: {
          label: 'Đơn hàng',
          unit: 'đơn',
        },
        revenue: {
          label: 'Doanh thu (1M)',
          unit: 'M',
        },
      }
      return mapping?.[statisticType.value] ?? { label: '', unit: '' }
    })
    const chartOptions = computed(() => {
      return {
        chart: {
          id: 'statistic-chart',
          type: 'line',
          toolbar: {
            show: true,
          },
        },
        colors: ['#9155fd'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          size: 1,
        },
        yaxis: {
          title: {
            text: statisticTypeData.value.label,
          },
          ...(statisticType.value !== 'revenue' && {
            labels: {
              formatter: function (val: any) {
                return val?.toFixed(0) ?? val
              },
            },
          }),
        },
        xaxis: {
          categories: chartLabel.value.map((item) => item.label),
        },
      }
    })
    const series = computed(() => {
      const chartData = {
        user: chartLabel.value.map((item) => listStatistics?.value?.[item.value]?.totalUsers ?? 0),
        driver: chartLabel.value.map(
          (item) => listStatistics?.value?.[item.value]?.totalDrivers ?? 0
        ),
        order: chartLabel.value.map(
          (item) => listStatistics?.value?.[item.value]?.totalOrders ?? 0
        ),
        revenue: chartLabel.value.map((item) => listStatistics?.value?.[item.value]?.revenue ?? 0),
      }
      return [
        {
          name: statisticTypeData.value.label,
          data: chartData[statisticType.value],
        },
      ]
    })

    const chartLabel = computed(() => {
      switch (statisticBy.value) {
        case 'byDay': {
          const ids = Array.from(Array(sizeChart.value).keys())
            .map((item: number) => {
              return globalFilter.getStatisticsIdFromDate(
                dayjs(new Date()).subtract(item, 'day'),
                'byDay'
              )
            })
            .reverse()
          return ids.map((id) => {
            // id: 2022-08-02
            const [year, month, date] = id.split('-')
            return {
              label: `${date}-${month}-${year}`,
              value: id,
            }
          })
        }
        case 'byWeek': {
          const ids = Array.from(Array(sizeChart.value).keys())
            .map((item: number) => {
              return globalFilter.getStatisticsIdFromDate(
                dayjs(new Date()).subtract(item, 'week'),
                'byWeek'
              )
            })
            .reverse()
          return ids.map((id) => {
            // id: 2022-W32
            const [year, week] = id.split('-W')
            return {
              label: `Tuần ${week} - ${year}`,
              value: id,
            }
          })
        }
        case 'byMonth': {
          const ids = Array.from(Array(sizeChart.value).keys())
            .map((item: number) => {
              return globalFilter.getStatisticsIdFromDate(
                dayjs(new Date()).subtract(item, 'month'),
                'byMonth'
              )
            })
            .reverse()
          return ids.map((id) => {
            // id: 2022-08
            const [year, week] = id.split('-')
            return {
              label: `Tháng ${week} - ${year}`,
              value: id,
            }
          })
        }
        case 'byYear': {
          const ids = Array.from(Array(sizeChart.value).keys())
            .map((item: number) => {
              return globalFilter.getStatisticsIdFromDate(
                dayjs(new Date()).subtract(item, 'year'),
                'byYear'
              )
            })
            .reverse()
          return ids.map((id) => {
            return {
              label: id,
              value: id,
            }
          })
        }

        default:
          return []
      }
    })
    const chartTitle = computed(() => {
      const mapping = {
        user: 'Chi tiết số lượng khách hàng trong',
        driver: 'Chi tiết số lượng tài xế trong',
        order: 'Chi tiết số lượng đơn hàng trong',
        revenue: 'Chi tiết doanh thu trong',
      }
      return mapping?.[statisticType.value as StatisticType] ?? ''
    })
    const statisticByOptions = [
      {
        label: 'ngày',
        value: 'byDay',
      },
      {
        label: 'tuần',
        value: 'byWeek',
      },
      {
        label: 'tháng',
        value: 'byMonth',
      },
      {
        label: 'năm',
        value: 'byYear',
      },
    ]
    const statisticIdOptions = computed(() => {
      switch (statisticBy.value) {
        case 'byDay': {
          const ids = Array.from(Array(30).keys()).map((item: number) => {
            return globalFilter.getStatisticsIdFromDate(
              dayjs(new Date()).subtract(item, 'day'),
              'byDay'
            )
          })
          return ids.map((id) => {
            // id: 2022-08-02
            const [year, month, date] = id.split('-')
            return {
              label: `${date}-${month}-${year}`,
              value: id,
            }
          })
        }
        case 'byWeek': {
          const ids = Array.from(Array(50).keys()).map((item: number) => {
            return globalFilter.getStatisticsIdFromDate(
              dayjs(new Date()).subtract(item, 'week'),
              'byWeek'
            )
          })
          return ids.map((id) => {
            // id: 2022-W32
            const [year, week] = id.split('-W')
            return {
              label: `Tuần ${week} - ${year}`,
              value: id,
            }
          })
        }
        case 'byMonth': {
          const ids = Array.from(Array(12).keys()).map((item: number) => {
            return globalFilter.getStatisticsIdFromDate(
              dayjs(new Date()).subtract(item, 'month'),
              'byMonth'
            )
          })
          return ids.map((id) => {
            // id: 2022-08
            const [year, week] = id.split('-')
            return {
              label: `Tháng ${week} - ${year}`,
              value: id,
            }
          })
        }
        case 'byYear': {
          const ids = Array.from(Array(10).keys()).map((item: number) => {
            return globalFilter.getStatisticsIdFromDate(
              dayjs(new Date()).subtract(item, 'year'),
              'byYear'
            )
          })
          return ids.map((id) => {
            return {
              label: id,
              value: id,
            }
          })
        }

        default:
          return []
      }
    })
    const options = computed(() => {
      const unit = {
        byDay: 'ngày',
        byWeek: 'tuần',
        byMonth: 'tháng',
        byYear: 'năm',
      }
      return [12, 24, 36].map((item) => ({
        label: `${item} ${unit[statisticBy.value]}`,
        value: item,
      }))
    })

    const handleStatisticBy = (value: string) => {
      router.push({
        query: { ...route.query, statisticBy: value },
      })
    }

    const handleStatisticType = (value: string) => {
      router.push({
        query: { ...route.query, statisticType: value },
      })
    }

    const setStatisticBy = (value: any) => {
      ;['byDay', 'byWeek', 'byMonth', 'byYear'].includes(value)
        ? (statisticBy.value = value)
        : (statisticBy.value = 'byWeek')
    }
    const setStatisticType = (value: any) => {
      ;['user', 'driver', 'order', 'revenue'].includes(value)
        ? (statisticType.value = value)
        : (statisticType.value = 'user')
    }

    const getPreId = (value: any) => {
      switch (statisticBy.value) {
        case 'byDay': {
          return globalFilter.getStatisticsIdFromDate(
            dayjs(dayjs(value, 'YYYY-MM-DD')).subtract(1, 'day'),
            'byDay'
          )
        }
        case 'byWeek': {
          const [year, week] = value.split('-W')
          if (week === '01') {
            return `${year - 1}-W52`
          } else {
            const w = week - 1
            return w < 10 ? `${year}-W0${w}` : `${year}-W${w}`
          }
        }
        case 'byMonth': {
          return globalFilter.getStatisticsIdFromDate(
            dayjs(dayjs(value, 'YYYY-MM')).subtract(1, 'month'),
            'byMonth'
          )
        }
        case 'byYear': {
          return globalFilter.getStatisticsIdFromDate(
            dayjs(dayjs(value, 'YYYY')).subtract(1, 'year'),
            'byYear'
          )
        }
      }
    }

    onMounted(() => {
      setStatisticBy(route.query?.statisticBy)
      setStatisticType(route.query?.statisticType)
      router.push({
        query: { statisticBy: statisticBy.value, statisticType: statisticType.value },
      })
    })

    watch(
      () => route.query,
      (params) => {
        setStatisticBy(params?.statisticBy)
        setStatisticType(params?.statisticType)
      },
      {
        immediate: true,
      }
    )
    watch(
      () => statisticBy.value,
      (value) => {
        statisticId.value = globalFilter.getStatisticsIdFromDate(new Date(), value)
        fetchStatisticsChart(sizeChart.value, value)
      },
      {
        immediate: true,
      }
    )

    watch(
      () => statisticId.value,
      (value) => {
        const preId = getPreId(value)
        fetchStatisticById(value, preId, statisticBy.value)
      },
      {
        immediate: true,
      }
    )
    watch(
      () => sizeChart.value,
      (value) => {
        fetchStatisticsChart(value, statisticBy.value)
      },
      {
        immediate: true,
      }
    )
    return {
      summaryCards,
      chartOptions,
      statisticId,
      series,
      options,
      sizeChart,
      statisticBy,
      statisticType,
      dashboardTitle,
      statisticByOptions,
      statisticIdOptions,
      chartTitle,
      handleStatisticBy,
      handleStatisticType,
      chartLabel,
      columns,
      statisticTable,
      modeView,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.q-table) {
  th {
    background-color: $grey-1;
    font-size: 13px;
    font-weight: 700;
  }
}
</style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Dashboard'
</route>
