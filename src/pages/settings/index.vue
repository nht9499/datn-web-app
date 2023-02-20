<template>
  <div>
    <div class="bg-white shadow-2 rounded-borders q-pa-md q-mt-md flex flex-center justify-between">
      <h1 class="text-h6 text-weight-medium q-mr-sm">Thiết lập hệ thống</h1>
    </div>
  </div>
  <q-card class="q-mt-md column">
    <q-form ref="settingForm" @submit="onSubmit">
      <q-splitter v-model="splitterModel" disable style="height: 450px">
        <template #before>
          <q-tabs
            @update:model-value="handleChangeTab"
            :model-value="tab"
            vertical
            inline-label
            indicator-color="transparent"
            active-bg-color="primary"
            active-color="white">
            <q-tab name="2c" icon="two_wheeler" no-caps label="Xe máy" class="justify-start" />
            <q-tab name="4c" icon="directions_car" no-caps label="Xe 4 chỗ" class="justify-start" />
            <q-tab
              name="7c"
              icon="airport_shuttle"
              no-caps
              label="Xe 7 chỗ"
              class="justify-start" />
            <!-- <q-tab
              name="additional"
              icon="post_add"
              no-caps
              label="Phụ phí"
              class="justify-start" /> -->
            <q-tab
              icon="local_shipping"
              name="light"
              no-caps
              label="Hàng hóa ≤ 5kg"
              class="justify-start" />
            <q-tab
              icon="local_shipping"
              name="medium"
              no-caps
              label="Hàng hóa ≤ 20kg"
              class="justify-start" />
            <q-tab
              icon="local_shipping"
              name="heavy"
              no-caps
              label="Hàng hóa ≤ 100kg"
              class="justify-start" />
            <q-tab icon="storefront" name="shop" no-caps label="Cửa hàng" class="justify-start" />
            <q-tab
              name="system"
              icon="settings_suggest"
              no-caps
              label="Hệ thống"
              class="justify-start" />
          </q-tabs>
        </template>

        <template #after>
          <q-tab-panels
            v-model="tab"
            animated
            vertical
            class="fit full-height"
            transition-prev="jump-up"
            transition-next="jump-up">
            <q-tab-panel
              name="2c"
              class="column"
              v-if="driver2cSetting.distanceFeeConfig.distanceSegmentFeeConfigList">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        driver2cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">đầu:</span>
                  </div>
                </div>
                <div class="col">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver2cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        driver2cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) + 1
                    }}
                    km:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver2cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="driver2cSetting.distanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel
              name="4c"
              class="column"
              v-if="driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList">
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg"> Phí vận chuyển</span>
                  <q-input
                    type="number"
                    :step="1"
                    suffix="km"
                    class="q-px-xs"
                    v-model="
                      driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                    "
                    outlined
                    style="width: 100px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                  <span class="q-pb-lg">đầu:</span>
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">tiếp theo:</span>
                  </div>
                </div>
                <div class="col items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) +
                      parseInt(
                        driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].kmsCount
                      ) +
                      1
                    }}
                    km trở đi:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver4cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[2].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="driver4cSetting.distanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>
            <q-tab-panel
              name="7c"
              class="column"
              v-if="driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList">
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg"> Phí vận chuyển</span>
                  <q-input
                    type="number"
                    :step="1"
                    suffix="km"
                    class="q-px-xs"
                    v-model="
                      driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                    "
                    outlined
                    style="width: 100px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                  <span class="q-pb-lg">đầu:</span>
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">tiếp theo:</span>
                  </div>
                </div>
                <div class="col items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) +
                      parseInt(
                        driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[1].kmsCount
                      ) +
                      1
                    }}
                    km trở đi:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      driver7cSetting.distanceFeeConfig.distanceSegmentFeeConfigList[2].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="driver7cSetting.distanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>
            <!-- <q-tab-panel name="additional" class="column">
              <div class="row q-gutter-md">
                <div class="col self-center text-right q-mt-none">Phí phụ thu hàng cồng kềnh:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="đ/km"
                    v-model="settings.attributeBulkyFeePerKm"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-gutter-md">
                <div class="col self-center text-right q-mt-none">
                  Phí phụ thu do chờ tại điểm dừng:
                </div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="đ/điểm"
                    v-model="settings.attributeLongWaitFeePerTrip"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel> -->

            <!-- Good weight config -->
            <q-tab-panel
              name="light"
              class="column"
              v-if="goodsWeightLight.distanceFeeConfig.distanceSegmentFeeConfigList">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        goodsWeightLight.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">đầu:</span>
                  </div>
                </div>
                <div class="col">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      goodsWeightLight.distanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        goodsWeightLight.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) + 1
                    }}
                    km:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      goodsWeightLight.distanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="goodsWeightLight.distanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel
              name="medium"
              class="column"
              v-if="goodsWeightMedium.distanceFeeConfig.distanceSegmentFeeConfigList">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        goodsWeightMedium.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">đầu:</span>
                  </div>
                </div>
                <div class="col">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      goodsWeightMedium.distanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        goodsWeightMedium.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) + 1
                    }}
                    km:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      goodsWeightMedium.distanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="goodsWeightMedium.distanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel
              name="heavy"
              class="column"
              v-if="goodsWeightHeavy.distanceFeeConfig.distanceSegmentFeeConfigList">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        goodsWeightHeavy.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">đầu:</span>
                  </div>
                </div>
                <div class="col">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      goodsWeightHeavy.distanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        goodsWeightHeavy.distanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) + 1
                    }}
                    km:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      goodsWeightHeavy.distanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="goodsWeightHeavy.distanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>
            <q-tab-panel name="shop" class="column">
              <div class="row q-col-gutter-md">
                <div class="col">
                  <div class="row justify-end items-center">
                    <span class="q-pb-lg"> Phí vận chuyển</span>
                    <q-input
                      type="number"
                      :step="1"
                      suffix="km"
                      class="q-px-xs"
                      v-model="
                        settings.shopDistanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      "
                      outlined
                      style="width: 100px"
                      :rules="emptyRules"
                      :min="0"
                      dense />
                    <span class="q-pb-lg">đầu:</span>
                  </div>
                </div>
                <div class="col">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      settings.shopDistanceFeeConfig.distanceSegmentFeeConfigList[0].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col row justify-end items-center">
                  <span class="q-pb-lg">
                    Phí vận chuyển từ
                    {{
                      parseInt(
                        settings.shopDistanceFeeConfig.distanceSegmentFeeConfigList[0].kmsCount
                      ) + 1
                    }}
                    km:</span
                  >
                </div>
                <div class="col row items-center">
                  <q-input
                    type="number"
                    suffix="đ"
                    v-model="
                      settings.shopDistanceFeeConfig.distanceSegmentFeeConfigList[1].feePerKm
                    "
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col self-center text-right q-pb-lg">Phần trăm phí dịch vụ:</div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="settings.shopDistanceFeeConfig.driverChargePerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>
            <q-tab-panel name="system" class="column">
              <div class="row q-gutter-md">
                <div class="col self-center text-right q-mt-none">
                  Phần trăm giảm giá người dùng Premium:
                </div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="%"
                    v-model="settings.premiumDiscountPerTripInPercent"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-gutter-md">
                <div class="col self-center text-right q-mt-none">
                  Bán kính tối đa nhận đơn hàng:
                </div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="m"
                    v-model="settings.maxRadiusOrdersQueryInMeters"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <div class="row q-gutter-md">
                <div class="col self-center text-right q-mt-none">
                  Tiền ký quỹ tối thiểu để hoạt động:
                </div>
                <div class="col">
                  <q-input
                    class="q-mb-sm"
                    type="number"
                    suffix="đ"
                    v-model="settings.minDriverDeposit"
                    outlined
                    style="width: 250px"
                    :rules="emptyRules"
                    :min="0"
                    dense />
                </div>
              </div>
              <q-space></q-space>
              <div class="row justify-center">
                <q-btn
                  icon="save"
                  type="submit"
                  label="Lưu thay đổi"
                  class="bg-gradient-primary text-white"></q-btn>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-form>
  </q-card>
