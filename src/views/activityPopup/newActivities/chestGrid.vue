<template>
    <div class="space-y-4">
      <div
        v-for="(row, rowIndex) in groupedChests"
        :key="rowIndex"
        class="flex gap-4 justify-center"
      >
        <ChestNode
          v-for="chest in row"
          :key="chest.id"
          :label="chest.label"
          :direction="chest.direction"
          :reward="chest.reward"
          :isOpen="chest.isOpen"
          @click="handleChestClick(chest)"
        />
      </div>
    </div>
  </template>

<script setup lang="ts">
import ChestNode from './chestNode.vue';
import { computed } from 'vue';
const rowSize = 4;
const chests = [
  { id: 1, label: "1 pessoas", reward: "1000",isOpen: true },
  { id: 2, label: "2 pessoas", reward: "2000",isOpen: false  },
  { id: 3, label: "3 pessoas", reward: "3000",isOpen: false },
  { id: 4, label: "4 pessoas", reward: "4000",isOpen: false },
  { id: 5, label: "5 pessoas", reward: "5000",isOpen: false },
  { id: 6, label: "6 pessoas", reward: "6000",isOpen: false },
  { id: 7, label: "7 pessoas", reward: "7000",isOpen: false },
  { id: 8, label: "8 pessoas", reward: "8000",isOpen: false },
  { id: 9, label: "9 pessoas", reward: "9000",isOpen: false },
  { id: 10, label: "10 pessoas", reward: "10000",isOpen: false },
  { id: 11, label: "11 pessoas", reward: "11000",isOpen: false },
  { id: 12, label: "12 pessoas", reward: "12000",isOpen: false },
  
];

const chestsWithDirection = computed(() =>{
  const result = [];

  for (let i = 0; i < chests.length; i += rowSize) {
    const rowIndex = Math.floor(i / rowSize);
    const group = chests.slice(i, i + rowSize);

    // 奇数行（从视觉顺序来看，是第二、第四...行），需要 reverse
    if (rowIndex % 2 === 1) {
      result.push(...group.reverse());
    } else {
      result.push(...group);
    }
  }
  return  result.map((chest, index) => {
    const row = Math.floor(index / rowSize);
    const pos = index % rowSize;
    const isLast = index === chests.length - 1;

    let direction = '';
    if (!isLast) {
      const isEvenRow = row % 2 === 0;
      if (isEvenRow) {
        direction = pos === rowSize - 1 ? 'down' : 'right';
      } else {
        direction = pos === 0 ? 'down' : 'left';
      }
    }
    return {
      ...chest,
      direction,
    };
  })
}

);

const groupedChests = computed(() => {
  const result = [];
  const raw = chestsWithDirection.value;

  
  for (let i = 0; i < chestsWithDirection.value.length; i += rowSize) {
    result.push(chestsWithDirection.value.slice(i, i + rowSize));
  }
  return result;
});

function handleChestClick(chest) {
  console.log('点击了宝箱:', chest);
}


</script>

<style scoped lang="scss">

</style>