<template>
  <q-card
    class="summary-card"
    :flat="active"
    :bordered="active"
    :class="active && 'summary-card__active'">
    <q-item>
      <q-item-section avatar class="summary-card__avatar q-pr-sm">
        <q-avatar class="shadow-1" :icon="icon" size="md" :color="color" text-color="white" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-bold text-grey-8">{{ title }}</q-item-label>
      </q-item-section>
      <q-item-section
        @click="dialog = true"
        class="cursor-pointer"
        v-if="taskChart"
        style="margin-left: -20px">
        <q-icon size="20px" name="help_outline" color="primary">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]" max-width="10rem">
            <span class="text-caption"> Các loại yêu cầu </span>
          </q-tooltip>
        </q-icon>
      </q-item-section>
      <q-space></q-space>
      <q-item-section v-if="warning" class="col-auto">
        <q-icon name="warning" color="orange">
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]" max-width="10rem">
            <span class="text-caption">
              {{ warning }}
            </span>
          </q-tooltip>
        </q-icon>
      </q-item-section>
    </q-item>
    <q-item class="q-py-none">
      <q-item-section class="col-auto">
        <div class="main-index">
          {{ mainIndex }}
        </div>
      </q-item-section>
      <q-item-section style="margin-left: 4px !important">
        <div class="sub-index q-mt-sm" :class="isIncrease ? 'text-green' : 'text-red'">
          {{ isIncrease ? '+' : '' }}{{ subIndex }}
        </div>
      </q-item-section>
    </q-item>
    <q-item class="q-pt-none">
      <q-item-section class="col-auto">
        <div v-if="descriptionHtml" class="text-body2" v-html="descriptionHtml" />
      </q-item-section>
    </q-item>
    <q-dialog v-if="taskChart" v-model="dialog">
      <q-card style="width: 700px; height: 400px">
        <q-card-section>
          <div class="text-h5 text-center q-mb-md">Các loại yêu cầu</div>
          <apexchart
            type="pie"
            width="100%"
            height="300px"
            :options="pieChartOptions"
            :series="pieSeries" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useFetchStatistics } from 'src/hooks/useFetchStatistics'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'SummaryCard',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      require: true,
      default: () => 'primary',
    },
    active: {
      type: Boolean,
      require: true,
      default: () => false,
    },
    warning: {
      type: String,
    },
    mainIndex: {
      type: String,
      require: true,
      default: () => '',
    },
    subIndex: {
      type: String,
    },
    isIncrease: {
      type: Boolean,
      require: true,
      default: () => false,
    },
    descriptionHtml: {
      type: String,
    },
    taskChart: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    const { statisticsOverall } = useFetchStatistics()
    const dialog = ref(false)
    const pieChartOptions = computed(() => {
      return {
        chart: {
          id: 'statistic-pie-chart',
          type: 'pie',
        },
        labels: ['Ghi âm' /*'Biểu mẫu'*/, , 'Tạo bởi nhân viên', 'Tạo bởi người dùng'],
      }
    })
    const pieSeries = computed(() => {
      return [
        statisticsOverall.value.totalTasksAudio,
        statisticsOverall.value.totalTasksForm,
        statisticsOverall.value.totalTasksFromOrderByStaff,
        statisticsOverall.value.totalTasksFromOrderByUser,
      ]
    })
    return {
      dialog,
      pieChartOptions,
      pieSeries,
    }
  },
})
</script>

<style lang="scss" scoped>
.summary-card {
  &:hover {
    cursor: pointer;
    transform: scale(0.98);
    transition-duration: 0.5s;
  }
  &__active {
    cursor: default !important;
    transform: none !important;
    border: 3px solid $primary;
  }
  &__avatar {
    min-width: 0 !important;
  }
  .q-item {
    min-height: 0 !important;
  }
}
.main-index {
  font-size: 1.5rem;
  font-weight: 700;
}
.sub-index {
  font-size: 0.8rem;
}
</style>
