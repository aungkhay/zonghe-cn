// 关于活动的广播内容拼接
const getActBroadcastSplicing = (dataBroadcast, t) => {
  if (dataBroadcast.ActivityId === 2010) {
    let strWheelType = t(dataBroadcast.WheelType + 320014);
    return t(dataBroadcast.BroadcastId, [
      dataBroadcast.AccountName,
      dataBroadcast.RewardGold / 100,
      strWheelType
    ]);
  }
  if (dataBroadcast.ActivityId === 1010) {
    return t(dataBroadcast.BroadcastId, [
      dataBroadcast.AccountName,
      dataBroadcast.RewardGold / 100
    ]);
  }
};

export default getActBroadcastSplicing;
