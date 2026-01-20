<template>
  <div v-scaleTap class="game-item">
    <van-image
      @click="$emit('toGamePage', gameItem.key, 'all', 'Slots', $t('105031'))"
      :src="$imgBasePath + gameItem.bgImg"
      fit="cover"
      class="game-item-img"
    >
      <template v-slot:loading>
        <div class="game-loading"></div>
      </template>
    </van-image>

    <!-- <div class="game-item-bottom">
      <img :src="$imgBasePath + gameItem.icon" />
      <span>{{ `${gameItem.name} Slots` }}</span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  item: {
    type: Object,
    default: ""
  }
});

const gameItem = ref(props.item);

const emit = defineEmits(["toGamePage"]);
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
