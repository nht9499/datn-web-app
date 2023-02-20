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
      <h1 class="text-h6 text-weight-medium">Chi tiết kiểm tra</h1>
    </div>
  </div>
  <q-card class="q-mt-md">
    <q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col">
            <div class="flex flex-center justify-center">
              <div class="row q-gutter-md">
                <p class="self-center">Lọc điểm nhỏ nhất</p>
                <div>
                  <q-input suffix="%" outlined style="width: 70px" v-model="minScore"></q-input>
                </div>
                <div class="col self-center">
                  <q-btn outline no-caps color="primary" label="Áp dụng" @click="apply"></q-btn>
                </div>
              </div>
            </div>
            <div v-if="contentSelected" class="q-mx-xl q-mt-lg">
              <span class="text-bold">Câu đã chọn: </span>
              <q-scroll-area v-if="contentSelected?.content" visible style="height: 100px">
                <div>
                  {{ contentSelected.content }}
                </div>
              </q-scroll-area>
            </div>
          </div>
          <div class="col">
            <div>
              <div class="text-center">
                <span class="text-bold text-h6">Các câu tương đồng</span>
              </div>
              <q-scroll-area v-if="listContentMatch?.length > 0" visible style="height: 170px">
                <div
                  @click="clickSentence(data)"
                  v-for="data in listContentMatch"
                  :key="data.id"
                  class="q-py-xs cursor-pointer">
                  <span class="text-bold">{{ $filters.roundPercent(data.score) }}% </span> -
                  {{ data.content }}
                  <span class="text-bold">{{ $filters.removeUnique(data.name) }}</span>
                </div>
              </q-scroll-area>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row q-gutter-md">
        <q-scroll-area ref="testScrollRef" class="col" visible style="height: 400px">
          <div class="text-h4 q-mb-md">Văn bản kiểm tra</div>
          <div ref="testRef">
            <span
              @click="selectedDataTest(data, idx)"
              v-for="(data, idx) in dataTest?.data"
              :key="data.id"
              class="q-mr-xs"
              :class="data.class">
              {{ data.content }}
            </span>
          </div>
        </q-scroll-area>
        <q-scroll-area ref="templateScrollRef" class="col" visible style="height: 400px">
          <div class="text-h4 q-mb-md">Văn bản mẫu</div>
          <div ref="templateRef" v-for="data in dataTemplate" :key="data.id">
            <p class="text-bold">{{ $filters.removeUnique(data.name) }}</p>
            <span
              @click="selectedDataTemplate(contentData, idxContent)"
              v-for="(contentData, idxContent) in data?.data"
              :key="contentData.id"
              class="q-mr-xs"
              :class="contentData.class">
              {{ contentData.content }}
            </span>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, reactive, toRefs, computed, onMounted } from 'vue'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchTestResult } from '@/hooks/useFetchTestResults'
  import globalFilter from '@/helpers/filters'
  import { api } from '@/modules/axios'
  // import { driver } from '@/constants/define'
  export default defineComponent({
    name: 'HistoriesDetail',
    components: {},
    setup() {
      const { route, router, showNotify, authStore } = useEnhancer()
      const { getTestResultById, resultData } = useFetchTestResult()
      watch(
        () => route.params,
        (params) => {
          // fetchDriverById(params.id as string)
        },
        {
          immediate: true,
        }
      )
      onMounted(async () => {
        await getTestResultById(route.params.id as string)
        const pathTest = resultData.value.dataTestUrl.replace(
          'D:/DATN/datn-web-app/public',
          'http://localhost:3001/'
        )
        const pathTemplate = resultData.value.dataTemplateUrl.replace(
          'D:/DATN/datn-web-app/public',
          'http://localhost:3001/'
        )
        // const a = await fetch(resultData.value.dataTestUrl)
        const headers = new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        })
        const a = await fetch(pathTest, {
          method: 'GET',
          headers: headers,
          mode: 'cors',
        })
        const b = await fetch(pathTemplate, {
          method: 'GET',
          headers: headers,
          mode: 'cors',
        })
        const blobA = await a.blob()
        const blobB = await b.blob()
        readJsonFile(blobA)
        readJsonFileTemplate(blobB)
      })

      const dataTest = ref()
      const dataTemplate = ref()
      const minScore = ref(97)
      const testScrollRef = ref()
      const templateScrollRef = ref()

      const readJsonFile = (file: any) => {
        const reader: any = new FileReader()
        reader.onload = () => {
          const data = JSON.parse(reader.result)
          dataTest.value = computeClass(data[0])
          return data
        }
        reader.readAsText(file)
      }
      const readJsonFileTemplate = (file: any) => {
        const reader: any = new FileReader()
        reader.onload = () => {
          const data = JSON.parse(reader.result)
          dataTemplate.value = data.map((data: any) => computeClassTemplate(data))
          return data
        }
        reader.readAsText(file)
      }

      const computeClass = (file: any) => {
        file.data.map((data: any) => {
          data.score.map((score: any) => {
            if (score.score > minScore.value / 100) {
              data.class = 'bg-yellow-5 cursor-pointer'
              return
            } else {
              data.class = null
            }
          })
        })
        return file
      }
      const computeClassTemplate = (file: any) => {
        file.data.map((data: any) => {
          if (data.score > minScore.value / 100) {
            data.class = 'bg-yellow-5'
          } else {
            data.class = null
          }
        })
        return file
      }

      const apply = () => {
        dataTest.value = computeClass(dataTest.value)
        dataTemplate.value = dataTemplate.value.map((data: any) => computeClassTemplate(data))
      }

      const testRef = ref()
      const templateRef = ref()
      const listContentMatch = ref()
      const contentSelected = ref()

      const backRouter = () => {
        router.back()
      }
      const selectedDataTest = (data: any, indexSelected: number) => {
        if (!data.class) return
        contentSelected.value = data
        resetMatchTest()
        resetMatchTemplate()
        let contentIdList: string[] = []
        dataTest.value.data.map((contentDataTest: any, index: number) => {
          if (contentDataTest.class) {
            if (index === indexSelected) {
              contentDataTest.class = 'bg-green-3 cursor-pointer'
              contentDataTest.score.map((score: any) => {
                contentIdList.push(score.sentence_id)
              })
            }
          }
        })
        const listMatch: any[] = []
        dataTemplate.value.map((file: any, fileIndex: number) => {
          file.data.map((contentDataTemplate: any, contentIndex: number) => {
            if (contentIdList.includes(contentDataTemplate.id)) {
              contentDataTemplate.class = 'bg-green-3'
              const content = {
                ...contentDataTemplate,
                document_id: file.id,
                name: file.name,
                fileIndex,
                contentIndex,
                score:
                  contentSelected.value.score[
                    contentIdList.findIndex((data) => data === contentDataTemplate.id)
                  ].score,
              }
              listMatch.push(content)
            }
          })
        })
        listContentMatch.value = listMatch
        // const a = templateRef.value[listMatch[1].fileIndex].children[listMatch[1].contentIndex]
        // console.log({
        //   div: templateRef.value[listMatch[1].fileIndex].children[listMatch[1].contentIndex],
        // })
        // templateScrollRef.value.setScrollPosition('vertical', a.offsetTop)
      }
      const clickSentence = (data: any) => {
        const sentence = templateRef.value[data.fileIndex].children[data.contentIndex]
        templateScrollRef.value.setScrollPosition('vertical', sentence.offsetTop)
      }

      // const selectedDataTemplate = (data: any, idx) => {
      //   const defaultClassList = ['q-mr-xs bg-yellow cursor-pointer']
      //   const selectedClassList = ['q-mr-xs bg-positive cursor-pointer']
      //   const testChildren = [...testRef.value.children]
      //   const foundIndexTest = testData.findIndex((ctx) => ctx.matchId == data.matchId)
      //   testChildren.map((child) => {
      //     if (child.classList.length === 3) {
      //       child.classList = defaultClassList
      //     }
      //   })
      //   testChildren[foundIndexTest].classList = selectedClassList

      //   const templateChildren = [...templateRef.value.children]
      //   const foundIndexTemplate = templateData.findIndex((ctx) => ctx.matchId == data.matchId)
      //   templateChildren.map((child) => {
      //     if (child.classList.length === 3) {
      //       child.classList = defaultClassList
      //     }
      //   })
      //   templateChildren[foundIndexTemplate].classList = selectedClassList
      //   console.log({ div: testRef.value })
      // }

      const resetMatchTest = () => {
        dataTest.value.data.map((contentDataTest: any) => {
          if (contentDataTest.class) {
            contentDataTest.class = 'bg-yellow-5 cursor-pointer'
          }
        })
      }
      const resetMatchTemplate = () => {
        dataTemplate.value.map((file: any) => {
          file.data.map((contentDataTemplate: any) => {
            if (contentDataTemplate.class) {
              contentDataTemplate.class = 'bg-yellow-5 cursor-pointer'
            }
          })
        })
      }

      const splitterModel = ref(50)

      return {
        splitterModel,
        dataTest,
        dataTemplate,
        testRef,
        templateRef,
        selectedDataTest,
        // selectedDataTemplate,
        minScore,
        contentSelected,
        listContentMatch,
        testScrollRef,
        templateScrollRef,

        authStore,
        backRouter,
        apply,
        clickSentence,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.table-staff) {
    max-height: 100%;
    max-width: 100%;
  }
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
  .title {
    position: relative;
    z-index: 3;
    top: 10px;
    left: 30px;
  }
  .card-info {
    border: solid 0.5px $primary;
  }
</style>
