<template>
  <div class="refer-box">
    <div class="tab-box">
      <van-tabs v-model:active="selSearch" class="search-list-box" :swipeable="true" @change="getShareReferPage">
        <van-tab 
          title-class="search-list-item" 
          v-for="item in searchList" 
          :title="item.name" 
          :key="item.key"
          :name="item.key">
        </van-tab>
      </van-tabs>
    </div>

    <!-- 数据卡片区域 -->
    <div class="data-cards-section">

      <div class="section-title">{{ $t('f_direct_member_data') }}</div>
      <!-- 第一行卡片 -->
      <div class="cards-row">
        <div class="data-card">
          <div class="card-title">{{ $t('adicionar_membros_diretos') }}</div>
          <div class="card-value">{{ common.formatNum2Data(shareReferPage.addMemberCount) }}</div>
        </div>
        <div class="data-card">
          <div class="card-title">{{ $t('primeiros_depositos') }}</div>
          <div class="card-value">{{ common.formatNum2Data(shareReferPage.firstDepositCount) }}</div>
        </div>
        <div class="data-card">
          <div class="card-title">{{ $t('f_first_recharge') }}</div>
          <div class="card-value">{{ common.formatNum2Data(shareReferPage.firstRecharge) }}</div>
        </div>
      </div>

      <!-- 第二行卡片 -->
      <div class="cards-row">
        <div class="data-card">
          <div class="card-title">{{ $t('depositos') }}</div>
          <div class="card-value">{{ common.formatNum2Data(shareReferPage.depositCount) }}</div>
        </div>
        
        <div class="data-card">
          <div class="card-title">{{ $t('deposito') }}</div>
          <div class="card-value money">{{ common.formatNum2Data(shareReferPage.depositAmount) }}</div>
        </div>
        <div class="data-card">
          <div class="card-title">{{ $t('f_withdraw_count') }}</div>
          <div class="card-value">{{ common.formatNum2Data(shareReferPage.withdrawCount) }}</div>
        </div>
       
      </div>
      
      <!-- 第三行卡片 -->
      <div class="cards-row">
        <div class="data-card">
          <div class="card-title">{{ $t('f_withdraw_amount') }}</div>
          <div class="card-value">{{ common.formatNum2Data(shareReferPage.withdrawAmount) }}</div>
        </div>
        
        <div class="data-card">
          <div class="card-title">{{ $t('desempenho') }}</div>
          <div class="card-value money">{{ common.formatNum2Data(shareReferPage.validDama) }}</div>
        </div>
        <div class="data-card">
          <div class="card-title">{{ $t('comissao') }}</div>
          <div class="card-value money gold">{{ common.formatNum2Data(shareReferPage.commission) }}</div>
        </div>
      </div>

      <!-- 数据概览部分 -->
      <div class="section-title">{{ $t('visao_geral_dados') }}</div>

      <div class="data-overview-section">
        
        <!-- 团队数据 -->
        <div class="team-data">
          <div class="team-title">{{ $t('meu_time') }}</div>
          <div class="team-stats">
            <div class="stat-item">
              <div class="stat-label">{{ $t('membros') }}</div>
              <div class="stat-value">{{ common.formatNum2Data(shareReferPage.teamCount) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('membros_diretos') }}</div>
              <div class="stat-value">{{ common.formatNum2Data(shareReferPage.directMemberCount) }}</div>
            </div>
            <div class="stat-item" style="border-right: none;">
              <div class="stat-label">{{ $t('outros_membros') }}</div>
              <div class="stat-value">{{ common.formatNum2Data(shareReferPage.indirectMemberCount) }}</div>
            </div>
          </div>
        </div>
        
        <!-- 业绩数据 -->
        <div class="team-data">
          <div class="team-title">{{ $t('desempenho') }}</div>
          <div class="team-stats">
            <div class="stat-item " >
              <div class="stat-label">{{ $t('rendimento_total') }}</div>
              <div class="stat-value">{{ common.formatNum2Data(shareReferPage.totalRebate) }}</div>
            </div>
            <div class="stat-item" style="height: 65px;" >
              <div class="stat-label">{{ $t('d_direto') }}</div>
              <div class="stat-value">{{ common.formatNum2Data(shareReferPage.directRebate) }}</div>
            </div>
            <div class="stat-item" style="border-right: none; height: 65px;"  >
              <div class="stat-label">{{ $t('d_dos_outros') }}</div>
              <div class="stat-value">{{ common.formatNum2Data(shareReferPage.indirectRebate) }}</div>
            </div>
          </div>
        </div>
        
        <!-- 佣金数据 -->
        <div class="team-data">
          <div class="team-title">{{ $t('comissao') }}</div>
          <div class="team-stats" style="border-bottom: none;">
            <div class="stat-item">
              <div class="stat-label">{{ $t('comissoes_totais') }}</div>
              <div class="stat-value gold">{{ common.formatNum2Data(shareReferPage.rechargeTotalRebate) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ $t('comissao_direta') }}</div>
              <div class="stat-value gold">{{ common.formatNum2Data(shareReferPage.rechargeDirectRebate) }}</div>
            </div>
            <div class="stat-item" style="border-right: none;">
              <div class="stat-label">{{ $t('outra_comissao') }}</div>
              <div class="stat-value gold">{{ common.formatNum2Data(shareReferPage.rechargeIndirectRebate) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加底部边距 -->
    <div class="bottom-spacing"></div>

    <!-- 规则弹窗 -->
    <van-popup v-model:show="ruleShow" class="rule-popup">
      <div class="theme-popup-title-bg">
        <span>{{ $t("281035") }}</span>
        <svg-icon @click="ruleShow = false" name="close-pop" class="text-[18px] cursor-pointer" />
      </div>

      <div class="rule-content">
        {{ rulePopupText }}
      </div>

      <van-button @click="
        ruleShow = false;
      toMembers(0);
      " class="theme-button-default submit-btn theme-btn-submit-large">
        {{ $t("281048") }}
      </van-button>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, defineEmits } from "vue";
import common from "@/utils/common/common";
import { useI18n } from "vue-i18n";
import { shareReferPageApi } from "@/api/share";
import { agentInfoApi, AppAgentInfoVo, getAgentWeekRebateApi, receiveAgentWeekRebateApi, SearchTimeEnum } from '@/api/agent';

const { t } = useI18n();

const props = defineProps({
  isNewShare: {
    type: String
  }
});

const emit = defineEmits(["changeTab", "changeDepositSelectBox"]);

// 跳转member页，并携带跳转参数
const toMembers = index => {
  emit("changeTab", 2);
  emit("changeDepositSelectBox", index);
};

// 规则弹窗状态
const ruleShow = ref(false);

// 选中参数
const selSearch = ref(SearchTimeEnum.TODAY);
// 参数列表
const searchList = [

  {
    key: SearchTimeEnum.ALL,
    name: t("f_filter_all")
  },
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
  }
];

