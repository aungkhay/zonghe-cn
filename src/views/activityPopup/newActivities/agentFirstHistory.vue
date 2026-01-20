<template>
    <div class="all-data-container">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <div class="search-input">
                <input type="text" :placeholder="$t('f_search_member_id')" v-model="searchId"
                    @keyup.enter="getMemberData()">
                <svg-icon v-scaleTap class="theme-svg-color-dark text-[14px] relative right-[30px]" name="search" @click="getMemberData()" />
            </div>
            <div class="select-box ml-[10px]">
                <SelectBox @change="changeAgentType" listType="agentType" :listArr="modelProps.agentTypeList" :model=null>
                </SelectBox>
            </div>
        </div>

        <!-- 会员列表 -->
        <div class="table-content">
            <div class="table-title-row">
                <div class="table-title-cell">{{ $t('106003') }}</div>
                <div class="table-title-cell">{{ $t('f_first_deposit_amount') }}</div>
                <div class="table-title-cell">{{ $t('f_register_time') }}</div>
            </div>

            <div class="table-row" v-for="(item, index) in memberList" :key="index">
                <div class="table-cell">
                    <div class="member-id-section">
                        <div class="member-id">{{ item.id }} <svg-icon v-scaleTap class="theme-svg-color-dark text-[14px]" name="copy" @click="copyLink(item.id)" /></div>
                    </div>
                </div>
                <div class="table-cell">
                    <div class="data-value pink">{{ common.formatNum2Data(item.firstRecharge) }}</div>
                </div>
                <div class="table-cell">
                    <div class="member-date">{{ item.date }}</div>
                </div>
            </div>
        </div>

        <!-- 底部分页 -->
        <div class="footer">
            <div class="pagination-box">
                <!-- 跳到首页 -->
                <van-icon @click="changePage(1)" name="arrow-double-left" class="pagination-first" />
                <van-pagination v-model="page.pageNum" :total-items="page.total" :items-per-page="page.pageSize"
                    :show-page-size="4" @change="changePage">
                    <template #prev-text>
                        <van-icon name="arrow-left" />
                    </template>
                    <template #next-text>
                        <van-icon name="arrow" />
                    </template>
                </van-pagination>
                <!-- 跳到尾页 -->
                <van-icon @click="changePage(Math.ceil(page.total / page.pageSize))" name="arrow-double-right"
                    class="pagination-last" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { agentAllDataApi, agentFirstHistoryApi, SearchTimeEnum } from '@/api/agent';
import { showTipModel } from '@/components/TipModel';
import { useI18n } from "vue-i18n";
import common from "@/utils/common/common";

// 搜索ID
const searchId = ref();
const loading = ref(false);

interface ModelProps {
    agentType: number | null;
    agentTypeList: { key: number; name: string }[];
}

// 定义变量
const { t } = useI18n();

const getAgentType = () => {
    return [
        {
            key: 2,
            name: t("f_activity_agent_first_history_level_0")
        },
        {
            key: 1,
            name: t("f_activity_agent_first_history_level_1")
        },
        {
            key: 0,
            name: t("f_activity_agent_first_history_level_2")
        }
    ];
};

let modelProps = ref<ModelProps>({
    agentType: null,
    agentTypeList: getAgentType()
});

// 分页
const page = ref({
    total: 150, // 示例总数，实际应从API获取
    pageSize: 15,
    pageNum: 1
});

// 会员列表数据
const memberList = ref<any[]>([]);



const changeAgentType = (type: number) => {
    modelProps.value.agentType = type;
    getMemberData();
};

