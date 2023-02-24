<template>
  <!-- style="height: calc(100vh - 230px)" -->
  <div>
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        title="Chọn kho ngữ liệu"
        icon="settings"
        :done="step > 1"
        style="min-height: 200px">
        <p class="text-h6 q-mb-sm">Hãy chọn kho ngữ liệu bạn muốn kiểm tra</p>
        <div>
          <div>
            <q-radio
              :disable="userDetail?.data?.length === 0"
              v-model="templateSelected"
              val="own"
              label="Kho ngữ liệu của bạn" />
          </div>
          <div>
            <q-radio v-model="templateSelected" val="system" label="Kho ngữ liệu của hệ thống" />
          </div>
          <div>
            <q-radio v-model="templateSelected" val="internet" label="Kho ngữ liệu internet" />
          </div>
          <div v-if="templateSelected === 'internet'" class="q-ml-md q-mt-sm">
            <span class="text-bold q-ml-sm">Tùy chỉnh internet</span>
            <div class="row q-gutter-md q-ml-md">
              <q-input
                style="width: 150px"
                type="number"
                v-model="numberOfKeyword"
                label="Số lượng keyword" />
              <q-input
                style="width: 150px"
                type="number"
                v-model="numberOfResult"
                label="Số lượng kết quả" />
            </div>
          </div>
          <div>
            <q-radio
              :disable="userDetail?.organizationList?.length === 0"
              v-model="templateSelected"
              val="organization"
              label="Kho ngữ liệu của tổ chức" />
          </div>
        </div>
        <div v-if="templateSelected === 'organization'" class="q-ml-md q-mt-sm">
          <span class="text-bold q-ml-sm">Chọn kho ngữ liệu của tổ chức bạn muốn kiểm tra</span>
          <div v-for="org in userDetail?.organizationList" :key="org.uid">
            <div>
              <q-radio
                checked-icon="task_alt"
                v-model="orgSelected"
                :val="org.uid"
                :label="org.name" />
            </div>
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Chọn tệp cần kiểm tra"
        icon="create_new_folder"
        :done="step > 2"
        style="min-height: 200px">
        <p class="text-h6 q-mb-md">Hãy tải lên các tệp bạn cần kiểm tra</p>
        <div class="q-ml-md">
          <q-btn
            size="md"
            text-color="white"
            icon="upload"
            label="Tải tệp lên"
            @click="onPickFile"
            class="bg-gradient-primary q-mb-sm" />
        </div>
        <div class="q-ml-md" v-for="file in files" :key="file">
          <div>
            <q-icon size="7px" name="circle" class="list-icon q-mr-sm" />
            <span>{{ file.name }}</span>
          </div>
        </div>
        <q-file class="hidden" multiple ref="filePicker" v-model="files" />
      </q-step>

      <q-step
        :name="3"
        title="Chọn nhận thông báo"
        icon="add_comment"
        style="min-height: 200px"
        :done="step > 3">
        <div>
          <div>
            <q-radio v-model="receiveWay" val="mail" label="Thông báo qua email khi hoàn thành" />
          </div>
          <div>
            <q-radio v-model="receiveWay" val="not" label="Không nhận email thông báo" />
          </div>
        </div>
      </q-step>

      <q-step :name="4" title="Hoàn thành" icon="add_comment" style="min-height: 200px">
        <div>Cảm ơn bạn đã sử dụng hệ thống</div>
      </q-step>

      <template #navigation>
        <q-stepper-navigation>
          <q-btn
            no-caps
            @click="clickNext"
            :disable="disableNext"
            color="primary"
            :label="
              step === 4 ? 'Thực hiện kiểm tra khác' : step === 3 ? 'Bắt đầu kiểm tra' : 'Tiếp tục'
            " />
          <q-btn
            v-if="step > 1 && step !== 4"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Quay lại"
            class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted, ComputedRef } from 'vue'
  import { QTableProps } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchTest } from '@/hooks/useFetchTest'
  import { useImage } from '@/hooks/useImage'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  import globalFilter from '@/helpers/filters'
  import { Status } from '@/constants/enums'
  import { useFetchUser } from '@/hooks/useFetchUser'

  export default defineComponent({
    name: 'TestStepper',
    components: {},
    setup() {
      const { executeTest } = useFetchTest()
      const { route, router, authStore, showGlobalLoading, hideGlobalLoading } = useEnhancer()
      const { uploadImage } = useImage()
      const { userDetail, fetchUserById, uploadFile } = useFetchUser()

      const step = ref(1)
      const templateSelected = ref('own')
      const receiveWay = ref('mail')
      const filePicker = ref()
      const stepper = ref()
      const files = ref()
      const listTestUrls = ref()
      const orgSelected = ref(null)
      const numberOfKeyword = ref(3)
      const numberOfResult = ref(1)

      const disableNext = computed(() => {
        if (
          step.value === 1 &&
          userDetail?.value?.data?.length === 0 &&
          templateSelected.value === 'own'
        )
          return true
        if (step.value === 1 && templateSelected.value === 'organization' && !orgSelected.value)
          return true
        if (step.value === 2 && !files.value) return true
        return false
      })

      const onPickFile = () => {
        filePicker.value.pickFiles()
      }
      const blobToBase64 = (blob: Blob) => {
        return new Promise((resolve, _) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      }

      const clickNext = async () => {
        showGlobalLoading()
        try {
          if (step.value === 2) {
            const links = await Promise.all(
              files.value.map(async (file: any) => {
                const { type } = file
                const blob = new Blob([file], { type: type })
                const base64: any = await blobToBase64(blob)
                const payload = {
                  base64: base64.replace(/^data:.+;base64,/, ''),
                  name: file.name,
                  size: file.size,
                }
                return await uploadImage(payload)
              })
            )
            listTestUrls.value = links
            stepper.value.next()
          } else if (step.value === 3) {
            const payload = {
              testList: listTestUrls.value,
              organizationUid: orgSelected.value,
              type: templateSelected.value,
              numberOfKeyword: +numberOfKeyword.value,
              numberOfResult: +numberOfResult.value,
              sendEmail: true,
            }
            if (receiveWay.value === 'not') payload.sendEmail = false
            await executeTest(payload)
            stepper.value.next()
          } else if (step.value === 4) {
            files.value = null
            step.value = 1
          } else {
            stepper.value.next()
          }
        } catch (err) {
          console.log(err)
        }
        hideGlobalLoading()
      }

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
        // router.push({ name: 'doctors-id', params: { id: row.uid } })
      }

      onMounted(async () => {
        showGlobalLoading()
        await fetchUserById(authStore.uid)
        console.log(userDetail.value)
        hideGlobalLoading()
      })
      return {
        step,
        templateSelected,
        filePicker,
        files,
        stepper,
        receiveWay,
        disableNext,
        onPickFile,
        clickNext,
        numberOfKeyword,
        numberOfResult,

        authStore,
        pagination,
        columns,
        clickEdit,
        onLoadmore,
        Status,
        defaultAvatar,
        userDetail,
        orgSelected,
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
