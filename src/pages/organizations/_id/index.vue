<template>
  <!-- style="height: calc(100vh - 230px)" -->
  <div class="row q-gutter-md q-mt-md">
    <q-table
      title="Kho ngữ liệu của bạn"
      class="table-staff q-mt-md col"
      row-key="id"
      style="max-height: calc(100vh - 205px)"
      v-model:pagination="pagination"
      :rows="organizationDetail?.data"
      :columns="columns"
      separator="horizontal"
      no-data-label="Không có dữ liệu"
      hide-pagination
      binary-state-sort>
      <template #top>
        <div class="full-width flex justify-between">
          <div>
            <span class="q-table__title">Kho ngữ liệu của tổ chức</span>
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

      <!-- <template #body-cell-createdAt="props">
        <q-td :props="props">
          {{ $filters.dateFromNow(props.row.createdAt || null) }}
        </q-td>
      </template> -->

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
                  :disable="props.row.sharedToSystem"
                  dense
                  clickable
                  v-close-popup
                  @click="handleShareFile(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon size="xs" name="share" />
                  </q-item-section>
                  <q-item-section class="text-body2">Chia sẻ với hệ thống</q-item-section>
                </q-item>
                <q-item
                  :disable="props.row.sharedToSystem"
                  dense
                  clickable
                  v-close-popup
                  @click="activeFile(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon color="positive" size="xs" name="check_circle" />
                  </q-item-section>
                  <q-item-section class="text-body2">Kích hoạt tệp</q-item-section>
                </q-item>
                <q-item
                  :disable="props.row.sharedToSystem"
                  dense
                  clickable
                  v-close-popup
                  @click="deactiveFile(props.row)">
                  <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon color="negative" size="xs" name="delete" />
                  </q-item-section>
                  <q-item-section class="text-body2">Vô hiệu hóa tệp</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-table
      title="Danh sách thành viên"
      class="table-staff q-mt-md col"
      row-key="id"
      style="max-height: calc(100vh - 205px)"
      v-model:pagination="pagination"
      :rows="dataMember"
      :columns="columnsMember"
      separator="horizontal"
      no-data-label="Không có dữ liệu"
      hide-pagination
      binary-state-sort>
      <template #top>
        <div class="full-width flex justify-between">
          <div>
            <span class="q-table__title">Danh sách thành viên</span>
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
                <q-item disable dense clickable v-close-popup @click="handleShareFile(props.row)">
                  <!-- <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon size="xs" name="share" />
                  </q-item-section> -->
                  <q-item-section class="text-body2">Xóa thành viên</q-item-section>
                </q-item>
                <q-item disable dense clickable v-close-popup @click="activeFile(props.row)">
                  <!-- <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                    <q-icon color="positive" size="xs" name="check_circle" />
                  </q-item-section> -->
                  <q-item-section class="text-body2">Xóa quyền quản lý</q-item-section>
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
        <p class="text-h6 q-mb-md">Thêm các tệp mẫu vào kho ngữ liệu của tổ chức</p>
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
  import { defineComponent, ref, computed, watch, ComputedRef } from 'vue'
  import { QTableProps } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchDoctors } from '@/hooks/useFetchDoctors'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  import globalFilter from '@/helpers/filters'
  import { Status } from '@/constants/enums'
  import { useImage } from '@/hooks/useImage'
  import { useFetchOrganization } from '@/hooks/useFetchOrganization'

  export default defineComponent({
    name: 'OrganizationsDetail',
    components: {},
    setup() {
      const { loading, fetchDoctors, listDoctors, isLoadmore } = useFetchDoctors()
      const {
        route,
        router,
        authStore,
        showGlobalLoading,
        hideGlobalLoading,
        showNotify,
        showDialog,
      } = useEnhancer()
      const { fetchOrganizationById, organizationDetail, uploadFile, shareFile } =
        useFetchOrganization()
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
      const dataMember = ref()

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
        {
          name: 'shared',
          required: true,
          label: 'Chia sẻ với hệ thống',
          align: 'left',
          field: (row: AnyObject) => row?.sharedToSystem,
        },
        {
          name: 'createdAt',
          align: 'center',
          label: 'Ngày tạo',
          field: 'createdAt',
        },
        { name: 'actions', align: 'center', label: '', field: 'name' },
      ])
      const columnsMember: ComputedRef<QTableProps['columns']> = computed(() => [
        {
          name: 'uid',
          required: true,
          label: 'Uid',
          align: 'left',
          field: (row: AnyObject) => row.uid,
        },
        { name: 'actions', align: 'center', label: '', field: 'name' },
      ])

      const onLoadmore = () => {
        fetchDoctors(route.query, true)
      }

      const clickEdit = (row: AnyObject) => {
        console.log(listDoctors.value)
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
              return await uploadFile(route.params.id as string, payload)
            })
          )
          showNotify(`Thêm tệp mẫu mới thành công`, 'positive')
          await fetchOrganizationById(route.params.id as string)
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
            await shareFile(route.params.id as string, file)
            await fetchOrganizationById(route.params.id as string)
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
      const deactiveFile = (file: any) => {
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
          .onOk(() => {
            console.log('ok')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
      }
      watch(
        () => route.params,
        async (newParams) => {
          showGlobalLoading()
          const params = newParams
          await fetchOrganizationById(params.id as string)
          console.log(organizationDetail.value)
          const list = []
          organizationDetail?.value?.memberUidList?.map((member: any) => {
            list.push({
              uid: member,
            })
          })
          dataMember.value = list
          console.log(dataMember.value)
          hideGlobalLoading()
        },
        {
          immediate: true,
        }
      )
      return {
        mockData,
        authStore,
        pagination,
        listDoctors,
        columns,
        loading,
        isLoadmore,
        clickEdit,
        onLoadmore,
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
        organizationDetail,
        columnsMember,
        dataMember,
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
