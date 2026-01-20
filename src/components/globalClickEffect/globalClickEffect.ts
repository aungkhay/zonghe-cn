import { createApp } from 'vue'
import ClickEffectComponent from "@/components/globalClickEffect/index.vue"
import Common from '@/utils/common/common'

interface ClickEffectOptions {
  webpSrc?: string
  size?: number
  duration?: number
}

class GlobalClickEffectManager {
  private container: HTMLElement | null = null
  private webpSrc: string
  private isEnabled: boolean = true

  constructor() {
    // 使用项目中的touch_effect.webp
    this.webpSrc = Common.handleImagePath('/static/default/public/touch_effect.webp')
    this.init()
  }

  private init() {
    // 创建容器
    this.container = document.createElement('div')
    this.container.id = 'global-click-effects-container'
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
    `
    document.body.appendChild(this.container)

    // 添加全局点击监听
    this.addGlobalListeners()
  }

  private addGlobalListeners() {
    // 移动端触摸事件
    document.addEventListener('touchstart', this.handleTouch.bind(this), { passive: true })
    // 桌面端鼠标事件
    document.addEventListener('click', this.handleClick.bind(this), { passive: true })
  }

  private handleTouch(event: TouchEvent) {
    if (!this.isEnabled || !event.touches || event.touches.length === 0) return
    
    const touch = event.touches[0]
    this.showEffect(touch.clientX, touch.clientY)
  }

  private handleClick(event: MouseEvent) {
    if (!this.isEnabled) return

    // //如果url有uId,则获取并存到cookie中
    // const url = window.location.href
    // const uIdMatch = url.split('uId=')[1]
    // if (uIdMatch) {
    //   // 获取到数字截止
    //   const uId = uIdMatch.split('&')[0]
    //   Common.setStorage('uId', uId)
    // }
    
    this.showEffect(event.clientX, event.clientY)
  }

  public showEffect(x: number, y: number, options: ClickEffectOptions = {}) {
    if (!this.container || !this.isEnabled) return

    const {
      webpSrc = this.webpSrc,
      size = 60,
      duration = 500
    } = options

    // 创建效果组件实例
    const effectDiv = document.createElement('div')
    this.container.appendChild(effectDiv)

    const effectApp = createApp(ClickEffectComponent, {
      x,
      y,
      visible: true,
      webpSrc,
      size,
      duration,
      onFinished: () => {
        // 动画结束后清理
        try {
          effectApp.unmount()
          if (this.container && effectDiv.parentNode === this.container) {
            this.container.removeChild(effectDiv)
          }
        } catch (error) {
          console.warn('清理点击动画效果时出错:', error)
        }
      }
    })

    effectApp.mount(effectDiv)
  }

  public enable() {
    this.isEnabled = true
  }

  public disable() {
    this.isEnabled = false
  }

  public setWebpSrc(src: string) {
    this.webpSrc = src
  }

  public destroy() {
    // 移除事件监听
    document.removeEventListener('touchstart', this.handleTouch.bind(this))
    document.removeEventListener('click', this.handleClick.bind(this))

    // 移除容器
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }
  }
}

// 创建全局实例
export const globalClickEffectManager = new GlobalClickEffectManager()

// 导出控制方法
export function enableGlobalClickEffect() {
  globalClickEffectManager.enable()
}

export function disableGlobalClickEffect() {
  globalClickEffectManager.disable()
}

export function setGlobalClickEffectWebp(src: string) {
  globalClickEffectManager.setWebpSrc(src)
}