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
    <q-card-section v-if="!dialogPick">
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
            <div v-if="contentSelected && !dialogPick" class="q-mx-xl q-mt-lg">
              <div class="text-center">
                <span class="text-bold text-h6">Câu đã chọn</span>
              </div>
              <q-scroll-area v-if="contentSelected?.content" visible style="height: 100px">
                <div>
                  {{ contentSelected.content }}
                </div>
              </q-scroll-area>
            </div>
          </div>
          <div class="col">
            <div class="text-center q-mb-lg">
              <q-btn
                outline
                no-caps
                size="lg"
                color="primary"
                label="Chọn file khác"
                @click="dialogPick = true"></q-btn>
            </div>
            <div v-if="listContentMatch?.length > 0 && !dialogPick">
              <div class="text-center q-pt-xs">
                <span class="text-bold text-h6">Câu tương đồng</span>
              </div>
              <q-scroll-area visible style="height: 100px">
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
        <q-scroll-area
          v-if="!dialogPick"
          ref="testScrollRef"
          class="col"
          visible
          style="height: 400px">
          <div class="text-h4 q-mb-md">Văn bản kiểm tra</div>
          <p v-if="dataTest" class="text-h5">{{ $filters.removeUnique(dataTest.name) }}</p>
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
        <q-scroll-area
          v-if="!dialogPick"
          ref="templateScrollRef"
          class="col"
          visible
          style="height: 400px">
          <div class="text-h4 q-mb-md">Văn bản mẫu</div>
          <p v-if="dataTemplate" class="text-h5">
            {{ $filters.removeUnique(dataTemplate[0]?.name) }}
          </p>
          <div ref="templateRef" v-for="data in dataTemplate" :key="data.id">
            <span
              v-for="contentData in data?.data"
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
  <vue-final-modal
    v-model="dialogPick"
    v-slot="{ close }"
    ref="incomingCall"
    classes="modal-container rounded-borders shadow-2"
    content-class="modal-content"
    :click-to-close="false"
    :esc-to-close="false"
    :z-index-base="9999"
    prevent-click
    hide-overlay
    drag>
    <q-card style="width: 900px">
      <q-card-section>
        <div class="text-h6 text-center">Chọn tệp kiểm tra và tệp mẫu để xem chi tiết</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-gutter-md">
          <div class="col border">
            <div class="text-center">
              <span class="text-bold text-h6">Chọn tệp kiểm tra </span>
            </div>
            <q-scroll-area visible style="height: 200px">
              <div
                :class="data.class"
                class="q-py-xs cursor-pointer"
                v-for="(data, index) in listTestFile"
                :key="data.id">
                <div
                  style="font-size: 1.1rem; font-weight: 600"
                  @click="selectedFileTest(data, index)">
                  - {{ $filters.removeUnique(data.name) }}
                </div>
                <div v-if="data.url" class="text-blue">
                  <a :href="data.url">{{ data.url }}</a>
                </div>
              </div>
            </q-scroll-area>
          </div>
          <!-- <q-separator vertical class="q-mx-sm" /> -->
          <div class="col border">
            <div>
              <div class="text-center">
                <span class="text-bold text-h6">Các tệp tương đồng</span>
              </div>
              <q-scroll-area visible style="height: 200px">
                <div
                  v-for="data in listTemplateFileMap"
                  :key="data.id"
                  class="q-py-xs cursor-pointer text-body1">
                  <div @click="selectedFileTemplate(data, close)">
                    - <span>{{ $filters.getSimilarMethod(data.type) }} </span> -
                    <span class="text-bold">{{ $filters.roundPercent(data.score) }}% </span> -
                    {{ data.quantity }} câu tương đồng ở ngưỡng 80%
                    <div style="font-size: 1.1rem; font-weight: 600">
                      {{ $filters.removeUnique(data.name) }}
                    </div>
                  </div>
                  <div v-if="data.data.url" class="text-blue">
                    <a :href="data.data.url">{{ data.data.url }}</a>
                  </div>
                </div>
              </q-scroll-area>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </vue-final-modal>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, reactive, toRefs, computed, onMounted } from 'vue'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchTestResult } from '@/hooks/useFetchTestResults'
  import globalFilter from '@/helpers/filters'
  import { api } from '@/modules/axios'
  import { VueFinalModal } from 'vue-final-modal'
  // import { driver } from '@/constants/define'
  export default defineComponent({
    name: 'HistoriesDetail',
    components: { VueFinalModal },
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

      const dialogPick = ref(true)
      const dataTest = ref()
      const dataTemplate = ref()
      const minScore = ref(80)
      const testScrollRef = ref()
      const templateScrollRef = ref()
      const listTestFile = ref()
      const listTemplateFile = ref()
      const listTemplateFileMap = ref()

      const readJsonFile = (file: any) => {
        const reader: any = new FileReader()
        reader.onload = () => {
          const data = JSON.parse(reader.result)
          // dataTest.value = computeClass(data[0])
          listTestFile.value = data
        }
        reader.readAsText(file)
      }
      const readJsonFileTemplate = (file: any) => {
        const reader: any = new FileReader()
        reader.onload = () => {
          const data = JSON.parse(reader.result)
          // dataTemplate.value = data.map((data: any) => computeClassTemplate(data))
          listTemplateFile.value = data
          return data
        }
        reader.readAsText(file)
      }

      const computeClass = (file: any) => {
        file.data.map((data: any) => {
          data.score.map((score: any) => {
            // TODO: compare document id
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
      // const computeClassTemplate = (file: any) => {
      //   file.data.map((data: any) => {
      //     if (data.score > minScore.value / 100) {
      //       data.class = 'bg-yellow-5'
      //     } else {
      //       data.class = null
      //     }
      //   })
      //   return file
      // }

      const apply = () => {
        dataTest.value = computeClass(dataTest.value)
        // dataTemplate.value = dataTemplate.value.map((data: any) => computeClassTemplate(data))
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
        clickSentence(listMatch[0])
        // const a = templateRef.value[listMatch[1].fileIndex].children[listMatch[1].contentIndex]
        // console.log({
        //   div: templateRef.value[listMatch[1].fileIndex].children[listMatch[1].contentIndex],
        // })
        // templateScrollRef.value.setScrollPosition('vertical', a.offsetTop)
      }
      const clickSentence = (data: any) => {
        const sentence = templateRef.value[data.fileIndex].children[data.contentIndex]
        templateScrollRef.value.setScrollPosition('vertical', sentence.offsetTop - 50, 500)
      }

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
              contentDataTemplate.class = null
            }
          })
        })
      }
      const resetSelectedFile = () => {
        listTestFile?.value?.map((file: any) => {
          file.class = null
        })
      }

      const selectedFileTest = (file: any, index: number) => {
        resetSelectedFile()
        listTestFile.value[index].class = 'bg-blue'
        dataTest.value = computeClass(file)
        listTemplateFileMap.value = file.info.map((info: any) => {
          return {
            ...info,
            data: {
              ...listTemplateFile.value.find((file: any) => file.id === info.id),
            },
          }
        })
      }
      const selectedFileTemplate = (file: any, callback: () => void) => {
        callback()
        file.data.data.map((content: any) => {
          content.class = null
        })
        dataTemplate.value = [file.data]
        apply()
      }
      const onBack = () => {
        router.back()
      }

      const splitterModel = ref(50)

      return {
        listTestFile,
        listTemplateFileMap,
        dialogPick,
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
        selectedFileTest,
        selectedFileTemplate,
        onBack,

        authStore,
        backRouter,
        apply,
        clickSentence,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.modal-container) {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: all-scroll;
  }
  .modal__content {
    flex-grow: 1;
    overflow-y: auto;
  }
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
