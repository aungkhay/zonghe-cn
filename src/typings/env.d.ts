/// <reference types="vite/client" />
declare global {
  interface Window {
    openWin: (url: string, target: string = '_blank') => void;
  }
}

export {};