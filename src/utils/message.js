import {
  Message,
  MessageBox
} from "element-ui";
export class MessageBounced {
  /**
   * 
   * @param {String} msgText 标题信息
   * @param {String} msgType 类型 success/error/warning...
   * @param {String} mainContent 确认框主体内容
   * @param {Function} fn  confirmWindow回调函数 
   */
  constructor(msgText, msgType, mainContent, fn) {
    this.msgText = msgText;
    this.msgType = msgType;
    this.mainContent = mainContent;
    this.fn = fn;
  }
  messageWindow() {
    Message({
      message: this.msgText,
      type: this.msgType
    })
  }
  confirmWindow() {
    MessageBox.confirm(this.mainContent, this.msgText, {
      callback: this.fn,
      type: `warning`
    })
  }
}