// 复制邀请链接
const copyLink = (id: string) => {
    navigator.clipboard.writeText(id)
        .then(() => {
            // 显示复制成功提示
            // 使用 showTipModel 显示复制成功提示
            // @ts-ignore
            if (typeof showTipModel === 'function') {
                showTipModel({
                    type: 1,
                    icon: "success",
                    title: t("f_copy_member_id")
                });
            }
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};

// 切换页面
const changePage = (currentPage) => {
    page.value.pageNum = currentPage;
    getMemberData();
};

// 获取会员数据
const getMemberData = async () => {
    try {
        loading.value = true;

        const { code, data }: any = await agentFirstHistoryApi({
            userId: (searchId.value ? searchId.value : null),
            pageSize: page.value.pageSize,
            pageNum: page.value.pageNum,
            valid: (modelProps.value.agentType!=2 ? modelProps.value.agentType : null),
        });

        loading.value = false;

        if (code === 200 && data) {

         
            // 正式集成时处理API返回的数据
            const newData = data.rows?.map(item => ({
                id: item.userId,
                date: item.createTime? item.createTime.split(' ')[0] : '',
                firstRecharge: item.firstRecharge,
            })) || [];

            memberList.value = newData;

            // 更新总记录数
            const apiData = data as any;
            if (apiData.total !== undefined) {
                page.value.total = apiData.total;
            } else if (apiData.count !== undefined) {
                page.value.total = apiData.count;
            }
        } else {
            loading.value = false;
        }
    } catch (error) {
        loading.value = false;
        console.error('Failed to fetch member data:', error);
    }
};

onMounted(() => {
    getMemberData();
});
</script>

<style lang="scss" scoped>
.all-data-container {
    padding: 10px 10px 140px 10px;
    position: relative;
    min-height: calc(100vh - 140px);
}

.search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;

    .search-input {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;

        input {
            width: 168px;
            height: 30px;
            @extend .theme-allData-search-bg;
            border: none;
            padding: 0 40px 0 15px;
            color: white;
            font-size: 13px;
            

            &::placeholder {
                color: $theme-text-color-placeholder;
            }
        }
    }
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .member-id-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .item-level {
            background: #FFA400;
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 12px;
            color: #fff;
            margin-bottom: 5px;
        }

        .member-id {
            display: flex;
            align-items: center;
            color: $theme-text-color-dark;
            font-size: 12px;
            margin-bottom: 3px;

            .copy-icon {
                margin-left: 4px;
                width: 12px;
                height: 12px;
                cursor: pointer;
            }
        }
    }

    .data-value {
        font-size: 12px;

        &.pink {
            color: $theme-text-color-dark;
        }
    }

    .member-date {
        color: $theme-text-color-dark;
        font-size: 12px;
    }
}

.footer {
    //水平居中
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    bottom: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: $max-width;
    height: 50px;

    .pagination-box {
        position: relative;

        $cancel-bg : transparent;
        $submit-bg : transparent;
        --pa-width: 25px;
        --pa-height: 25px;
        --pa-font-size: 12px;
        --pa-space: 10px;

        .pagination-first,
        .pagination-last {
            position: absolute;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: var(--pa-width);
            height: var(--pa-height);
            font-size: var(--pa-font-size);
            color: $theme-text-color-dark;
            border-radius: 50%;
            background: $cancel-bg;
            background-size: 100% 100%;
            cursor: pointer;
        }

        .pagination-first {
            left: calc(-1 * (var(--pa-width) + var(--pa-space)));
        }

        .pagination-last {
            right: calc(-1 * (var(--pa-width) + var(--pa-space)));
        }

        --van-pagination-item-width : var(--pa-width);
        --van-pagination-height : var(--pa-height);
        --van-pagination-font-size : var(--pa-font-size);
        --van-pagination-disabled-opacity: 1;

        :deep(.van-pagination__item) {
            display: flex;
            justify-content: center;
            align-items: center;
            color: $theme-text-color-dark;
            background: $cancel-bg;
            background-size: 100% 100%;
            border-radius: 50%;

            &:not(:last-child) {
                margin-right: var(--pa-space);
            }
        }

        :deep(.van-pagination__item--active) {
            color: $theme-text-color-bright;
            background: $submit-bg;
            background-size: 100% 100%;
        }

        :deep(.van-pagination__item--prev),
        :deep(.van-pagination__item--next) {
            color: $theme-text-color-dark;
        }

        :deep(.van-hairline--surround):after {
            border-width: 0;
        }
    }
}
</style>