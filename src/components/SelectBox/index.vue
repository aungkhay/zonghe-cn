<template>
  <div v-if="modelProps.list.length > 0" :class="{ 'select-box': modeType == 1, 'input-select-box': modeType == 2, 'select-box-custom': modeType == 3 }">
    <div class="select-content" @click="modelProps.isExpand = !modelProps.isExpand">
      <div class="flex items-end select-left" :class="{ 'flex-center': modeType == 3 }">
        <svg-icon v-if="svgShow"  :name="modelProps.list[modelProps.curIndex].svg" class="theme-svg-color-dark text-[20px] mr-[5px]"></svg-icon>
        <span class="text-[#555555] truncate block max-w-[70px]">{{ modelProps.list[modelProps.curIndex].name }}</span>
      </div>
      <svg-icon name="arrow_down" :class="{ 'rotate-180': modelProps.isExpand }" class="text-[#555555] ml-2 text-[20px]" />
    </div>
    <div class="select-list" v-show="modelProps.isExpand">
      <div v-for="(item, index) in modelProps.list" :key="index" class="select-item"
        :class="{ selected: modelProps.curIndex == index }" @click="change(index)">
        <svg-icon v-if="item.svg" :name="item.svg" :class="{ selected: modelProps.curIndex == index }"
          class="text-[20px] mr-[5px] ml-[5px] text-[var(--primary-color)]" />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="select-box">
import { SearchTimeEnum } from "@/api/agent";
import { time } from "console";
import { ref, onMounted, defineProps, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  model: {
    type: String,
    default: ""
  },
  modeType: {
    type: Number,
    default: 1
  },
  listType: {
    type: String,
    default: "date"
  },
  svgIcons: {
    type: Boolean,
    default: false
  },
  listArr: Array
});

const emit = defineEmits(["change"]);

// 定义变量
let modelProps = ref({
  isExpand: false,
  curIndex: 0,
  list: [],
});

const modeType = ref(props.modeType);
const listType = ref(props.listType);
const listArr = ref(props.listArr);
const model = ref(props.model);
const svgShow = ref(props.svgIcons)

const change = (index: number) => {
  modelProps.value.curIndex = index;
  modelProps.value.isExpand = false;
  emit(
    "change",
    modelProps.value.list[index].key,
    modelProps.value.list[index].name
  );
};

onMounted(() => {
  switch (listType.value) {
    case "date":
      modelProps.value.list = getDate();
      break;
    case "deposit":
      modelProps.value.list = getDeposit();
      break;
   
    default:
      modelProps.value.list = listArr.value;
      break;
  }

  for (let index in modelProps.value.list) {
    if (model.value == modelProps.value.list[index].key) {
      modelProps.value.curIndex = Number(index);
      break;
    }
  }
});

// 日期选择列表
const getDate = () => {
  return [
   
   
    {
      key: SearchTimeEnum.TODAY,
      name: t("107018")
    },
    {
      key: SearchTimeEnum.YESTERDAY,
      name: t("107019")
    },
    {
      key: SearchTimeEnum.WEEK,
      name: t("107020")
    },
    {
      key: SearchTimeEnum.LAST_WEEK,
      name: t("107021")
    },
    {
      key: SearchTimeEnum.MONTH,
      name: t("f_filter_this_month")
    },
    {
      key: SearchTimeEnum.LAST_MONTH,
      name: t("f_filter_last_month")
    },
    {
      key: SearchTimeEnum.ALL,
      name: t("f_filter_all")
    },
  ];
};

// Deposit选择列表
const getDeposit = () => {
  return [
    {
      key: "0",
      name: t("280042")
    },
    {
      key: "1",
      name: t("281052")
    },
    {
      key: "2",
      name: t("281053")
    },
    {
      key: "3",
      name: t("281055")
    }
  ];
};


// 暴露方法
defineExpose({
  change
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
