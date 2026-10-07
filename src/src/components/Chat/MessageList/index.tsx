import './index.css';

export default function MessageList() {
  return (
    <div className="message-list">
      <div className="message-item message-item-user">
        <div className="message-content-stack stack-user">
          <div className="message-bubble message-user">こんにちは！</div>
        </div>
      </div>

      <div className="message-item message-item-ai">
        <div className="message-content-stack stack-ai">
          <div className="message-bubble message-ai">
            こんにちは。今日はどのようなご用件でしょうか？
            何かお手伝いできることがあれば、お気軽にお尋ねください。
          </div>
        </div>
      </div>

      <div className="message-item message-item-user">
        <div className="message-content-stack stack-user">
          {/* Mock Image if needed, or just text */}
          <div className="message-bubble message-user">
            UIの確認をしています。
          </div>
        </div>
      </div>
    </div>
  );
}
