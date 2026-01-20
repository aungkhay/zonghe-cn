// scaleTap.ts
export default {
  mounted(el: HTMLElement) {
    el.style.transition = 'transform 0.1s ease'

    const pressIn = () => {
      el.style.transform = 'scale(1.2)'
    }

    const pressOut = () => {
      el.style.transform = 'scale(1)'
    }

    // 桌面端
    el.addEventListener('mousedown', pressIn)
    el.addEventListener('mouseup', pressOut)
    el.addEventListener('mouseleave', pressOut)

    // 移动端
    el.addEventListener('touchstart', pressIn, { passive: true })
    el.addEventListener('touchend', pressOut)
    el.addEventListener('touchcancel', pressOut)
  },
  unmounted(el: HTMLElement) {
    // 如果你项目中支持热重载或动态卸载组件，建议这里加上 removeEventListener
  }
}
