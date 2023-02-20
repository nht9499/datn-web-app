<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'

export default defineComponent({
  name: 'TheGalleries',
  props: {
    attachmentList: {
      type: Array as PropType<string[]>,
      required: true,
      default: () => [],
    },
    tooltip: {
      type: String,
      default: () => 'Phóng to',
    },
  },
  setup() {
    return {
      showPreview: ref(false),
      slide: ref(1),
    }
  },
})
</script>
<template>
  <div class="relative-position" v-if="attachmentList.length > 0">
    <q-btn
      class="absolute-top-left z-top"
      color="primary"
      size="9px"
      round
      icon="zoom_out_map"
      @click="showPreview = !showPreview">
      <q-tooltip> {{ tooltip }} </q-tooltip>
    </q-btn>
    <q-dialog v-model="showPreview">
      <q-card style="width: 700px; max-width: 80vw">
        <q-carousel animated arrows navigation v-model="slide" infinite>
          <q-carousel-slide
            v-for="(url, urlIndex) in attachmentList"
            :key="urlIndex"
            :name="urlIndex + 1"
            :img-src="url" />
        </q-carousel>
      </q-card>
    </q-dialog>
  </div>
</template>