</template>

<script lang="ts">
  import { useEnhancer } from 'src/app/enhancer'
  import { useFetchSettings } from 'src/hooks/useFetchSettings'
  // import hash from 'object-hash'
  import { computed, defineComponent, onMounted, ref } from 'vue'
  export default defineComponent({
    name: 'Settings',
    setup() {
      const { fetchSettings, settings, updateSettings } = useFetchSettings()
      const { showDialog, showGlobalLoading, showNotify, hideGlobalLoading } = useEnhancer()
      const settingForm = ref()
      const tab = ref('2c')
      const splitterModel = ref(15)
      let beforeSetting = {}
      onMounted(async () => {
        showGlobalLoading()
        await fetchSettings()
        beforeSetting = Object.assign(
          {},
          {
            driver2cSetting: driver2cSetting.value,
            driver4cSetting: driver4cSetting.value,
            driver7cSetting: driver7cSetting.value,
            setting: settings.value,
          }
        )
        console.log(beforeSetting)
        hideGlobalLoading()
      })
      const emptyRules = computed(() => [
        (val: number) =>
          (val && val >= 0) || val === 0 || 'Không được để trống và lớn hơn hoặc bằng 0 ',
      ])
      const emptyStringRules = computed(() => [
        (val: string) => (val && val.length > 0) || 'Không được để trống',
      ])

      const handleChangeTab = (value: string) => {
        // if (checkHasChange()) {
        //   handleUpdateSettings()
        // }
        tab.value = value
      }

      const checkHasChange = () => {
        // const beforeHash = hash(beforeSetting)
        // const afterSettings = Object.assign(
        //   {},
        //   {
        //     driver2cSetting: driver2cSetting.value,
        //     driver4cSetting: driver4cSetting.value,
        //     driver7cSetting: driver7cSetting.value,
        //     setting: settings.value,
        //   }
        // )
        // console.log(afterSettings)
        // const afterHash = hash(afterSettings)
        // return beforeHash !== afterHash
        return true
      }

      const onSubmit = () => {
        if (checkHasChange()) {
          handleUpdateSettings()
        } else {
          showNotify('Không có thay đổi')
        }
      }
      const initDriverTypeFee = {
        driverAccountType: '',
        distanceFeeConfig: {
          driverChargePerTripInPercent: 0,
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 0,
            },
            {
              kmsCount: 29,
              feePerKm: 0,
            },
            {
              kmsCount: null,
              feePerKm: 0,
            },
          ],
        },
      }

      const initGoodTypeFee = {
        goodsWeight: '',
        distanceFeeConfig: {
          driverChargePerTripInPercent: 0,
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 0,
            },
            {
              kmsCount: null,
              feePerKm: 0,
            },
          ],
        },
      }

      const driver2cSetting = computed(
        () =>
          settings.value.driverAccountTypeFeeConfigList?.find(
            (item) => item.driverAccountType === 'bike'
          ) ?? initDriverTypeFee
      )
      const driver4cSetting = computed(
        () =>
          settings.value.driverAccountTypeFeeConfigList?.find(
            (item) => item.driverAccountType === 'fourSeaterCar'
          ) ?? initDriverTypeFee
      )
      const driver7cSetting = computed(
        () =>
          settings.value.driverAccountTypeFeeConfigList?.find(
            (item) => item.driverAccountType === 'sevenSeaterCar'
          ) ?? initDriverTypeFee
      )

      const goodsWeightLight = computed(
        () =>
          settings.value.goodsWeightFeeConfigList?.find((item) => item.goodsWeight === 'light') ??
          initGoodTypeFee
      )
      const goodsWeightMedium = computed(
        () =>
          settings.value.goodsWeightFeeConfigList?.find((item) => item.goodsWeight === 'medium') ??
          initGoodTypeFee
      )
      const goodsWeightHeavy = computed(
        () =>
          settings.value.goodsWeightFeeConfigList?.find((item) => item.goodsWeight === 'heavy') ??
          initGoodTypeFee
      )

      const handleUpdateSettings = () => {
        showDialog({
          title: 'Xác nhận',
          message: `Thiết lập hệ thống có sự thay đổi. Bạn có lưu lại?`,
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
            settingForm.value.validate().then(async () => {
              const mapping = {
                bike: driver2cSetting.value,
                fourSeaterCar: driver4cSetting.value,
                sevenSeaterCar: driver7cSetting.value,
                light: goodsWeightLight.value,
                medium: goodsWeightMedium.value,
                heavy: goodsWeightHeavy.value,
              }
              const payload: Settings = {
                ...settings.value,
                driverAccountTypeFeeConfigList: settings.value.driverAccountTypeFeeConfigList.map(
                  (driverType) => {
                    const value = mapping[driverType.driverAccountType as DriverAccountType]
                    return {
                      ...driverType,
                      distanceFeeConfig: {
                        distanceSegmentFeeConfigList:
                          value.distanceFeeConfig.distanceSegmentFeeConfigList.map((km) => {
                            return {
                              kmsCount: !!km.kmsCount ? parseInt(km.kmsCount as string) : null,
                              feePerKm: parseInt(km.feePerKm as string),
                            }
                          }),
                        driverChargePerTripInPercent: parseInt(
                          value.distanceFeeConfig.driverChargePerTripInPercent as string
                        ),
                      },
                    }
                  }
                ),
                goodsWeightFeeConfigList: settings.value.goodsWeightFeeConfigList.map(
                  (goodType) => {
                    const value = mapping[goodType.goodsWeight as GoodWeightType]
                    return {
                      ...goodType,
                      distanceFeeConfig: {
                        distanceSegmentFeeConfigList:
                          value.distanceFeeConfig.distanceSegmentFeeConfigList.map((km) => {
                            return {
                              kmsCount: !!km.kmsCount ? parseInt(km.kmsCount as string) : null,
                              feePerKm: parseInt(km.feePerKm as string),
                            }
                          }),
                        driverChargePerTripInPercent: parseInt(
                          value.distanceFeeConfig.driverChargePerTripInPercent as string
                        ),
                      },
                    }
                  }
                ),
                // attributeBulkyFeePerKm: parseInt(settings.value.attributeBulkyFeePerKm as string),
                // attributeLongWaitFeePerTrip: parseInt(
                //   settings.value.attributeLongWaitFeePerTrip as string
                // ),
                premiumDiscountPerTripInPercent: parseInt(
                  settings.value.premiumDiscountPerTripInPercent as string
                ),
                // minOrderFee: parseInt(settings.value.minOrderFee as string),
                maxRadiusOrdersQueryInMeters: parseInt(
                  settings.value.maxRadiusOrdersQueryInMeters as string
                ),
                shopDistanceFeeConfig: {
                  distanceSegmentFeeConfigList:
                    settings.value.shopDistanceFeeConfig.distanceSegmentFeeConfigList.map((km) => {
                      return {
                        kmsCount: !!km.kmsCount ? parseInt(km.kmsCount as string) : null,
                        feePerKm: parseInt(km.feePerKm as string),
                      }
                    }),
                  driverChargePerTripInPercent: parseInt(
                    settings.value.shopDistanceFeeConfig.driverChargePerTripInPercent as string
                  ),
                },
                minDriverDeposit: parseInt(settings.value.minDriverDeposit as string),
              }
              try {
                showGlobalLoading()
                await updateSettings(payload)
                beforeSetting = Object.assign({}, settings.value)
                showNotify('Cập nhật thông tin thành công', 'positive')
              } catch (error) {
                showNotify('Có lỗi xảy ra', 'negative')
                console.log(error)
              } finally {
                hideGlobalLoading()
              }
            })
          })
          .onCancel(() => {
            settings.value = Object.assign({}, beforeSetting as any)
            // console.log('>>>> Cancel')
          })
      }
      return {
        settings,
        driver2cSetting,
        driver4cSetting,
        driver7cSetting,
        goodsWeightLight,
        goodsWeightMedium,
        goodsWeightHeavy,
        emptyRules,
        settingForm,
        onSubmit,
        emptyStringRules,
        tab,
        splitterModel,
        handleChangeTab,
      }
    },
  })
</script>

<style></style>
