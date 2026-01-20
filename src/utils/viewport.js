// 自适应适配
const WIDTH = 375;
const mobileAdapter = () => {
  let scale = screen.width / WIDTH;
  let content = `width=${WIDTH}, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`;
  let meta = document.querySelector("meta[name=viewport]");
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};
mobileAdapter();
// 改变窗口大小时重新设置
window.onresize = () => {
  mobileAdapter();
};
