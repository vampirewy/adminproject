import {
  Message,
  MessageBox
} from "element-ui";
export class MessageBounced {
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