<template>
    <div class="all-data-container">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <div class="search-input">
                <input type="text" :placeholder="$t('f_search_member')" v-model="searchId"
                    @keyup.enter="getMemberData()">
                <svg-icon v-scaleTap class="text-[var(--secondary-color)] text-[14px] relative right-[30px]" name="search" @click="getMemberData()" />
            </div>
            <!-- <img v-scaleTap :src="$imgBasePath + '/agent/filter.png'" class="filter-icon" width="26" height="26"
                @click="toggleFilterMenu" /> -->
            <svg-icon v-scaleTap class="text-[var(--primary-color)] text-[26px]" name="filter" @click="toggleFilterMenu" />
        </div>

        <!-- 过滤菜单 -->
        <div class="filter-menu-mask" v-if="showFilterMenu" @click="toggleFilterMenu"></div>
        <div class="filter-menu" v-if="showFilterMenu" @dragstart.prevent>
            <!-- 时间选择部分 -->
            <div class="filter-section">
                <div class="filter-title">{{ $t('f_filter_time') }}</div>
                <div class="filter-subtitle">{{ $t('f_filter_predefined_time') }}</div>
                <div class="filter-options">
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.ALL }"
                        @click="selectTime(SearchTimeEnum.ALL)">{{ $t('f_filter_all') }}</div>
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.YESTERDAY }"
                        @click="selectTime(SearchTimeEnum.YESTERDAY)">{{ $t('f_filter_yesterday') }}</div>
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.TODAY }"
                        @click="selectTime(SearchTimeEnum.TODAY)">{{ $t('f_filter_today') }}</div>
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.WEEK }"
                        @click="selectTime(SearchTimeEnum.WEEK)">{{ $t('f_filter_this_week') }}</div>
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.LAST_WEEK }"
                        @click="selectTime(SearchTimeEnum.LAST_WEEK)">{{ $t('f_filter_last_week') }}</div>
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.MONTH }"
                        @click="selectTime(SearchTimeEnum.MONTH)">{{ $t('f_filter_this_month') }}</div>
                    <div class="filter-option" :class="{ active: timeFilter === SearchTimeEnum.LAST_MONTH }"
                        @click="selectTime(SearchTimeEnum.LAST_MONTH)">{{ $t('f_filter_last_month') }}</div>
                </div>

                <div class="filter-subtitle">{{ $t('f_filter_custom_time') }}</div>
                <div class="date-range">
                    <div class="date-input" @click="showDatePicker('start')"
                        :class="{ 'selected': startDate !== '' && startDate !== null }">{{ startDate ||
                            $t('f_filter_start_date') }}</div>
                    <div class="date-separator">-</div>
                    <div class="date-input" @click="showDatePicker('end')"
                        :class="{ 'selected': endDate !== '' && endDate !== null }">{{ endDate || $t('f_filter_end_date') }}
                    </div>
                </div>

                <!-- 日期选择器 -->
                <div class="date-picker-mask" v-if="showDatePickerModal">
                    <div class="date-picker" v-if="showDatePickerModal" @click.stop
                        :class="{ 'start-picker': currentPickerType === 'start', 'end-picker': currentPickerType === 'end' }">
                        <div class="date-picker-columns">
                            <!-- 年份选择 -->
                            <div class="picker-column">
                                <div class="picker-column-content"
                                    :style="{ transform: `translateY(${yearTranslateY}px)` }">
                                    <div class="picker-item" 
                                        :class="{ scrolling: isScrolling.year }"
                                        v-for="year in yearOptions" :key="year"
                                        @click="selectYear(year)" @touchstart="handleTouchStart($event, 'year')"
                                        @touchmove="handleTouchMove($event, 'year')" @touchend="handleTouchEnd('year')">
                                        <span :class="{ active: selectedYear === year }">{{ year }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 月份选择 -->
                            <div class="picker-column">
                                <div class="picker-column-content"
                                    :style="{ transform: `translateY(${monthTranslateY}px)` }">
                                    <div class="picker-item" 
                                        :class="{ scrolling: isScrolling.month }"
                                        v-for="month in 12" :key="month"
                                        @click="selectMonth(month)" @touchstart="handleTouchStart($event, 'month')"
                                        @touchmove="handleTouchMove($event, 'month')"
                                        @touchend="handleTouchEnd('month')">
                                        <span :class="{ active: selectedMonth === month }">{{
                                            month.toString().padStart(2, '0') }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 日期选择 -->
                            <div class="picker-column">
                                <div class="picker-column-content"
                                    :style="{ transform: `translateY(${dayTranslateY}px)` }">
                                    <div class="picker-item" 
                                        :class="{ scrolling: isScrolling.day }"
                                        v-for="day in getDaysInMonth(selectedYear, selectedMonth)"
                                        :key="day" @click="selectDay(day)" @touchstart="handleTouchStart($event, 'day')"
                                        @touchmove="handleTouchMove($event, 'day')" @touchend="handleTouchEnd('day')">
                                        <span :class="{ active: selectedDay === day }">{{ day.toString().padStart(2,
                                            '0') }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pickered-line"></div>
                        </div>

                        <!-- 确认按钮 -->
                        <div class="date-picker-confirm" @click="confirmDatePicker">
                            {{ $t('f_filter_date_confirm') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- VIP级别选择部分 -->
            <div class="filter-section">
                <div class="filter-title">{{ $t('f_filter_level') }}</div>
                <div class="filter-options level-options">
                    <div class="filter-option" :class="{ active: levelFilter === 'null' }" @click="selectLevel('null')">
                        {{ $t('f_filter_select_all') }}</div>
                    <div class="filter-option" :class="{ active: levelFilter === 'V0' }" @click="selectLevel('V0')">V1
                    </div>
                    <div class="filter-option" :class="{ active: levelFilter === 'V1' }" @click="selectLevel('V1')">V2
                    </div>
                    <div class="filter-option" :class="{ active: levelFilter === 'V2' }" @click="selectLevel('V2')">V3
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="filter-actions">
                <div class="action-button filter-btn" @click="applyFilter">{{ $t('f_filter_button') }}</div>
                <div class="action-button reset-btn" @click="resetFilter">{{ $t('f_reset_button') }}</div>
            </div>
        </div>

        <!-- 会员列表 -->
        <div class="members-list">
            <div class="member-item" v-for="(item, index) in memberList" :key="index">
                <div class="item-level">
                    <span class="top-tip"
                        >
                        {{getDisplayNum(item.level)}}
                    </span>
                </div>
                <div class="member-info">
                    <div class="member-id">{{ item.id }} <svg-icon v-scaleTap class="theme-svg-color-dark text-[14px]" name="copy" @click="copyLink(item.id)" /></div>
                    <div class="member-date">{{ item.date }}</div>
                </div>
                <div class="member-data">
                    <div class="data-row">
                        <span class="data-label">{{ $t('activity_first_recharge') }}</span>
                        <span class="data-value pink">{{ common.formatNum2Data(item.firstRecharge) }}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">{{ $t('f_activity_second_recharge') }}</span>
                        <span class="data-value pink">{{ common.formatNum2Data(item.totalDeposit) }}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">{{ $t('f_valid_bets') }}</span>
                        <span class="data-value pink">{{ common.formatNum2Data(item.validBets) }}</span>
                    </div>
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

        <!-- 悬浮按钮 -->
        <div class="float-btn" @click="getSummaryData">
            <div class="btn-inner">
                <svg-icon class="theme-svg-color-light text-[16px]" name="summary" />
                <span>{{ $t('f_summarize') }}</span>
            </div>
        </div>

        <!-- 汇总数据弹窗 -->
        <div class="summary-modal-mask" v-if="showSummaryModal" @click="closeSummaryModal">
            <div class="summary-modal" :class="{ 'show': showSummaryModal }" @click.stop>
                <!-- 关闭按钮 -->
                <div class="summary-close" @click="closeSummaryModal">
                    <svg-icon class="theme-svg-color-light text-[20px]" name="arrow_down" />
                </div>
                
                <!-- 标题 -->
                <!-- <div class="summary-title">
                    <span>{{ $t('f_summary_title') || '汇总数据' }}</span>
                </div> -->

                <!-- 数据展示区域 -->
                <div class="summary-content">
                    <!-- 第一行数据 -->
                    <div class="summary-col">
                        <div class="summary-item">
                            <div class="summary-label">{{ $t('activity_first_recharge') || 'Recarga direta' }}</div>
                            <div class="summary-value">{{ common.formatNum2Data(summaryData.firstRecharge) || '0' }}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">{{ $t('f_activity_second_recharge') || 'Primeira recarga direta' }}</div>
                            <div class="summary-value">{{ common.formatNum2Data(summaryData.rechargeAmount) || '0' }}</div>
                        </div>
                    </div>

                    <!-- 第二行数据 -->
                    <div class="summary-col">
                        <div class="summary-item">
                            <div class="summary-label">{{ $t('f_total_players') || 'Outro depósito' }}</div>
                            <div class="summary-value">{{ common.formatNum2Data(summaryData.rechargeCount) || '0' }}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">{{ $t('f_valid_bets') || 'Outro recargas iniciais' }}</div>
                            <div class="summary-value">{{ common.formatNum2Data(summaryData.totalDama) || '0' }}</div>
                        </div>
                    </div>

                   
                   
                </div>

               
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { agentAllDataApi, agentSummaryDataApi, SearchTimeEnum } from '@/api/agent';
import { showTipModel } from '@/components/TipModel';
import { useI18n } from "vue-i18n";
import common from "@/utils/common/common";
import FirstRecharge from '@/views/activityPopup/newActivities/firstRecharge.vue';
// 搜索ID
const searchId = ref('');
const level = ref('null');
const loading = ref(false);

// 分页
const page = ref({
    total: 150, // 示例总数，实际应从API获取
    pageSize: 15,
    pageNum: 1
});

// 过滤菜单状态
const showFilterMenu = ref(false);
const timeFilter:any = ref(SearchTimeEnum.ALL);
const levelFilter = ref('null');

// 日期选择器相关
const showDatePickerModal = ref(false);
const currentPickerType = ref('start'); // 'start' 或 'end'
const startDate = ref('');
const endDate = ref('');

// 日期选择器滚动状态
const yearTranslateY = ref(0);
const monthTranslateY = ref(0);
const dayTranslateY = ref(0);
const itemHeight = 30; // 每个选项的高度
const visibleItems = 5; // 可见选项数量
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedDay = ref(new Date().getDate());
const startTouchY = ref(0);
const currentTranslateY = ref({
    year: 0,
    month: 0,
    day: 0
});

// 添加滚动状态跟踪
const isScrolling = ref({
    year: false,
    month: false,
    day: false
});
const scrollStartTime = ref(0);
const minScrollDistance = 5; // 最小滚动距离阈值

// 年份选项（2020-2030）
const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);

const { t } = useI18n();

// 会员列表数据
const memberList = ref<any[]>([
    // {
    //     level: 'V0',
    //     id: '965766120',
    //     date: '2025-04-01 11:03',
    //     totalDeposit: '1000',
    //     validBets: '100000'
    // },
    // {
    //     level: 'V1',
    //     id: '965766121',
    //     date: '2025-04-02 11:03',
    //     totalDeposit: '2000',
    //     validBets: '200000'
    // },
    // {
    //     level: 'V2',
    //     id: '965766122',
    //     date: '2025-04-03 11:03',
    //     totalDeposit: '3000',
    //     validBets: '300000'
    // },
    // {
    //     level: 'V3',
    //     id: '965766123',
    //     date: '2025-04-04 11:03',
    //     totalDeposit: '4000',
    //     validBets: '400000'
    // },
    // {
    //     level: 'V4',
    //     id: '965766124',
    //     date: '2025-04-05 11:03',
    //     totalDeposit: '5000',
    //     validBets: '500000'
    // },
    // {
    //     level: 'V5',
    //     id: '965766125',
    //     date: '2025-04-06 11:03',
    //     totalDeposit: '6000',
    //     validBets: '600000'
    // },
    // {
    //     level: 'V6',
    //     id: '965766126',
    //     date: '2025-04-07 11:03',
    //     totalDeposit: '7000',
    //     validBets: '700000'
    // },
    // {
    //     level: 'V7',
    //     id: '965766127',
    //     date: '2025-04-08 11:03',
    //     totalDeposit: '8000',
    //     validBets: '800000'
    // },
    // {
    //     level: 'V8',
    //     id: '965766128',
    //     date: '2025-04-09 11:03',
    //     totalDeposit: '9000',
    //     validBets: '900000'
    // },
    // {
    //     level: 'V9',
    //     id: '965766129',
    //     date: '2025-04-10 11:03',
    //     totalDeposit: '10000',
    //     validBets: '1000000'
    // },
    // {
    //     level: 'V10',
    //     id: '965766130',
    //     date: '2025-04-11 11:03',
    //     totalDeposit: '11000',
    //     validBets: '1100000'
    // },
    // {
    //     level: 'V11',
    //     id: '965766131',
    //     date: '2025-04-12 11:03',
    //     totalDeposit: '12000',
    //     validBets: '1200000'
    // },
    // {
    //     level: 'V12',
    //     id: '965766132',
    //     date: '2025-04-13 11:03',
    //     totalDeposit: '13000',
    //     validBets: '1300000'
    // },
    // {
    //     level: 'V13',
    //     id: '965766133',
    //     date: '2025-04-14 11:03',
    //     totalDeposit: '14000',
    //     validBets: '1400000'
    // },
    // {
    //     level: 'V14',
    //     id: '965766134',
    //     date: '2025-04-15 11:03',
    //     totalDeposit: '15000',
    //     validBets: '1500000'
    // }

]);

// 汇总数据弹窗相关
const showSummaryModal = ref(false);
const summaryExpanded = ref(false);
const summaryData = ref({
    firstRecharge:0,
    rechargeAmount:0,
    rechargeCount:0,
    totalDama:0,
});

// 切换过滤菜单显示状态
const toggleFilterMenu = () => {
    showFilterMenu.value = !showFilterMenu.value;
};

// 显示日期选择器
const showDatePicker = (type: 'start' | 'end') => {
    currentPickerType.value = type;
    showDatePickerModal.value = true;

    // 重置选择器位置
    const currentDate = type === 'start' && startDate.value
        ? new Date(startDate.value)
        : type === 'end' && endDate.value
            ? new Date(endDate.value)
            : new Date();

    selectedYear.value = currentDate.getFullYear();
    selectedMonth.value = currentDate.getMonth() + 1;
    selectedDay.value = currentDate.getDate();

    // 计算初始位置
    resetPickerPosition();
};

const getDisplayNum=(num)=>{
    //提取V1中的1,并+1
    const match = num.match(/V(\d+)/);
    if (match) {
        return "V"+(parseInt(match[1]) + 1);
    }
    return "V1";
}
// 关闭日期选择器
const closeDatePicker = () => {
    showDatePickerModal.value = false;
};

// 确认日期选择
const confirmDatePicker = () => {
    const formattedDate = `${selectedYear.value}-${selectedMonth.value.toString().padStart(2, '0')}-${selectedDay.value.toString().padStart(2, '0')}`;

    if (currentPickerType.value === 'start') {
        startDate.value = formattedDate;
    } else {
        endDate.value = formattedDate;
    }
    //timeFilter置空
    timeFilter.value = '';

    closeDatePicker();
};

// 选择年份
const selectYear = (year: number) => {
    // 如果正在滚动，忽略点击事件
    if (isScrolling.value.year) {
        return;
    }
    
    selectedYear.value = year;
    resetPickerPosition();
};

// 选择月份
const selectMonth = (month: number) => {
    // 如果正在滚动，忽略点击事件
    if (isScrolling.value.month) {
        return;
    }
    
    selectedMonth.value = month;

    // 检查日期是否有效
    const daysInMonth = getDaysInMonth(selectedYear.value, selectedMonth.value);
    if (selectedDay.value > daysInMonth) {
        selectedDay.value = daysInMonth;
    }

    resetPickerPosition();
};

// 选择日期
const selectDay = (day: number) => {
    // 如果正在滚动，忽略点击事件
    if (isScrolling.value.day) {
        return;
    }
    
    selectedDay.value = day;
    resetPickerPosition();
};

// 获取月份天数
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

// 重置选择器位置
const resetPickerPosition = () => {
    const yearIndex = yearOptions.indexOf(selectedYear.value);
    yearTranslateY.value = -yearIndex * itemHeight;

    monthTranslateY.value = -(selectedMonth.value - 1) * itemHeight;
    dayTranslateY.value = -(selectedDay.value - 1) * itemHeight;
};

// 选择时间过滤器
const selectTime = (time: any) => {
    timeFilter.value = time;
    // 重置日期选择器
    startDate.value = '';
    endDate.value = '';
};

// 选择级别过滤器
const selectLevel = (level: string) => {
    levelFilter.value = level;
};

// 应用过滤器
const applyFilter = () => {
    // 应用过滤逻辑
    // 在实际应用中，这里会调用API获取过滤后的数据
    page.value.pageNum = 1; // 重置为第一页
    getMemberData();
    showFilterMenu.value = false;
};

// 重置过滤器
const resetFilter = () => {
    timeFilter.value = SearchTimeEnum.TODAY;
    levelFilter.value = 'null';
    startDate.value = '';
    endDate.value = '';

    toggleFilterMenu();

    page.value.pageNum = 1; // 重置为第一页
    getMemberData();
};

// 获取会员数据
const getSummaryData = async () => {
    // 显示汇总数据弹窗
    showSummaryModal.value = true;
    
    try {
        const { code, data }:any = await agentSummaryDataApi({
            ...(searchId.value ? { searchUserId: searchId.value } : {}),
            level: levelFilter.value !== 'null' ? levelFilter.value.replace('V', '') : 'null',
            ...(timeFilter.value != "" ? { day: timeFilter.value } : {}),
            ...(startDate.value ? { startTime: startDate.value } : {}),
            ...(endDate.value ? { endTime: `${endDate.value} 23:59:59` } : {}),
        });
        
        if (code === 200 && data.data) {
            summaryData.value = {
                firstRecharge: data.data.firstRecharge || '0',
                rechargeAmount: data.data.rechargeAmount || '0',
                rechargeCount: data.data.rechargeCount || '0',
                totalDama: data.data.totalDama || '0',
            };
        }
    } catch (error) {
        console.error('Failed to fetch summary data:', error);
    }
};

// 关闭汇总数据弹窗
const closeSummaryModal = () => {
    showSummaryModal.value = false;
    summaryExpanded.value = false;
};

// 展开/收起汇总数据弹窗
const toggleSummaryExpand = () => {
    summaryExpanded.value = !summaryExpanded.value;
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
                    title: t("link_copied")
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
        // if (loading.value) return;

        loading.value = true;

        // 将过滤条件转换为API参数
        let apiLevel = level.value;
        if (levelFilter.value !== 'null') {
            apiLevel = levelFilter.value.replace('V', '');
        }



        const { code, data }:any = await agentAllDataApi({
            ...(searchId.value ? { searchUserId: searchId.value } : {}),
            pageSize: page.value.pageSize,
            pageNum: page.value.pageNum,
            level: apiLevel,
            ...(timeFilter.value != "" ? { day: timeFilter.value } : {}),
            ...(startDate.value ? { startTime: startDate.value } : {}),
            ...(endDate.value ? { endTime: `${endDate.value} 23:59:59` } : {}),
        });

        loading.value = false;

        if (code === 200 && data) {
            // 正式集成时处理API返回的数据
            const newData = data.rows?.map(item => ({
                level: "V" + item.level,
                id: item.userId,
                date: item.createTime,
                totalDeposit: item.rechargeAmount,
                validBets: item.totalDama,
                firstRecharge: item.firstRecharge,
            })) || [];

            memberList.value = newData;

            // 更新总记录数 - 使用类型断言避免类型检查错误
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

// 处理触摸开始事件
const handleTouchStart = (event: TouchEvent, type: 'year' | 'month' | 'day') => {
    startTouchY.value = event.touches[0].clientY;
    currentTranslateY.value[type] = type === 'year' ? yearTranslateY.value : type === 'month' ? monthTranslateY.value : dayTranslateY.value;
    
    // 重置滚动状态
    isScrolling.value[type] = false;
    scrollStartTime.value = Date.now();
};

// 处理触摸移动事件
const handleTouchMove = (event: TouchEvent, type: 'year' | 'month' | 'day') => {
    
    event.preventDefault();
    const currentY = event.touches[0].clientY;
    const diff = currentY - startTouchY.value;

    // 检测是否开始滚动
    if (!isScrolling.value[type] && Math.abs(diff) > minScrollDistance) {
        isScrolling.value[type] = true;
    }

    const translateY = currentTranslateY.value[type] + diff;

    // 设置滚动位置
    if (type === 'year') {
        yearTranslateY.value = translateY;
    } else if (type === 'month') {
        monthTranslateY.value = translateY;
    } else {
        dayTranslateY.value = translateY;
    }
};

// 处理触摸结束事件
const handleTouchEnd = (type: 'year' | 'month' | 'day') => {
    let translateY;
    let maxTranslateY;

    if (type === 'year') {
        translateY = yearTranslateY.value;
        maxTranslateY = -(yearOptions.length - 1) * itemHeight;
    } else if (type === 'month') {
        translateY = monthTranslateY.value;
        maxTranslateY = -11 * itemHeight; // 12个月
    } else {
        translateY = dayTranslateY.value;
        const daysInMonth = getDaysInMonth(selectedYear.value, selectedMonth.value);
        maxTranslateY = -(daysInMonth - 1) * itemHeight;
    }

    // 计算最接近的位置
    const itemIndex = Math.round(-translateY / itemHeight);
    const adjustedTranslateY = -itemIndex * itemHeight;

    // 限制在有效范围内
    const boundedTranslateY = Math.max(maxTranslateY, Math.min(0, adjustedTranslateY));

    // 更新位置
    if (type === 'year') {
        yearTranslateY.value = boundedTranslateY;
        selectedYear.value = yearOptions[Math.min(yearOptions.length - 1, Math.max(0, itemIndex))];
    } else if (type === 'month') {
        monthTranslateY.value = boundedTranslateY;
        selectedMonth.value = Math.min(12, Math.max(1, itemIndex + 1));

        // 重新计算日期选择器位置
        const daysInMonth = getDaysInMonth(selectedYear.value, selectedMonth.value);
        if (selectedDay.value > daysInMonth) {
            selectedDay.value = daysInMonth;
            dayTranslateY.value = -(selectedDay.value - 1) * itemHeight;
        }
    } else {
        dayTranslateY.value = boundedTranslateY;
        const daysInMonth = getDaysInMonth(selectedYear.value, selectedMonth.value);
        selectedDay.value = Math.min(daysInMonth, Math.max(1, itemIndex + 1));
    }

    // 延迟重置滚动状态，防止立即触发点击事件
    setTimeout(() => {
        isScrolling.value[type] = false;
    }, 100);
};

onMounted(() => {
    // 实际接入API时取消注释
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
            @extend .theme-allData-search-bg;
            width: 168px;
            height: 30px;
            padding: 0 40px 0 15px;
            color: #fff;
            font-size: 13px;

            &::placeholder {
                color: var(--secondary-color);
            }
        }
    }
}

.filter-menu-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 110%;
    background-color: black;
    opacity: 0.5;
    z-index: 99;
}

.filter-menu {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    background-color: var(--nav-bar-background);
    border-radius: 0 0 8px 8px;
    z-index: 100;
    padding: 15px;
    padding-bottom: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
    margin-bottom: 15px;
}

.filter-title {
    font-size: 18px;
    font-weight: bold;
    color: black;
    margin-bottom: 5px;
}

.filter-subtitle {
    font-size: 14px;
    color: var(--text-black);
    margin-bottom: 8px;
    font-weight: 100;
    margin-left: 20px;
}

.filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
    margin-left: 30px;
    margin-right: 30px;
}

.filter-option {
    padding: 3px 8px;
    background-color: transparent;
    border-radius: 20px;
    font-weight: 550;
    font-size: 11px;
    color: var(--primary-color);
    cursor: pointer;
    border: 1px solid var(--primary-color);

    &.active {
        background-color: var(--primary-color);
        color: white;
    }
}

.level-options {
    .filter-option {
        padding: 6px 20px;
    }
}

.date-range {
    display: flex;
    width: 100%;
    margin-left: 30px;
    margin-right: 30px;
    gap: 10px;
    margin-bottom: 15px;
}

.date-input {
    padding: 4px 20px 4px 20px;
    background-color: transparent;
    border-radius: 15px;
    font-weight: 550;
    font-size: 11px;
    color: var(--primary-color);
    text-align: center;
    cursor: pointer;
    border: 1px solid var(--primary-color);
}

.date-input.selected {
    background-color: $theme-allData-filter-option-bg-ac;
    color: white;
}

.date-separator {
    font-size: 16px;
    color: white;
}

.filter-actions {
    display: flex;
    gap: 30px;
    margin-top: 25px;
    justify-content: center;
}

.action-button {
    padding: 8px 30px;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}

.filter-btn {
    // @extend .theme-allData-filter-filter-btn;
    background-color: var(--primary-color);
    color: var(--text-white);
}

.reset-btn {
    @extend .theme-allData-filter-reset-btn;
}

.members-list {
    .member-item {
        display: flex;
        position: relative;
        height: 62px;
      

        &:nth-child(odd){
            background-color: $theme-allData-table-odd-bg;
            border-radius: 8px;
        }
 
        &:nth-child(even) {
            background-color: $theme-allData-table-even-bg;
        }

     

        overflow: hidden;

        .item-level {
            position: absolute;
            top: 0;
            left: 0;
            width: 39px;
            height: 20px;
            border-radius: 0px 0px 8px 0px;
            background: $theme-allData-table-item-bg;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #fff;
            font-weight: bold;
        }

        .top-tip{
            width: 72px;
            height: 12px;
            font-weight: 500;
            font-size: 12px;
            color: white;
            text-align: center;
            font-style: normal;
            text-transform: none;
            display: inline-block;
            line-height: 12px;
        }

        &:first-child .item-level {
            border-radius: 8px 0px 8px 0px;
        }

        .member-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 8px;
            width: 150px;

            .member-id {
                display: flex;
                align-items: center;
                color: $theme-text-color-dark;
                font-size: 12px;
                font-weight: bold;
                margin-top: 20px;
                margin-left: 20px;

            }

            .member-date {
                color: $theme-allData-table-date-color;
                font-size: 10px;
                margin-left: 20px;
            }
        }

        .member-data {
            flex: 1;
            padding: 8px 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 6px;

            .data-row {
                display: flex;
                justify-content: space-start;

                &:last-child {
                    margin-bottom: 0;
                }

                .data-label {
                    color: $theme-text-color-dark;
                    font-size: 12px;
                    line-height: 12px;
                }

                .data-value {
                    font-size: 12px;
                    font-weight: bold;
                    line-height: 12px;
                    margin-left: 10px;

                    &.pink {
                        color: $theme-allData-table-pink-color;
                    }
                }
            }
        }
    }
}

.float-btn {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 130px;
    z-index: 11;

    .btn-inner {
        @extend .theme-allData-float-btn-bg;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 55px;
        height: 55px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

        span {
            color: white;
            font-size: 9.5px;
        }
    }
}

.date-picker {
    position: absolute;
    top: 210px;
    left: 20px;
    width: 150px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.start-picker {
    left: 20px;
}

.end-picker {
    left: 130px;
}

.date-picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 105%;
    background-color: rgba(0, 0, 0, 0.5);
}

.date-picker-columns {
    display: flex;
    height: 155px;
    padding: 0 5px;
    background-color: #fff;
}

.picker-column {
    flex: 1;
    position: relative;
    height: 100%;
    overflow: hidden;
    text-align: center;
}

.pickered-line {
    position: absolute;
    top: 38%;
    left: 0;
    right: 0;
    height: 30px;
    border: 1px solid #FFF1AD;
    pointer-events: none;
}

.picker-column-content {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(0);
    transition: transform 0.2s ease-out;
}

.picker-item {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight: 550;
    color: #533726;
    font-size: 11px;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.1s ease;

    &.scrolling {
        pointer-events: none;
    }
}

.picker-item span {
    display: inline-block;
    padding: 0 5px;
}

.picker-item span.active {
    color: #FFCC00;
    font-weight: bold;
}

.date-picker-confirm {
    text-align: center;
    margin: 5px;
    padding: 8px 0;
    background-color: #FFCC00;
    color: #533726;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
}

.footer {
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
            color: var(--primary-color);
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
            color: var(--primary-color);
            background: $cancel-bg;
            background-size: 100% 100%;
            border-radius: 50%;

            &:not(:last-child) {
                margin-right: var(--pa-space);
            }
        }

        :deep(.van-pagination__item--active) {
            color: var(--primary-color);
            background: $submit-bg;
            background-size: 100% 100%;
        }

        :deep(.van-pagination__item--prev),
        :deep(.van-pagination__item--next) {
            color: var(--primary-color);
        }

        :deep(.van-hairline--surround):after {
            border-width: 0;
        }
    }
}

.summary-modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
}

.summary-modal {
    @extend .theme-allData-summary-bg;
    padding: 10px 10px 0 10px;
    width: 100%;
    max-width: 499px;
    position: relative;
    color: white;
    height: 300px;
    transform: translateY(100%);
    animation: slideUp 0.4s ease-out forwards;

    &.show {
        transform: translateY(0);
    }

    .summary-close {
        position: relative;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        margin-bottom: 10px;

        svg {
            width: 16px;
            height: 16px;
        }
    }

    .summary-content {
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        gap:10px;
        justify-content: flex-start;

        .summary-col {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: start;
            margin-bottom: 15px;
            gap: 10px;

            .summary-item {
                flex: 1;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10px;
                justify-content: center;
                border-radius: 8px;
                padding: 10px 5px;

                .summary-label {
                    font-size: 12px;
                    color: $theme-text-color-light;
                    text-align: center;
                    line-height: 1.2;
                }

                .summary-value {
                    font-size: 12px;
                    font-weight: bold;
                    color: white;
                }
            }
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
</style>