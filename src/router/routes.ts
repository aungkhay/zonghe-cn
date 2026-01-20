import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";
const hostName = window.location.hostname;

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: (to) => {
      // 保留查询参数的重定向
      return { name: "Home", query: to.query };
    },
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "180101",
          hideNavBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/gamelist",
        name: "GameList",
        component: () => import("@/views/gameList/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "105031",
          // noCache: true,
          hideNavBar: true,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/my-report",
        name: "MyReport",
        component: () => import("@/views/profile/reportCom/myReport.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.my_report",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/reset-password",
        name: "ResetPassword",
        component: () => import("@/views/profile/resetPassword.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.login_password",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/reset-txn-password",
        name: "ResetTxnPassword",
        component: () => import("@/views/profile/resetTxnPassword.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.withdraw_password",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/bind-real-name",
        name: "BindRealName",
        component: () => import("@/views/profile/binkRealName.vue"),
        meta: {
          title: hostName,
          titleTextId: "bind_real_name.title",
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/bind-phone",
        name: "BindPhone",
        component: () => import("@/views/profile/bindPhone.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.bind_phone",
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/noti-center",
        name: "NotiCenter",
        component: () => import("@/views/profile/notice/notiCenter.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.info_center",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/noti-center/details",
        name: "NotiDetails",
        component: () => import("@/views/profile/notice/details.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.info_details",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/txn-record",
        name: "TxnRecord",
        component: () => import("@/views/profile/reportCom/txnRecord.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.record",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/bet-record",
        name: "BetRecord",
        component: () => import("@/views/profile/reportCom/betRecord.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.bet_record",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/my-data",
        name: "MyData",
        component: () => import("@/views/profile/myData.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.my_data",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/about-us",
        name: "AboutUs",
        component: () => import("@/views/profile/aboutUs.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.about_us",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/my-invite-link",
        name: "MyInviteLink",
        component: () => import("@/views/profile/invite_link.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.invite_friend",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/manage-acc",
        name: "ManageAcc",
        component: () => import("@/views/profile/accManage.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.account_management",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/profile/settings.vue"),
        meta: {
          title: hostName,
          titleTextId: "profile.setting",
          // noCache: true,
          hideNavBar: false,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      // {
      //   path: "/gametypelist",
      //   name: "GameTypeList",
      //   component: () => import("@/views/gameTypeList/index.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "105031",
      //     noCache: true,
      //     hideNavBar: true,
      //     hideTabBar: true
      //   }
      // },
      {
        path: "/gameDetail",
        name: "GameDetail",
        component: () => import("@/views/gameDetail/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "140037",
          noCache: true,
          hideNavBar: true,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/gameDetailTT",
        name: "GameDetailTT",
        component: () => import("@/views/gameDetail/gameDetailTT.vue"),
        meta: {
          title: hostName,
          titleTextId: "140037",
          noCache: true,
          hideNavBar: true,
          hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/promo",  //这里是活动页面 改这里
        name: "Promo",
        component: () => import("@/views/promo/newEvents.vue"),
        meta: {
          title: hostName,
          titleTextId: "105000",
          noCache:false,
          // hideNavBar: true,
          // hideTabBar: true
          hideTopMenuBar: true
        }
      },
      {
        path: "/custom-event-html",  //这里是活动页面 改这里
        name: "CustomEventHtml",
        component: () => import("@/views/promo/customEventHtml.vue"),
        meta: {
          title: hostName,
          titleTextId: "105000",
          noCache:false,
          // hideNavBar: true,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/service",  //这里是活动页面 改这里
        name: "Service",
        component: () => import("@/views/CustomerService/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "customer_service",
          noCache:false,
          // hideNavBar: true,
          // hideTabBar: true
          hideTopMenuBar: true
        }
      },
      {
        path: "/service/chat",  //这里是活动页面 改这里
        name: "ChatPage",
        component: () => import("@/views/CustomerService/chatPage.vue"),
        meta: {
          title: hostName,
          titleTextId: "customer_service",
          noCache:false,
          // hideNavBar: true,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      // {
      //   path: "/share",
      //   name: "Share",
      //   component: () => import("@/views/share/index.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "110006",
      //     hideNavBar: true,
      //     noCache: true,
      //     hideTabBar: true
      //   }
      // },
      {
        path: "/deposit",
        name: "Deposit",
        component: () => import("@/views/deposit/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "110002",
          noCache: true,
          hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/deposit/usdt-qrview",
        name: "USDT_QR_VIEW",
        component: () => import("@/views/deposit/usdt_qr.vue"),
        meta: {
          title: hostName,
          titleTextId: "110002",
          noCache: true,
          hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/profile/newIndex.vue"),
        meta: {
          title: hostName,
          titleTextId: "180105",
          hideNavBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/vipPlus",
        name: "vipPlus",
        component: () => import("@/views/vip/indexPlus.vue"),
        meta: {
          title: hostName,
          titleTextId: "110007",
          // hideNavBar: true,
          noCache: true,
          hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      {
        path: "/vipPlus/history",
        name: "vipPlusHistory",
        component: () => import("@/views/vip/indexPlusHistory.vue"),
        meta: {
          title: hostName,
          titleTextId: "104006",
          hideNavBar: false,
          noCache: true,
          hideTopMenuBar: true,
          hideTabBar: true
        }
      },
      {
        path: "/agent/history",
        name: "agentHistory",
        component: () => import("@/views/agent/indexHistory.vue"),
        meta: {
          title: hostName,
          titleTextId: "104006",
          // hideNavBar: true,
          noCache: true,
          hideTopMenuBar: true,
          hideTabBar: true
        }
      },
      // {
      //   path: "/svgDemo",
      //   name: "svgDemo",
      //   component: () => import("@/views/svgDemo/index.vue"),
      //   meta: {
      //     title: "svg图标",
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/paypage",
      //   name: "paypage",
      //   component: () => import("@/views/paypage/index.vue"),
      //   meta: {
      //     title: hostName,
      //     noCache: true,
      //     titleTextId: "102054",
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/paymentPageTT",
      //   name: "paymentPageTT",
      //   component: () => import("@/views/deposit/paymentPageTT.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "140037",
      //     noCache: true,
      //     hideNavBar: true,
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/withdraw",
      //   name: "withdraw",
      //   component: () => import("@/views/withdraw/index.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "110003",
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/withdraw/addCard",
      //   name: "addCard",
      //   component: () => import("@/views/withdraw/addCard.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "107055",
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/withdraw/bankCard",
      //   name: "bankCard",
      //   component: () => import("@/views/withdraw/bankCard.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "110003",
      //     // hideTabBar: true
      //   }
      // },
      {
        path: "/withdraw2",
        name: "withdraw2",
        component: () => import("@/views/withdraw2/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "110003",
          hideTabBar: true,
          hideNavBar: false,
          hideTopMenuBar: true
        }
      },
      {
        path: "/withdraw2/setPassword",
        name: "withdraw2SetPassword",
        component: () => import("@/views/withdraw2/setPassword.vue"),
        meta: {
          title: hostName,
          titleTextId: "f_set_withdrawal_password",
          hideTopMenuBar: true,
          noCache: true,
          hideTabBar: true
        }
      },
      {
        path: "/withdraw2/resetPassword",
        name: "withdraw2ResetPassword",
        component: () => import("@/views/withdraw2/resetPassword.vue"),
        meta: {
          title: hostName,
          titleTextId: "f_reset_withdrawal_password",
          hideTopMenuBar: true,
          noCache: true
        }
      },
     
      {
        path: "/profile/report",
        name: "report",
        component: () => import("@/views/profile/report.vue"),
        meta: {
          title: hostName,
          titleTextId: "106006",
          // hideTabBar: true,
          hideTopMenuBar: true
        }
      },
      // {
      //   path: "/profile/changePassword",
      //   name: "changePassword",
      //   component: () => import("@/views/profile/changePassword.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "change_password",
      //     // hideTabBar: true,
      //     hideTopMenuBar:true,
      //   }
      // },
      // {
      //   path: "/profile/about",
      //   name: "about",
      //   component: () => import("@/views/profile/about.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "101005",
      //     // hideTabBar: true,
      //     hideTopMenuBar:true,
      //   }
      // },
      // {
      //   path: "/activity/rebate",
      //   name: "rebate",
      //   component: () => import("@/views/activity/rebate/index.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "105036",
      //     hideNavBar: true,
      //     noCache: true,
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/activity/bounty",
      //   name: "bounty",
      //   component: () => import("@/views/activity/bounty/index.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "105037",
      //     noCache: true,
      //     // hideTabBar: true
      //   }
      // },
      // {
      //   path: "/messageCenter",
      //   name: "MessageCenter",
      //   component: () => import("@/views/messageCenter/index.vue"),
      //   meta: {
      //     title: hostName,
      //     titleTextId: "message_center",
      //     // hideTabBar: true,
      //     hideNavBar: true,
      //     hideTopMenuBar: true
      //   }
      // },
      {
        path: "/agent",
        name: "Agent",
        component: () => import("@/views/agent/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "convidar",
          // hideTabBar: true,
          // hideNavBar: true,
          hideTopMenuBar: true,
          hideTabBar: true
        }
      },
      {
        path: "/activity/firstRecharge",
        name: "firstRecharge",
        component: () => import("@/views/activityPopup/newActivities/firstRecharge.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_first_recharge",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/secondRecharge",
        name: "secondRecharge",
        component: () => import("@/views/activityPopup/newActivities/secondRecharge.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_second_recharge",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/chestReward",
        name: "chestReward",
        component: () => import("@/views/activityPopup/newActivities/chestReward.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_chest_reward",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/agentFirstHistory",
        name: "agentFirstHistory",
        component: () => import("@/views/activityPopup/newActivities/agentFirstHistory.vue"),
        meta: {
          title: hostName,
          titleTextId: "f_activity_agent_first_history",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/totalRecharge",
        name: "totalRecharge",
        component: () => import("@/views/activityPopup/newActivities/totalRecharge.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_total_recharge",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/dayBet",
        name: "dayBet",
        component: () => import("@/views/activityPopup/newActivities/dayBet.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_day_bet",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/weekBet",
        name: "weekBet",
        component: () => import("@/views/activityPopup/newActivities/weekBet.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_week_bet",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/weekLoose",
        name: "weekLoose",
        component: () => import("@/views/activityPopup/newActivities/weekLoose.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_week_loose",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/weekRebate",
        name: "weekRebate",
        component: () => import("@/views/activityPopup/newActivities/weekRebate.vue"),
        meta: {
          title: hostName,  
          titleTextId: "activity_week_rebate",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/weekRecharge",
        name: "weekRecharge",
        component: () => import("@/views/activityPopup/newActivities/weekRecharge.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_week_recharge",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/agentSonFlowRebate",
        name: "agentSonFlowRebate",
        component: () => import("@/views/activityPopup/newActivities/agentSonFlowRebate.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_agent_son_flow_rebate",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/subRechargeShare",
        name: "subRechargeShare",
        component: () => import("@/views/activityPopup/newActivities/subRechargeShare.vue"),
        meta: {
          title: hostName,
          titleTextId: "activity_sub_recharge_share",
          // hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/activity/dayRecharge",
        name: "dayRecharge",
        component: () => import("@/views/activityPopup/newActivities/dayRecharge.vue"),
        meta: {
          title: hostName,
          titleTextId: "day_deposit",
          hideTabBar: true,
          hideTopMenuBar: true,
        }
      },
      {
        path: "/maintain",
        name: "maintain",
        component: () => import("@/views/maintain/index.vue"),
        meta: {
          title: hostName,
          titleTextId: "maintain",
          hideNavBar: true,
          hideTopMenuBar: true,
          hideTabBar: true,
        }
      }
      
    ]
  }
];

export default routes;
