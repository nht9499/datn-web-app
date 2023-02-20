<template>
  <section class="q-pt-md q-pb-sm">
    <div class="q-px-md q-py-sm q-mb-sm bg-white rounded-borders shadow-1 flex justify-between">
      <div class="flex items-center">
        <q-btn
          color="primary"
          size="16px"
          dense
          flat
          round
          icon="keyboard_backspace"
          @click="backRouter" />
        <h2 class="text-h6 q-ml-md">Thông tin tài xế</h2>
      </div>
      <q-badge
        rounded
        class="q-px-sm q-py-xs"
        :color="$filters.getDriverStatusColor(driverDetail.status)">
        {{ $filters.getDriverStatusLabel(driverDetail.status) }}
      </q-badge>
    </div>
    <q-card>
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        inline-label
        align="left">
        <q-tab icon="info" name="info" label="Thông tin cá nhân" />
        <q-tab icon="badge" name="paper" label="Hình ảnh giấy tờ" />
        <q-tab icon="two_wheeler" name="vehicle" label="Thông tin phương tiện" />
        <q-tab icon="stars" name="rating" label="Đánh giá" />
        <q-tab
          v-if="isDeletionRequest"
          icon="person_remove"
          name="request"
          label="Yêu cầu xóa tài khoản" />
        <!-- <q-tab icon="lock_open" name="security" label="Bảo mật" /> -->
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info">
          <!-- <div v-if="authStore.isAccountant">
            <q-avatar :rounded="true" size="8rem">
              <q-img :src="!!driverDetail.photoUrl ? driverDetail.photoUrl : avatarDefault" />
            </q-avatar>
            <div class="col-12">
              {{driverDetail.name}}
            </div>
            <div class="col-12">
              {{driverDetail.birthday}}
            </div>
            <div class="col-12">
              {{driverDetail.}}
            </div>
            <div class="col-12">
              {{driverDetail.name}}
            </div>
          </div> -->

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-avatar v-if="authStore.isAccountant" size="8rem">
                <q-img :src="!!driverDetail.photoUrl ? driverDetail.photoUrl : avatarDefault" />
              </q-avatar>
              <file-picker
                v-else
                :img="driverDetail.photoUrl"
                :size="150"
                @on-avt-change="onAvtChange"></file-picker>
            </div>
            <div class="col-12">
              <q-input
                dense
                :readonly="authStore.isAccountant"
                outlined
                v-model="driverDetail.name"
                label="Họ và tên" />
            </div>
            <div class="col-4">
              <q-input
                fill-mask
                mask="##/##/####"
                stack-label
                dense
                outlined
                :readonly="authStore.isAccountant"
                v-model="driverDetail.birthday"
                label="Ngày sinh">
                <template v-if="!authStore.isAccountant" #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date fill-mask v-model="driverDetail.birthday" mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-4">
              <q-input
                dense
                :readonly="authStore.isAccountant"
                outlined
                v-model="driverDetail.personalId"
                label="CMND/CCCD" />
            </div>
            <div class="col-4 self-center">
              <span class="text-body2">Giới tính:</span>
              <span v-if="authStore.isAccountant" class="q-ml-sm">
                {{ $filters.getGenderLabel(driverDetail.gender) }}
              </span>
              <q-radio
                v-else
                v-for="opt in genderOptions"
                :key="opt"
                name="gender"
                v-model="driverDetail.gender"
                :readonly="authStore.isAccountant"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="opt"
                :label="$filters.getGenderLabel(opt)" />
            </div>
            <div class="col-6">
              <q-input
                fill-mask
                unmasked-value
                dense
                readonly
                outlined
                v-model="driverDetail.telephone"
                label="Số điện thoại" />
            </div>
            <div class="col-6">
              <q-input readonly dense outlined v-model="driverDetail.email" label="Email" />
            </div>

            <div class="col-12">
              <q-input
                type="textarea"
                autogrow
                :readonly="authStore.isAccountant"
                dense
                outlined
                v-model="driverDetail.address"
                label="Địa chỉ" />
            </div>
            <div class="col-12 text-center">
              <q-btn
                v-if="!authStore.isAccountant"
                size="md"
                text-color="white"
                icon="save"
                label="Lưu thay đổi"
                @click="handleSave"
                class="bg-gradient-primary" />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="paper">
          <div class="row q-col-gutter-sm">
            <div class="col-6">Mặt trước CMND/CCCD</div>
            <div class="col-6">Mặt sau CMND/CCCD</div>
            <div class="col-6 q-pt-xs">
              <file-picker
                :img="driverDetail.idCardFrontPhotoUrl ?? avatarDefault"
                :fit="'contain'"
                :horizontal="true"
                :size="150"
                @on-avt-change="onIdCardFrontChange"></file-picker>
            </div>
            <div class="col-6 q-pt-xs">
              <file-picker
                :img="driverDetail.idCardBackPhotoUrl ?? avatarDefault"
                :fit="'contain'"
                :horizontal="true"
                :size="150"
                @on-avt-change="onIdCardBackChange"></file-picker>
            </div>
            <div class="col-12 q-pt-md">
              <q-separator />
            </div>
            <div class="col-6">Mặt trước bằng lái xe</div>
            <div class="col-6">Mặt sau bằng lái xe</div>
            <div class="col-6 q-pt-xs">
              <file-picker
                :img="driverDetail.drivingLicenseCardFrontPhotoUrl ?? avatarDefault"
                :fit="'contain'"
                :horizontal="true"
                @on-avt-change="onDrivingLicenseFrontChange"></file-picker>
            </div>
            <div class="col-6 q-pt-xs">
              <file-picker
                :img="driverDetail.drivingLicenseCardBackPhotoUrl ?? avatarDefault"
                :fit="'contain'"
                :horizontal="true"
                @on-avt-change="onDrivingLicenseBackChange"></file-picker>
            </div>
            <div class="col-12 text-center">
              <q-btn
                v-if="!authStore.isAccountant"
                size="md"
                text-color="white"
                icon="save"
                label="Lưu thay đổi"
                @click="handleSave"
                class="bg-gradient-primary" />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="vehicle">
          <div class="row q-col-gutter-md">
            <div class="col-6">Hình biển số xe</div>
            <div class="col-6">
              Hình xe ({{ driverType[driverDetail.authInfo?.driverAccountType] }})
            </div>
            <div class="col-6 q-pt-xs">
              <file-picker
                :img="driverDetail.bikeNumberPlatePhotoUrl"
                :fit="'cover'"
                :size="150"
                @on-avt-change="onBikeNumberPlateChange"></file-picker>
            </div>
            <div class="col-6 q-pt-xs">
              <q-avatar v-if="authStore.isAccountant" size="8rem">
                <q-img
                  :src="!!driverDetail.bikePhotoUrl ? driverDetail.bikePhotoUrl : avatarDefault" />
              </q-avatar>
              <file-picker
                v-else
                :img="driverDetail.bikePhotoUrl"
                :fit="'cover'"
                :size="150"
                @on-avt-change="onBikeChange"></file-picker>
            </div>
            <div class="col-4">
              <q-input
                :readonly="authStore.isAccountant"
                dense
                outlined
                v-model="driverDetail.bikeNumber"
                label="Biển số xe" />
            </div>
            <div class="col-12">
              <q-btn
                v-if="driverDetail.status === DriverStatus.ACTIVE && !authStore.isAccountant"
                size="sm"
                text-color="white"
                color="negative"
                icon="warning"
                label="Ngưng hoạt động"
                @click="handleDeactive" />
              <q-btn
                v-if="
                  (driverDetail.status === DriverStatus.WAITING ||
                    driverDetail.status === DriverStatus.WAITING_TOO_LONG ||
                    driverDetail.status === DriverStatus.DEACTIVE ||
                    driverDetail.status === DriverStatus.DELETED) &&
                  !authStore.isAccountant
                "
                size="sm"
                text-color="white"
                color="positive"
                icon="check"
                label="Kích hoạt tài xế"
                @click="clickActive" />
            </div>
            <div class="col-12 text-center">
              <q-btn
                v-if="!authStore.isAccountant"
                size="md"
                text-color="white"
                icon="save"
                label="Lưu thay đổi"
                @click="handleSave"
                class="bg-gradient-primary" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="rating">
          <q-table
            class="table-staff"
            row-key="id"
            style="max-height: calc(100vh - 300px)"
            v-model:pagination="pagination"
            :rows="listRatings"
            :columns="columns"
            :loading="loading"
            separator="horizontal"
            no-data-label="Chưa có đánh giá nào về tài xế này"
            hide-pagination
            @request="onRequest"
            flat
            binary-state-sort>
            <!-- <template #top-row>
              <div class="text-h6">
                <q-icon color="primary" size="md" name="star" /> <span class="text-weight-bold q-mr-xs">{{ driverDetail.averageRating ?? 5 }}</span> ({{ driverDetail.totalReviewCount ?? 0 }})
              </div>
              <q-separator/>
            </template> -->
            <template #header-cell-rating="props">
              <q-th :props="props">
                <div>
                  <q-icon color="primary" size="sm" name="star" />
                  <span class="text-weight-bold q-mr-xs">{{
                    driverDetail.averageRating ?? 5
                  }}</span>
                  ({{ driverDetail.totalReviewCount ?? 0 }})
                </div>
              </q-th>
            </template>
            <template #body-cell-rating="props">
              <q-td :props="props" style="min-width: 170px">
                <q-rating v-model="props.row.rating" size="2em" color="primary" readonly />
              </q-td>
            </template>

            <template #body-cell-description="props">
              <q-td :props="props" style="white-space: break-spaces; min-width: 25vw">
                {{ props.row.description }}
              </q-td>
            </template>

            <template #body-cell-tag="props">
              <q-td :props="props" style="width: 200px">
                <q-avatar
                  size="lg"
                  class="bg-gradient-primary q-mx-xs"
                  text-color="white"
                  v-for="(tag, idx) in props.row.tagList"
                  :key="idx">
                  <!-- <q-chip class="bg-gradient-primary" text-color="white" v-for="(tag, idx) in props.row.tagList" :key="idx"> -->
                  <q-icon round size="sm" :name="$filters.getTagIcon(tag)" />
                  <q-tooltip>
                    {{ $filters.getTagLabel(tag) }}
                  </q-tooltip>
                  <!-- </q-chip> -->
                </q-avatar>
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ $filters.dateFormat(props.row.createdAt) }}
              </q-td>
            </template>

            <template #bottom v-if="isLoadmoreRating">
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
        </q-tab-panel>
        <q-tab-panel v-if="isDeletionRequest" name="request">
          <div class="row q-col-gutter-md justify-start">
            <div class="mb-xl">
              <div class="text-h6">Yêu cầu xóa tài khoản từ tài xế</div>
              <div v-if="driverDetail?.accountDeletionRequest?.reason">
                Tài xế đã đưa ra yêu cầu xóa tài khoản với lý do:
                {{ driverDetail.accountDeletionRequest.reason }}
              </div>
            </div>
            <div v-if="!authStore.isAccountant" class="col-12 text-center">
              <q-btn
                size="md"
                text-color="white"
                icon="close"
                label="Từ chối"
                @click="rejectRequest"
                class="bg-grey q-mr-lg" />
              <q-btn
                size="md"
                text-color="white"
                icon="check"
                label="Đồng ý"
                class="bg-green"
                @click="acceptRequest" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </section>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, reactive, toRefs, computed } from 'vue'
  import { date, useQuasar } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { DriverStatus, Gender } from '@/constants/enums'
  import { useFetchDrivers } from '@/hooks/useFetchDriver'
  import { testPattern } from 'src/util/pattern'
  import globalFilter from '@/helpers/filters'
  import FilePicker from '../components/FilePicker.vue'
  import avatarDefault from '@/assets/img/user.png'
  // import { driver } from '@/constants/define'
  export default defineComponent({
    name: 'DriverList',
    components: {
      FilePicker,
    },
    setup() {
      const { route, router, showNotify, authStore } = useEnhancer()
      const $q = useQuasar()
      const {
        loading,
        fetchDriverById,
        updateDriver,
        deleteDriver,
        updateStatus,
        fetchRatings,
        listRatings,
        driverDetail,
        isDeletionRequest,
        isLoadmoreRating,
      } = useFetchDrivers()
      const tab = ref('info')
      const state = reactive({
        photoUrl: null,
        bikePhotoUrl: null,
        bikeNumberPlatePhotoUrl: null,
        idCardFrontPhotoUrl: null,
        idCardBackPhotoUrl: null,
        drivingLicenseCardFrontPhotoUrl: null,
        drivingLicenseCardBackPhotoUrl: null,
        // tempList: [{
        //   id: 'a',
        //   createdAt: 12122,
        //   rating: 4.3,
        //   tagList: ['fastDelivery', 'wellPacked', 'polite', 'friendly'],
        //   description: 'asdasdas'
        // }]
      })
      const columns: ComputedRef<QTableProps['columns']> = computed(() => [
        {
          name: 'rating',
          required: true,
          align: 'left',
          field: 'rating',
          headerStyle: 'font-size: 1.2rem',
        },
        {
          name: 'tag',
          align: 'center',
          label: 'Thẻ đánh giá',
          field: 'tagList',
          headerStyle: 'font-size: 15px',
        },
        {
          name: 'description',
          align: 'center',
          label: 'Nội dung',
          field: 'description',
          headerStyle: 'font-size: 15px',
        },
        {
          name: 'createdAt',
          align: 'center',
          label: 'Ngày tạo',
          field: 'createdAt',
          headerStyle: 'font-size: 15px',
        },
        // {
        //   name: 'updatedAt',
        //   align: 'center',
        //   label: 'Chỉnh sửa gần đây',
        //   field: 'updatedAt',
        //   sortOrder: 'ad',
        // },
        // { name: 'actions', align: 'center', label: '', field: 'name' },
      ])
      watch(
        () => route.params,
        (params) => {
          fetchDriverById(params.id as string)
          fetchRatings(route.query, params.id)
        },
        {
          immediate: true,
        }
      )

      watch(driverDetail, (driver) => {
        driver.birthday = globalFilter.dateFormat(driver.birthday, 'DD/MM/YYYY')
      })

      watch(isDeletionRequest, (value) => {
        value && (tab.value = 'request')
      })

      const onLoadmore = () => {
        fetchRatings(route.query, route.params.id, true)
      }

      const backRouter = () => {
        router.back()
      }
      const onAvtChange = (url: string) => {
        console.log('onAvtChange', url)
        driverDetail.value.photoUrl = url
      }
      const onBikeChange = (url: string) => {
        driverDetail.value.bikePhotoUrl = url
      }
      const onBikeNumberPlateChange = (url: string) => {
        driverDetail.value.bikeNumberPlatePhotoUrl = url
      }
      const onIdCardFrontChange = (url: string) => {
        driverDetail.value.idCardFrontPhotoUrl = url
      }
      const onIdCardBackChange = (url: string) => {
        driverDetail.value.idCardBackPhotoUrl = url
      }
      const onDrivingLicenseFrontChange = (url: string) => {
        driverDetail.value.drivingLicenseCardFrontPhotoUrl = url
      }
      const onDrivingLicenseBackChange = (url: string) => {
        driverDetail.value.drivingLicenseCardBackPhotoUrl = url
      }
      const handleSave = async () => {
        // let validate = true
        // ;(Object.keys(driverDetail.value) as (keyof typeof driverDetail.value)[]).forEach((key) => {
        //   if (!driverDetail.value[key]) return (validate = false)
        // })
        // if (!validate) return showNotify(`Vui lòng điền toàn bộ thông tin và hình ảnh`, 'negative')
        if (!validateBirthday(driverDetail.value.birthday as string))
          return showNotify(`Vui lòng nhập ngày sinh chính xác`, 'negative')
        // if (!validateEmail(driverDetail.value.email))
        //   return showNotify(`Vui lòng nhập địa chỉ email chính xác`, 'negative')
        // if (!validateTelephone(driverDetail.value.telephone))
        //   return showNotify(`Vui lòng nhập số điện thoại chính xác`, 'negative')
        $q.dialog({
          title: 'Xác nhận',
          message: `Bạn có chắc muốn cập nhật thông tin tài xế ?`,
          cancel: {
            flat: true,
            color: 'black',
            label: 'Không',
          },
          ok: {
            flat: true,
            color: 'primary',
            label: 'Cập nhật',
          },
        }).onOk(() => onSave())
      }

      const onSave = async () => {
        const payload: any = {
          ...driverDetail.value,
          driverAuthInfo: driverDetail.value.authInfo,
          nameAsArray: globalFilter.nameToArray(
            globalFilter.removeAccents(driverDetail.value.name)
          ),
          birthday: date.extractDate(driverDetail.value.birthday as string, 'DD/MM/YYYY'),
        }
        delete payload.createdAt
        console.log(payload)
        await updateDriver(payload)
        // backRouter()
      }

      // const validateEmail = (email: string) => {
      //   return email.match(
      //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      //   )
      // }

      // const validateTelephone = (telephone: string) => {
      //   return telephone.length === 10
      // }

      const validateBirthday = (birthday: string) => {
        const today = globalFilter.dateFormat(new Date(), 'DD/MM/YYYY')
        const validYearold = date.extractDate(
          today.slice(0, 6) + (new Date().getFullYear() - 16),
          'DD/MM/YYYY'
        )
        const passDate =
          date.extractDate(driverDetail.value.birthday as string, 'DD/MM/YYYY') < validYearold
        return testPattern.dateFormat(birthday) && passDate
      }

      const handleDeactive = () => {
        $q.dialog({
          title: 'Cảnh báo chuyển trạng thái',
          message: `Chuyển trạng thái sang Ngưng hoạt động sẽ vô hiệu hóa tài xế này. Bạn có chắc chứ ?`,
          cancel: {
            flat: true,
            color: 'black',
            label: 'Không',
          },
          ok: {
            flat: true,
            color: 'negative',
            label: 'Có',
          },
        }).onOk(() => deactive())
      }

      const deactive = async () => {
        const payload = {
          driverAuthInfo: driverDetail.value.authInfo,
          newStatus: DriverStatus.DEACTIVE,
        }
        await updateStatus(payload)
        backRouter()
      }

      const clickActive = () => {
        $q.dialog({
          style: 'width: 500px',
          html: true,
          title: 'Kích hoạt tài xế',
          message: `Bạn có chắc muốn kích hoạt tài xế: <b>${driverDetail.value.name}</b> ?`,
          cancel: {
            flat: true,
            color: 'black',
            label: 'Không',
          },
          ok: {
            flat: true,
            color: 'primary',
            label: 'Kích hoạt',
          },
        }).onOk(() => handleActive())
      }
      const handleActive = async () => {
        const payload = {
          driverAuthInfo: driverDetail.value.authInfo,
          newStatus: DriverStatus.ACTIVE,
        }
        await updateStatus(payload)
        backRouter()
      }

      const handleDelete = async () => {
        const payload = {
          driverAuthInfo: driverDetail.value.authInfo,
        }
        await deleteDriver(payload)
        backRouter()
      }

      const rejectRequest = () => {
        console.log('reject')
        handleActive()
      }

      const acceptRequest = () => {
        console.log('accept')
        handleDelete()
      }

      return {
        ...toRefs(state),
        tab,
        statusOptions: [DriverStatus.ACTIVE, DriverStatus.DEACTIVE],
        genderOptions: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
        loading,
        driverDetail,
        authStore,
        DriverStatus: {
          WAITING: DriverStatus.WAITING,
          WAITING_TOO_LONG: DriverStatus.WAITING_TOO_LONG,
          ACTIVE: DriverStatus.ACTIVE,
          DEACTIVE: DriverStatus.DEACTIVE,
          DELETION_REQUESTED: DriverStatus.DELETION_REQUESTED,
          DELETED: DriverStatus.DELETED,
        },
        columns,
        listRatings,
        isLoadmoreRating,
        onLoadmore,
        handleSave,
        onAvtChange,
        onBikeChange,
        backRouter,
        handleDeactive,
        clickActive,
        avatarDefault,
        isDeletionRequest,
        rejectRequest,
        acceptRequest,
        onBikeNumberPlateChange,
        onIdCardFrontChange,
        onIdCardBackChange,
        onDrivingLicenseFrontChange,
        onDrivingLicenseBackChange,
        driverType: {
          bike: 'Xe máy',
          fourSeaterCar: 'Xe 4 chỗ',
          sevenSeaterCar: 'Xe 7 chỗ',
        },
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
