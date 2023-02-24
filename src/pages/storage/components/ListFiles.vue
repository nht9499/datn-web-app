<template>
  <!-- style="height: calc(100vh - 230px)" -->
  <div>
    <q-table
      title="Kho ngữ liệu của bạn"
      class="table-staff"
      row-key="id"
      style="max-height: calc(100vh - 205px)"
      v-model:pagination="pagination"
      :rows="userDetail?.data"
      :columns="columns"
      separator="horizontal"
      no-data-label="Không có dữ liệu"
      hide-pagination
      binary-state-sort>
      <template #top>
        <div class="full-width flex justify-between">
          <div>
            <span class="q-table__title">{{
              authStore.role === 'user' ? 'Kho ngữ liệu của bạn' : 'Kho ngữ liệu hệ thống'
            }}</span>
          </div>
          <q-btn
            @click="clickAddNew"
            outline
            rounded
            color="primary"
            label="Thêm mới"
            icon="add"></q-btn>
        </div>
      </template>
      <template #body-cell-size="props">
        <q-td :props="props">
          <span>{{ $filters.getSizeDisplay(props.row.size) }}</span>
        </q-td>
      </template>

      <template #body-cell-shared="props">
        <q-td :props="props">
          <q-icon v-if="props.row.sharedToSystem" color="positive" size="md" name="check_circle" />
        </q-td>
      </template>

      <template #body-cell-createdAt="props">
        <q-td :props="props">
          {{ $filters.dateFromNow(props.row.createdAt || null) }}
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
                <!-- <q-item dense clickable v-close-popup @click="clickEdit(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon size="xs" name="edit" />
                  </q-item-section>
                  <q-item-section class="text-body2">Thông tin chi tiết</q-item-section>
                </q-item> -->
                <q-item
                  :disable="props.row.sharedToSystem || authStore.role === 'staff'"
                  dense
                  clickable
                  v-close-popup
                  @click="handleShareFile(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon size="xs" name="share" />
                  </q-item-section>
                  <q-item-section class="text-body2">Chia sẻ với hệ thống</q-item-section>
                </q-item>
                <!-- <q-item
                  :disable="props.row.sharedToSystem"
                  dense
                  clickable
                  v-close-popup
                  @click="activeFile(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon color="positive" size="xs" name="check_circle" />
                  </q-item-section>
                  <q-item-section class="text-body2">Kích hoạt tệp</q-item-section>
                </q-item> -->
                <q-item dense clickable v-close-popup @click="deactiveFile(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon color="negative" size="xs" name="delete" />
                  </q-item-section>
                  <q-item-section class="text-body2">Xóa tệp</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="dialogAddNew">
    <q-card class="q-pa-md">
      <q-card-section>
        <p class="text-h6 q-mb-md">
          Thêm các tệp mẫu vào kho ngữ liệu {{ authStore.role === 'user' ? 'của bạn' : 'hệ thống' }}
        </p>
        <div class="q-ml-md">
          <q-btn
            size="md"
            text-color="white"
            icon="upload"
            label="Chọn tệp"
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
      </q-card-section>
      <q-card-section>
        <q-btn
          size="md"
          class="float-right"
          no-caps
          @click="clickNext"
          :disable="disableNext"
          color="primary"
          label="
            Tải lên
          " />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted, ComputedRef } from 'vue'
  import { QTableProps } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchUser } from '@/hooks/useFetchUser'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  import globalFilter from '@/helpers/filters'
  import { Status } from '@/constants/enums'
  import { useImage } from '@/hooks/useImage'

  export default defineComponent({
    name: 'ListFiles',
    components: {},
    setup() {
      const { userDetail, fetchUserById, uploadFile, removeFile, shareFile } = useFetchUser()
      const {
        route,
        router,
        authStore,
        showGlobalLoading,
        hideGlobalLoading,
        showNotify,
        showDialog,
      } = useEnhancer()
      const { uploadImage } = useImage()

      const pagination = ref({
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      })

      const disableNext = computed(() => {
        if (!files.value) return true
        else {
          return false
        }
      })

      const dialogAddNew = ref(false)
      const filePicker = ref()
      const files = ref()
      const listTemplateUrls = ref()

      const mockData = [
        {
          uid: 'a',
          name: 'name',
          size: 1065,
          sharedToSystem: true,
          createdAt: 9999999,
        },
      ]

      const columns: ComputedRef<QTableProps['columns']> = computed(() => [
        {
          name: 'name',
          required: true,
          label: 'Tên tệp',
          align: 'left',
          field: (row: AnyObject) => row?.name,
        },
        {
          name: 'size',
          required: true,
          label: 'Kích cỡ',
          align: 'left',
          field: (row: AnyObject) => row?.size,
        },
        authStore.role === 'user' && {
          name: 'shared',
          required: true,
          label: 'Chia sẻ với hệ thống',
          align: 'left',
          field: (row: AnyObject) => row?.sharedToSystem,
        },
        // {
        //   name: 'createdAt',
        //   align: 'center',
        //   label: 'Ngày tạo',
        //   field: 'createdAt',
        // },
        { name: 'actions', align: 'center', label: '', field: 'name' },
      ])

      const clickEdit = (row: AnyObject) => {
        console.log(userDetail.value)
        // router.push({ name: 'doctors-id', params: { id: row.uid } })
      }
      const clickAddNew = () => {
        dialogAddNew.value = true
      }
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
          await Promise.all(
            files.value.map(async (file: any) => {
              const { type } = file
              const blob = new Blob([file], { type: type })
              const base64: any = await blobToBase64(blob)
              const payload = {
                base64: base64.replace(/^data:.+;base64,/, ''),
                name: file.name,
                size: file.size,
                isTemplate: true,
              }
              return await uploadFile(payload)
            })
          )
          showNotify(`Thêm tệp mẫu mới thành công`, 'positive')
          await fetchUserById(authStore.uid)
          dialogAddNew.value = false
        } catch (err) {
          showNotify(`Thêm mới thất bại`, 'negative')
          console.log(err)
        }
        hideGlobalLoading()
      }

      const handleShareFile = (file: any) => {
        showDialog({
          title: 'Xác nhận',
          message: `Chia sẻ têp ${file.name} với hệ thống`,
          ok: {
            noCaps: true,
            label: 'Đồng ý',
          },
          cancel: {
            flat: true,
            noCaps: true,
            label: 'Hủy',
          },
          persistent: true,
        })
          .onOk(async () => {
            await shareFile(authStore.uid, file)
            await fetchUserById(authStore.uid)
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
      }
      const activeFile = (file: any) => {
        showDialog({
          title: 'Xác nhận',
          message: `Kích hoạt têp ${file.name}`,
          ok: {
            noCaps: true,
            label: 'Đồng ý',
          },
          cancel: {
            flat: true,
            noCaps: true,
            label: 'Hủy',
          },
          persistent: true,
        })
          .onOk(() => {
            console.log('ok')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
      }
      const deactiveFile = async (file: any) => {
        showDialog({
          title: 'Xác nhận',
          message: `Vô hiệu hóa tệp ${file.name}`,
          ok: {
            noCaps: true,
            label: 'Đồng ý',
          },
          cancel: {
            flat: true,
            noCaps: true,
            label: 'Hủy',
          },
          persistent: true,
        })
          .onOk(async () => {
            await removeFile(authStore.uid, file.uid)
            await fetchUserById(authStore.uid)
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
      }
      onMounted(async () => {
        console.log(authStore.uid)
        await fetchUserById(authStore.uid)
        console.log(userDetail.value, 'aaaa')
      })
      return {
        mockData,
        authStore,
        pagination,
        userDetail,
        columns,
        clickEdit,
        Status,
        defaultAvatar,
        dialogAddNew,
        clickAddNew,
        onPickFile,
        files,
        filePicker,
        disableNext,
        clickNext,
        handleShareFile,
        activeFile,
        deactiveFile,
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
