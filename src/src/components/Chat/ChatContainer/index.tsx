import { useState } from 'react';
import { HiOutlinePaperAirplane, HiOutlinePhoto } from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import { model } from '../../../lib/gemini';
import { messageRepository } from '../../../modules/messages/message.repository';
import MessageList from '../MessageList';
import './index.css';


export default function ChatContainer() {

  // 入力された文字を最初に空(''）の状態で保管しておき、
  // 文字が入力・変更されるたびに setInputText でその中身を新しい文字に書き換える
  const [inputText, setInputText] = useState('');

  // URLのパラメータから会話ID（conversationId）を取得する
  const { conversationId } = useParams();

  // AIからのレスポンス待機中かどうかを管理するフラグ
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {

    // 入力欄（inputText）の前後の空白を削除してメッセージを取得
    const currentMessage = inputText.trim();

    setIsLoading(true);

    try {
      await createUserMessage(currentMessage);
      setInputText(''); // 入力欄を空にする
      await createAiMessage(currentMessage);
    } catch (error) {
      console.error(error);
      alert('メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };


  const createUserMessage = async (content: string) => {
    const userMessage = await messageRepository.create(conversationId!, {
      role: 'user',
      content,
    });
    console.log('User message created:', userMessage);
  };

  const createAiMessage = async (content: string) => {

    // AIモデルにメッセージを送信し、応答を待ち、結果を取得する
    const result = await model.generateContent(content);
    console.log(result.response.text());

    const aiMessage = await messageRepository.create(conversationId!, {
      role: 'assistant',
      content: result.response.text(),
    });

    console.log(aiMessage);

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
          <button className="send-button" 
            onClick={handleSend}

            // APIが通信中(isLoadingがtrue)、または入力欄が空白の場合は送信ボタンを無効化する
            disabled={isLoading || (!inputText.trim())}
          >
            <HiOutlinePaperAirplane size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
