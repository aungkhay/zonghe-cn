<template>
    <div class="vip-history-page">
        <div class="content">
            <div class="table-content">
                <div class="table-title-row">
                    <div class="table-title-cell">ID</div>
                    <div class="table-title-cell">{{ $t("104010") }}</div>
                    <div class="table-title-cell">{{ $t("valor_recebido") }}</div>
                    <div class="table-title-cell">{{ $t("tipo") }}</div>
                    <div class="table-title-cell">{{ $t("observação") }}</div>
                </div>

                <div class="table-row" v-for="(item, index) in records" :key="index">
                    <div class="table-cell">{{ item.id }}</div>
                    <div class="table-cell" style="position: relative;">
                        {{ item.level }}
                        <img :src="`${$imgBasePath}/newInfo/vip_logo.png`" style="height: 32px; position:absolute;transform: translateX(18px) translateY(-22px) ;z-index: -1;" />
                    </div>
                    <div class="table-cell">{{ common.formatNum2Data(item.amount) }}</div>
                    <div class="table-cell" v-if="item.type === 0">{{ $t("weekly_bonus") }}</div>
                    <div class="table-cell" v-if="item.type === 1">{{ $t("monthly_bonus") }}</div>
                    <div class="table-cell" v-if="item.type === 2">{{ $t("upgrade_bonus") }}</div>
                    <div class="table-cell">{{ item.remark }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="vipPlus">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { TVipRecordVo, vipHistoryApi } from '@/api/vip';
import common from "@/utils/common/common";

const { t } = useI18n();
const router = useRouter();

// 模拟数据，实际中应该通过API获取
const records = ref<TVipRecordVo[]>([]);

// 返回上一页
const goBack = () => {
    router.back();
};

// 实际应用中的数据获取
const fetchRecords = async () => {
    try {
        // 这里应该调用API获取数据
        const { code, data }:any = await vipHistoryApi();
        if (code === 200) {
            records.value = data.rows;

            //做一些模拟数据
            // records.value = [ {
            //     id: 1000,
            //     level: 1,
            //     amount: 1000,
            //     type: 1,
            //     remark: '模拟数据'
            // }]
        }
    } catch (error) {
        console.error('获取VIP历史记录失败:', error);
    }
};

onMounted(() => {
    fetchRecords();
});
</script>

<style lang="scss" scoped>
@import "./indexPlus.scss";

.vip-history-page {
    width: 100%;
    position: relative;
    padding-bottom: 100px;
}

.content {
    padding: 5px;
}

.table-content {
    margin-top: 15px;
    width: 355px;
    margin-left: auto;
    margin-right: auto;

    // background: var(--secondary-dark-color);
    border-radius: 6px;
    // padding: 8px;
}

.table-title-row {
    height: 40px;
    background: var(--secondary-color);
    // border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.table-title-cell {
    flex: 1;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #000;
}

.table-row {
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:nth-child(odd) {
        background: var(--secondary-color);
        // border-radius: 6px;
    }
    &:nth-child(even) {
        // background: $theme-bottom-bar-bg;
    }
}

.table-cell {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: $theme-text-color-dark;
}
</style>