// refer页面数据
const shareReferPage = ref({
  addMemberCount: '0',
  firstDepositCount: '0',
  depositCount: '0',
  depositAmount: '0',
  validDama: '0',
  commission: '0',

  //新增
  firstRecharge: '0',
  withdrawCount: '0',
  withdrawAmount: '0',

  directMemberCount: '0',
  indirectMemberCount: '0',
  teamCount: '0',

  directRebate: '0',
  indirectRebate: '0',
  totalRebate: '0',

  rechargeDirectRebate: '0',
  rechargeIndirectRebate: '0',
  rechargeTotalRebate: '0',

});
// 获取refer页面数据
const getShareReferPage = async () => {
  let params = {
    day: selSearch.value
  }
  // if(selSearch.value == SearchTimeEnum.ALL){
  //   params.day = null;
  // }
  let { code, data }: any = await agentInfoApi(params);
  if (code == 200) {
    const { addMemberCount, firstDepositCount, depositCount, depositAmount, validDama, commission, firstRecharge, withdrawCount, withdrawAmount } = data.data.data;
    shareReferPage.value.addMemberCount = addMemberCount;
    shareReferPage.value.firstDepositCount = firstDepositCount;
    shareReferPage.value.depositCount = depositCount;
    shareReferPage.value.depositAmount = depositAmount;
    shareReferPage.value.validDama = validDama;
    shareReferPage.value.commission = commission;
    shareReferPage.value.firstRecharge = firstRecharge;
    shareReferPage.value.withdrawCount = withdrawCount;
    shareReferPage.value.withdrawAmount = withdrawAmount;

    const { directMemberCount, indirectMemberCount, teamCount } = data.data.team;
    shareReferPage.value.directMemberCount = directMemberCount;
    shareReferPage.value.indirectMemberCount = indirectMemberCount;
    shareReferPage.value.teamCount = teamCount;

    const { directRebate, indirectRebate, totalRebate } = data.data.damaRebateInfo;
    shareReferPage.value.directRebate = directRebate;
    shareReferPage.value.indirectRebate = indirectRebate;
    shareReferPage.value.totalRebate = totalRebate;

    const { directRebate: rechargeDirectRebate, indirectRebate: rechargeIndirectRebate, totalRebate: rechargeTotalRebate } = data.data.rechargeRebateInfo;
    shareReferPage.value.rechargeDirectRebate = rechargeDirectRebate;
    shareReferPage.value.rechargeIndirectRebate = rechargeIndirectRebate;
    shareReferPage.value.rechargeTotalRebate = rechargeTotalRebate;
    
  }
};



// 规则弹窗文案
const rulePopupText = ref("");
// invite页面数据

onMounted(async () => {
  // 获取refer页面数据
  getShareReferPage();

  // getAgentInfo();

});
</script>

<style lang="scss" scoped>
@import "./indexRefer.scss";


</style>
