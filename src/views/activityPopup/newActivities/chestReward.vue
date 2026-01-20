<template>
  <div class="main-box">
    <div class="box-bg">
      <div class="h-[4px]"></div>
      <IndexQR :isNotShowTitle="true" class="mt-[20px] mb-[20px]" />
      <div class="box-title">
        <span>{{ t("must_fixed_all_condition_below") }} </span>
      </div>
      <div class="box-content">
        <span>{{ t("next_level_need_recharge") }} </span>
        <span class="light-text">R${{ conditionValue }} </span>
      </div>
    </div>
    <div class="h-[10px]"></div>
    <div class="box-bg">
      <div class="space-y-4">
        <div v-for="(row, rowIndex) in groupedChests" :key="rowIndex" class="flex gap-4"
          :class="row.length === 4 ? 'justify-center' : (rowIndex % 2 === 0 ? 'justify-start' : 'justify-end')">
          <ChestNode v-scaleTap v-for="chest in row" :key="chest.id" :label="chest.label" :direction="chest.direction"
            :reward="chest.reward" :isOpen="chest.isOpen" @click="handleChestClick(chest)" />
        </div>
      </div>
    </div>
    <div class="descript">
      <div class="descript-title">{{ t("activity_descript") }} </div>
      <div class="descript-content">{{ t("chest_reward_descript_content") }} </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getGlobalSetting, getInviteGraduateList, receiveInviteGraduateReward } from '@/api/activityPopup';
import { ActiveBoxConfigVo, ActiveBoxDataVo } from '@/model/activityEnum';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IndexQR from '@/views/agent/components/indexQR.vue';
const { t } = useI18n();
import ChestNode from './chestNode.vue';
import { showTipModel } from '@/components/TipModel';
import common from '@/utils/common/common';
const realData = ref([] as ActiveBoxDataVo)
const conditionValue = ref<number>(0);
const receiveList = ref([] as number[])

const getConfig = async () => {
  const { code, data } = await getGlobalSetting<ActiveBoxConfigVo>({ name: "ACTIVE_BOX" });
  console.log(data);
  if (code == 200) {
    realData.value = data.data;
    conditionValue.value = data.data.conditionValue;
  }
}

const amount = ref<number>(0);
const getReward = async () => {
  const { code, data } = await getInviteGraduateList();
  console.log(data);
  if (code == 200) {
    receiveList.value = data.data.receiveList || [];
    amount.value = data.data.amount || 0;
  }
}
onMounted(() => {
  getConfig();
  getReward();
})


const rowSize = 4;
const chestsWithDirection = computed(() => {
  const result = [];

  if (!(realData && realData.value.data && realData.value.data.length > 0)) {
    return result;
  }
  const chests = []
  const receiveValueList = receiveList.value.map(item => parseInt(item.toString()));
  for (let i = 0; i < realData.value.data.length; i++) {
    let isOpen = 0;

    if (receiveValueList.includes(realData.value.data[i].count)) {
      isOpen = 2;
    } else if (amount.value >= realData.value.data[i].count) {
      isOpen = 1;
    }
    chests.push({
      id: i,
      label: realData.value.data[i].count + t("person"),
      reward: realData.value.data[i].reward,
      isOpen: isOpen
    })

  }
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


  return result.map((chest, index) => {
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
  for (let i = 0; i < chestsWithDirection.value.length; i += rowSize) {
    result.push(chestsWithDirection.value.slice(i, i + rowSize));
  }
  return result;
});

let isClicking = false;
async function handleChestClick(chest) {
  console.log('点击了宝箱:', chest);
  if (isClicking) return;
  isClicking = true;

  if (chest.isOpen != 1) {
    isClicking = false;
    return;
  }
  let count = realData.value.data[chest.id].count;
  const { code, data } = await receiveInviteGraduateReward({ receiveList: [count] });
  console.log(data);
  if (code == 200) {
    showTipModel({
      type: 4,
      title: t("receive_success", [common.formatNum(data.data.receiveAmount) || 0]),
      icon: "success",
      success: () => {
        getReward();
      }
    });
  }
  isClicking = false;
}

</script>

<style lang="scss" scoped>
.main-box {
  width: $max-width;
  position: relative;
  padding-bottom: 100px;

  .box-bg {

    margin-left: 8px;
    margin-right: 8px;
    background: var(--secondary-color);
    border-radius: 8px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;


    .box-title {
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-weight: 500;
        font-size: 12px;
        color: var(--primary-color);
      }
    }

    .box-content {
      position: relative;
      width: 320px;
      height: 32px;
      background: var(--primary-color);
      border-radius: 4px 4px 4px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      span {
        font-weight: 500;
        font-size: 11px;
        color: var(--text-white);
      }

      .light-text {
        margin-left: 5px;
        font-weight: bold;
        font-size: 12px;
        color: white;
      }

    }


  }

  .descript {
    margin-top: 15px;
    padding-left: 20px;
    padding-right: 20px;

    margin-left: 10px;
    margin-right: 10px;
    background: var(--secondary-color);
    border-radius: 6px;
    padding: 8px;

    .descript-title {
      font-weight: 500;
      font-size: 16px;
      font-weight: bold;
      color: var(--primary-color);
    }

    .descript-content {
      padding-top: 5px;
      font-weight: 500;
      font-size: 12px;
      color: var(--content-description);
    }
  }
}
</style>
