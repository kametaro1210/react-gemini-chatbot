import { useState } from 'react';
import { HiOutlinePaperAirplane, HiOutlinePhoto } from 'react-icons/hi2';
import { model } from '../../../lib/gemini';
import MessageList from '../MessageList';
import './index.css';


export default function ChatContainer() {

  // 入力された文字を最初に空(''）の状態で保管しておき、
  // 文字が入力・変更されるたびに setInputText でその中身を新しい文字に書き換える
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {

    // 入力欄（inputText）の前後の空白を削除してメッセージを取得
    const currentMessage = inputText.trim();

    // AIモデルにメッセージを送信し、応答を待ち、結果を取得する
    const result = await model.generateContent(currentMessage);
    console.log(result.response.text());
  }

  return (
    <div className="chat-container">
      <MessageList />

      {/* Integrated Message Input Area */}
      <div className="message-input-container">
        {/* Preview Area - Commented out or toggleable */}
        {/* <div className="image-preview-container">
            <div className="image-preview-wrapper">
              <img src="" alt="preview" className="image-preview" />
              <button className="image-preview-close" onClick={() => {}}>
                ×
              </button>
            </div>
          </div> */}

        <div className="message-input-wrapper">
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={() => {}}
          />
          <button
            className="icon-button"
            onClick={() => {}}
            title="画像をアップロード"
          >
            <HiOutlinePhoto size={24} />
          </button>
          <textarea
            className="message-input"
            placeholder="AIにメッセージを送信する..."
            rows={1}
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
          />
          <button className="send-button" onClick={handleSend}>
            <HiOutlinePaperAirplane size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
