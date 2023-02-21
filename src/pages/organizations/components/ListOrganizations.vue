<template>
  <!-- style="height: calc(100vh - 230px)" -->
  <div>
    <q-card>
      <q-table
        v-if="userDetail?.organizationList?.length > 0"
        class="table-staff"
        row-key="id"
        style="max-height: calc(100vh - 205px)"
        v-model:pagination="pagination"
        :rows="userDetail.organizationList"
        :columns="columns"
        separator="horizontal"
        no-data-label="Không có dữ liệu"
        hide-pagination
        binary-state-sort>
        <template #top>
          <div class="full-width flex justify-between">
            <div>
              <span class="q-table__title">Các tổ chức bạn tham gia</span>
            </div>
            <q-btn outline rounded color="primary" label="Thêm mới" icon="add">
              <q-menu>
                <q-list style="min-width: 180px">
                  <q-item dense clickable v-close-popup @click="dialogJoin = true">
                    <q-item-section class="text-body2">Tham gia tổ chức</q-item-section>
                  </q-item>
                  <q-item dense clickable v-close-popup @click="dialogAddNew = true">
                    <q-item-section class="text-body2">Tạo tổ chức mới</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              rounded
              class="q-px-sm q-py-xs"
              :color="$filters.getDoctorStatusColor(props.row.status)">
              {{ $filters.getDoctorStatus(props.row.status) }}
            </q-badge>
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
                  <q-item
                    :disable="!props.row.isAdmin"
                    dense
                    clickable
                    v-close-popup
                    @click="clickEdit(props.row)">
                    <q-item-section avatar style="min-width: 12px" class="q-pr-sm">
                      <q-icon size="xs" name="edit" />
                    </q-item-section>
                    <q-item-section class="text-body2">Quản lý tổ chức</q-item-section>
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
      <q-card-section v-else class="row">
        <q-card-section class="col">
          <span
            >Bạn chưa tham gia tổ chức nào, hãy cung cấp ID của bạn cho quản lý của tổ chức</span
          >
          <div style="width: 300px">
            <q-input readonly v-model="uidDisplay" label="ID của bạn" />
          </div>
        </q-card-section>
        <span class="bg-white" style="height: 25px; position: relative; left: 15px; top: 50px"
          >hoặc</span
        >
        <q-separator vertical />
        <q-card-section style="width: 100%" class="flex flex-center justify-center col">
          <q-btn
            @click="clickAddNew"
            rounded
            no-caps
            outline
            color="primary"
            label="Tạo tổ chức mới" />
        </q-card-section>
        <span class="bg-white" style="height: 25px; position: relative; left: 15px; top: 50px"
          >hoặc</span
        >
        <q-separator vertical />
        <q-card-section style="width: 100%" class="flex flex-center justify-center col">
          <q-btn
            @click="dialogJoin"
            rounded
            no-caps
            outline
            color="primary"
            label="Tham gia tổ chức" />
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
  <q-dialog v-model="dialogAddNew">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <span class="text-bold">Thông tin tổ chức</span>
        <div class="q-mt-sm">
          <q-input v-model="organizationName" label="Tên tổ chức (*)" />
        </div>
        <div>
          <q-input v-model="organizationTelephone" label="Số điện thoại" />
        </div>
        <div>
          <q-input v-model="organizationEmail" label="Email" />
        </div>
      </q-card-section>
      <div class="q-pl-md q-mt-md">
        <q-btn
          no-caps
          @click="clickCreate"
          :disable="!organizationName"
          color="primary"
          label="Tạo mới" />
      </div>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialogJoin">
    <q-card class="q-pa-md">
      <q-card-section>
        Nhập ID của tổ chức để tham gia
        <q-input v-model="organizationId" label="ID tổ chức" />
      </q-card-section>
      <q-card-action class="q-pl-md">
        <q-btn
          no-caps
          @click="clickJoin"
          :disable="!organizationId"
          color="primary"
          label="Tham gia" />
      </q-card-action>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, watch, ComputedRef, onMounted } from 'vue'
  import { QTableProps } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { useFetchDoctors } from '@/hooks/useFetchDoctors'
  import { useFetchUser } from '@/hooks/useFetchUser'
  import { useFetchOrganization } from '@/hooks/useFetchOrganization'
  import defaultAvatar from '@/assets/img/default_avatar.png'
  // import globalFilter from '@/helpers/filters'
  import { Status } from '@/constants/enums'

  export default defineComponent({
    name: 'ListOrganizations',
    components: {},
    setup() {
      const { loading, fetchDoctors, listDoctors, isLoadmore } = useFetchDoctors()
      const { joinOrganization, fetchUserById, userDetail } = useFetchUser()
      const { createOrg } = useFetchOrganization()
      const { route, router, authStore, showGlobalLoading, hideGlobalLoading } = useEnhancer()
      const pagination = ref({
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      })

      const dialogAddNew = ref(false)
      const organizationId = ref(null)
      const organizationName = ref(null)
      const organizationTelephone = ref(null)
      const organizationEmail = ref(null)
      const dialogJoin = ref(false)
      const uidDisplay = ref()

      const columns: ComputedRef<QTableProps['columns']> = computed(() => [
        {
          name: 'fullName',
          required: true,
          label: 'Tên tổ chức',
          align: 'center',
          field: (row: AnyObject) => row?.name,
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'center',
          field: (row: AnyObject) => row?.email,
        },
        {
          name: 'phoneNumber',
          required: true,
          label: 'Số điện thoại',
          align: 'center',
          field: (row: AnyObject) => row?.phoneNumber,
        },
        {
          name: 'status',
          required: true,
          label: 'Trạng thái',
          align: 'center',
          field: (row: AnyObject) => row?.status,
        },
        // {
        //   name: 'createdAt',
        //   align: 'center',
        //   label: 'Ngày thực hiện',
        //   field: 'createdAt',
        // },
        { name: 'actions', align: 'center', label: '', field: 'name' },
      ])

      const onLoadmore = () => {
        fetchDoctors(route.query, true)
      }

      const clickEdit = (row: AnyObject) => {
        router.push({ name: 'organizations-id', params: { id: row.uid } })
      }
      const clickAddNew = () => {
        dialogAddNew.value = true
      }
      const clickJoin = async () => {
        if (!organizationId.value) return
        showGlobalLoading()
        await joinOrganization(organizationId.value)
        dialogJoin.value = false
        await fetchUserById(authStore.uid)
        hideGlobalLoading()
      }
      const clickCreate = async () => {
        showGlobalLoading()
        const payload: any = {
          fullName: organizationName.value,
        }
        if (organizationEmail.value) payload.email = organizationEmail.value
        if (organizationTelephone.value) payload.phoneNumber = organizationTelephone.value
        await createOrg(payload)
        dialogAddNew.value = false
        await fetchUserById(authStore.uid)
        hideGlobalLoading()
      }
      onMounted(async () => {
        showGlobalLoading()
        await fetchUserById(authStore.uid)
        uidDisplay.value = userDetail.value.uid
        hideGlobalLoading()
      })
      // watch(
      //   () => route.query,
      //   async (newParams) => {
      //     showGlobalLoading()
      //     const params = newParams
      //     await fetchDoctors(params)
      //     hideGlobalLoading()
      //   },
      //   {
      //     immediate: true,
      //   }
      // )
      return {
        uidDisplay,
        authStore,
        pagination,
        listDoctors,
        columns,
        loading,
        isLoadmore,
        clickEdit,
        clickJoin,
        onLoadmore,
        Status,
        defaultAvatar,
        clickAddNew,
        dialogAddNew,
        dialogJoin,
        organizationId,
        organizationName,
        userDetail,
        clickCreate,
        organizationTelephone,
        organizationEmail,
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
