<template>
    <div 
      v-if="visible"
      class="global-click-effect"
      :style="effectStyle"
      @animationend="onAnimationEnd"
    >
      <img 
        :src="webpSrc" 
        alt="click effect"
        draggable="false"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface ClickEffectProps {
    x: number
    y: number
    visible: boolean
    webpSrc: string
    size?: number
    duration?: number
  }
  
  const props = withDefaults(defineProps<ClickEffectProps>(), {
    size: 30,
    duration: 500
  })
  
  const emit = defineEmits<{
    finished: []
  }>()
  
  const effectStyle = computed(() => ({
    left: `${props.x - props.size / 2}px`,
    top: `${props.y - props.size / 2}px`,
    width: `${props.size}px`,
    height: `${props.size}px`,
    animationDuration: `${props.duration}ms`
  }))
  
  const onAnimationEnd = () => {
    emit('finished')
  }
  </script>
  
  <style scoped lang="scss">
  .global-click-effect {
    position: fixed;
    pointer-events: none;
    z-index: 10000;
    animation: clickEffect 0.5s ease-out forwards;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  @keyframes clickEffect {
    0% {
      transform: scale(0.3);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }
  </style>