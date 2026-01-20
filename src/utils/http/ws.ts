class WebSocketService {
  // 成员变量初始化
  private socket: WebSocket | null = null; // WebSocket 实例
  private socketReady: boolean = false; // WebSocket 是否已就绪
  private isAuth: boolean = false; // 是否通过身份验证
  private accessToken: string = localStorage.getItem("__user__token__") || ""; // 用户token
  private rpcId: number = 1; // RPC ID 计数器
  private rpcCallbacks: Map<number, (data: any) => void> = new Map(); // 存储 RPC 回调函数
  private msgHandlers: Map<string, (data: any) => void> = new Map(); // 存储消息处理器
  private readonly wsUrl: string = import.meta.env.VITE_WS_URL; // WebSocket URL
  static readonly RpcTimeout: number = 10 * 1000; // RPC 超时时间
  private shouldReconnect: boolean = true; // 是否应该重连

  // 开始连接 WebSocket
  startConnect() {
    this.shouldReconnect = true; // 每次开始连接时重置为 true
    this.onConnect();
  }

  // 进行连接
  onConnect() {
    if (this.socketReady) return; // 如果已就绪，直接返回
    this.connect();
  }

  // 发送消息
  sendMsg(type: string, msg: any) {
    if (this.isAuth) {
      // 只有在通过身份验证后才发送消息
      this.send(type, msg);
    }
  }

  // 远程调用
  call(type: string, data: any): Promise<any> {
    if (!this.isAuth) throw new Error("Not Auth"); // 未验证则抛出错误
    return this._call(type, data);
  }

  // 添加消息处理器
  addMessageHandler(msgType: string, handler: (data: any) => void) {
    this.msgHandlers.set(msgType, handler); // 添加到消息处理器映射
  }

  // 删除消息处理器
  removeMessageHandler(msgType: string) {
    this.msgHandlers.delete(msgType); // 从消息处理器映射中删除
  }

  // 关闭 WebSocket 连接
  closeConnect() {
    this.shouldReconnect = false; // 设置为 false，防止重连
    this.socket.close(); // 关闭 WebSocket
    this.cleanup(); // 清理状态和回调函数
  }

  // 清理状态和回调函数
  private cleanup() {
    this.socketReady = false;
    this.isAuth = false;
    this.rpcCallbacks.clear(); // 清空 RPC 回调
    this.msgHandlers.clear(); // 清空消息处理器
  }

  // 私有方法：连接 WebSocket
  private connect() {
    if (this.socketReady) {
      this.socket?.close(); // 如果已连接，先关闭当前连接
    }
    this.socket = new WebSocket(this.wsUrl); // 创建新的 WebSocket 实例

    // 设置 WebSocket 事件处理函数
    this.socket.onopen = this.onSocketOpened.bind(this);
    this.socket.onerror = this.onSocketError.bind(this);
    this.socket.onclose = this.onSocketClose.bind(this);
    this.socket.onmessage = this.onSocketMessage.bind(this);
  }

  // WebSocket 打开时的处理
  private async onSocketOpened() {
    this.socketReady = true;
    try {
      await this._call("identity", { auth: this.accessToken }); // 发送身份验证请求
      this.isAuth = true;
      this.heartbeat(); // 开始心跳检测
    } catch (error) {
      // 认证失败
    }
  }

  // WebSocket 错误处理
  private onSocketError(event: Event) {
    if (this.shouldReconnect) {
      this.retryConnect(); // 尝试重连
    }
  }

  // WebSocket 关闭处理
  private onSocketClose(event: CloseEvent) {
    if (this.shouldReconnect) {
      this.retryConnect(); // 尝试重连
    }
  }

  // WebSocket 消息处理
  private onSocketMessage(event: MessageEvent) {
    const data = JSON.parse(event.data); // 解析消息数据
    if (data.rpcId) {
      // 如果有 RPC ID
      const callback = this.rpcCallbacks.get(data.rpcId); // 查找回调函数
      if (callback) {
        callback(data); // 执行回调
        this.rpcCallbacks.delete(data.rpcId); // 删除回调
      } else {
        // 未找到 RPC 回调
      }
    } else {
      // 普通消息处理
      const handler = this.msgHandlers.get(data.event);
      if (handler) {
        handler(data); // 执行消息处理器
      } else {
        // 未找到消息处理器
      }
    }
  }

  // 发送消息
  private send(event: string, data: any) {
    if (this.socketReady && this.socket) {
      this.socket.send(JSON.stringify({ event, data })); // 发送消息
    }
  }

  // 远程调用
  private _call(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socketReady || !this.socket) {
        reject(new Error("WebSocket 未就绪"));
        return;
      }
      const rpcId = this.rpcId++; // 生成新的 RPC ID
      const timeout = window.setTimeout(() => {
        // RPC 超时
        if (this.socket) {
          this.socket.close();
        }
        reject(new Error("RPC 超时"));
      }, WebSocketService.RpcTimeout);
      this.rpcCallbacks.set(rpcId, (resp: any) => {
        clearTimeout(timeout);
        resolve(resp);
      });
      this.send(type, { ...data, rpcId }); // 发送带有 RPC ID 的消息
    });
  }

  // 心跳检测
  private heartbeat() {
    if (this.socketReady && this.isAuth) {
      this.send("heartbeat", { msg: "heartbeat" }); // 发送心跳消息
      window.setTimeout(() => this.heartbeat(), 5000); // 每隔 5 秒发送一次
    }
  }

  // 重试连接
  private retryConnect() {
    this.socketReady = false;
    this.isAuth = false;
    this.rpcCallbacks.clear(); // 清空 RPC 回调
    if (this.shouldReconnect) {
      setTimeout(() => this.onConnect(), 3000); // 3 秒后重试连接
    }
  }
}

// 实例化并导出 WebSocketService
const ws = new WebSocketService();
export default ws;
