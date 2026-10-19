import { useEffect, useState } from 'react';
import { HiOutlinePaperAirplane, HiOutlinePhoto } from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import { model } from '../../../lib/gemini';
import { conversationRepository } from '../../../modules/conversations/conversation.repository';
import type { Message } from '../../../modules/messages/message.entity';
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

  // データベースから取得したチャットメッセージの配列を管理
  // NOTE: fetchMessages等で非同期取得したデータや新着メッセージで随時更新される
  const [messages, setMessages] = useState<Message[]>([]);

  /*
    会話履歴の読み込み処理

    【目的】
    チャットを開いたときと別の会話に切り替えたときに、その会話の履歴を読み込む。
    取得処理をコンポーネント本体に書くと、入力欄の変更などで再描画されるたびに
    API通信が発生する。そのためuseEffectを使い、conversationIdの変更を監視する。

    【処理フロー】
    1. 初回表示後とconversationId変更後にuseEffectが動き、fetchMessagesを呼び出す。
    2. void fetchMessages()で取得を始める。取得結果は関数内でstateに保存するため、戻り値は使わない。
    3. conversationIdがなければ終了し、あればfindOne()でその会話を取得する。
    4. 取得したmessagesをstateに保存する。データがなければ空配列を保存する。
    5. 取得に失敗した場合はcatchでエラーをコンソールに出力する。
  */

  useEffect(() => {
    const fetchMessages = async () => {

      // URLにルームIDがない場合は何も処理をしない
      if (!conversationId) return;

      try {
        const conversation = await conversationRepository.findOne(conversationId);
        setMessages(conversation.messages || []);
      } catch (error) {
        console.error(error);
      }
    };

    // useEffectからPromiseを返さず、メッセージ取得を開始する
    void fetchMessages();
  }, [conversationId]);

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

    // 既存のメッセージ配列の末尾に、新しく送信されたユーザーのメッセージを追加して状態を更新
    // Memo : prevは更新前のメッセージ配列を指し、userMessageを末尾に加えた配列を返す
    setMessages((prev) => [...prev, userMessage]);

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

    // 既存のメッセージ配列の末尾に、AIからの新しい返答メッセージを追加して状態を更新
    // Memo : prevは更新前のメッセージ配列を指し、aiMessageを末尾に加えた配列を返す
    setMessages((prev) => [...prev, aiMessage]);
    
    console.log(aiMessage);

  }

  return (
    <div className="chat-container">
      
      {/* stateで管理しているメッセージ一覧を渡し、チャット履歴を表示する */}
      <MessageList messages={messages} />

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
