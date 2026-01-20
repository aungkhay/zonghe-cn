<template>
    <div class="vip-history-page">
        <div class="content">
            <div class="table-content" v-if="records.length > 0">
                <div class="table-title-row">
                    <div class="table-title-cell">{{ $t("agent_history_create_time") }}</div>
                    <div class="table-title-cell">{{ $t("agent_history_amount") }}</div>
                </div>

                <div class="table-row" v-for="(item, index) in records" :key="index">
                    <div class="table-cell">{{ item.createTime }}</div>
                    <div class="table-cell">{{ common.formatNum(item.amount) }}</div>
                </div>
            </div>
            <NoData v-else />

            <div class="footer">
                <div class="pagination-box">
                    <van-icon
                        @click="changePage(1)"
                        name="arrow-double-left"
                        class="pagination-first"
                    />
                    <van-pagination
                        v-model="page.pageNum"
                        :total-items="page.total"
                        :items-per-page="page.pageSize"
                        :show-page-size="4"
                        @change="changePage"
                    >
                        <template #prev-text>
                            <van-icon name="arrow-left" />
                        </template>
                        <template #next-text>
                            <van-icon name="arrow" />
                        </template>
                    </van-pagination>
                    <van-icon
                        @click="changePage(Math.ceil(page.total / page.pageSize))"
                        name="arrow-double-right"
                        class="pagination-last"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="agentHistoryPage">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AppAgentWeekRebateVo, getAgentWeekRebateListApi, SearchTimeEnum } from '@/api/agent';
import NoData from "@/components/NoData/index.vue";
import common from "@/utils/common/common";

const { t } = useI18n();
const router = useRouter();

const modelProps = ref({
    day: SearchTimeEnum.TODAY,
    type: 0,
    platformList: [
        {
            key: null,
            name: "Platform"
        },
        {
            key: "1",
            name: t("106032")
        },
        {
            key: "2",
            name: t("106033")
        },
        {
            key: "3",
            name: t("106071")
        },
        {
            key: "4",
            name: t("106072")
        },
        {
            key: "5",
            name: "EVO"
        },
        {
            key: "14",
            name: "SSR"
        },
        {
            key: "15",
            name: "SPRIBE"
        }
    ]
});

const page = ref({
    total: 0,
    pageSize: 100,
    pageNum: 1
});

const records = ref<AppAgentWeekRebateVo[]>([]);

const goBack = () => {
    router.back();
};

const changeDateTime = (type: SearchTimeEnum) => {
    modelProps.value.day = type;
    page.value.pageNum = 1;
    fetchRecords();
};

const changePlatform = (type: string) => {
    modelProps.value.type = Number(type);
    page.value.pageNum = 1;
    fetchRecords();
};

const changePage = (pageNum: number) => {
    page.value.pageNum = pageNum;
    fetchRecords();
};

const fetchRecords = async () => {
    try {
        const { pageSize, pageNum } = page.value;
        // const { day, type } = modelProps.value;

        let params: any = {
            pageSize: pageSize,
            pageNum: pageNum
        };
        
        const { code, data }: any = await getAgentWeekRebateListApi(params);
        
        if (code === 200) {
            if (data.rows && data.rows.length > 0) {
                data.rows.map(item => {
                    item.createTime = item.createTime.split(" ")[0];
                });
                
                records.value = data.rows;
                page.value.total = data.total || 0;
            } else {
                records.value = [];
                page.value.total = 0;
            }
        } else {
            records.value = [];
            page.value.total = 0;
        }
    } catch (error) {
        console.error('获取历史记录失败:', error);
        records.value = [];
        page.value.total = 0;
    }
};

onMounted(() => {
    fetchRecords();
});
</script>

<style lang="scss" scoped>
@import "./index.scss";

.vip-history-page {
    width: 100%;
    min-height: 100vh;
    position: relative;
}

.content {
    padding: 5px;
}

.table-content {
    margin-top: 15px;
    width: 355px;
    margin-left: auto;
    margin-right: auto;

    background: $theme-nav-top-bg;
    border-radius: 6px;
    padding: 8px;
}

.table-title-row {
    height: 40px;
    background: $theme-table-title-bg;
    border-radius: 6px;
    border: 1px solid $theme-nav-top-border-color;
    display: flex;
    flex-direction: row;
    align-items: center;
    
    .table-title-cell {
        flex: 1;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        color: white;
    }
}

.table-row {
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    
    &:nth-child(odd) {
        background: $theme-table-odd-bg;
        border-radius: 6px;
    }
    
    &:nth-child(even) {
        background: $theme-table-even-bg;
    }
    
    .table-cell {
        flex: 1;
        text-align: center;
        font-weight: 500;
        font-size: 14px;
        color: $theme-text-color-dark;
    }
}

.footer {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 400px;
    height: 50px;
}

.pagination-box {
    position: relative;
}

.pagination-box .pagination-first,
.pagination-box .pagination-last {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    font-size: 12px;
    color: $theme-text-color-dark;
    border-radius: 50%;
    background: transparent;
    background-size: 100% 100%;
    cursor: pointer;
}

.pagination-box .pagination-first {
    left: -35px;
}

.pagination-box .pagination-last {
    right: -35px;
}

.pagination-box :deep(.van-pagination__item) {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $theme-text-color-dark;
    background: transparent;
    background-size: 100% 100%;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    font-size: 12px;
}

.pagination-box :deep(.van-pagination__item:not(:last-child)) {
    margin-right: 10px;
}

.pagination-box :deep(.van-pagination__item--active) {
    color: $theme-text-color-bright;
    background: transparent;
    background-size: 100% 100%;
}

.pagination-box :deep(.van-pagination__item--prev),
.pagination-box :deep(.van-pagination__item--next) {
    color: $theme-text-color-dark;
}

.pagination-box :deep(.van-hairline--surround):after {
    border-width: 0;
}
</style>
