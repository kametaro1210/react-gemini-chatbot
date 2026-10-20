import { useEffect, useRef } from 'react';
import type { Message } from '../../../modules/messages/message.entity';
import TypingIndicator from '../TypingIndicator';
import './index.css';

// MessageListが親コンポーネントから受け取るデータ（props）の形を定義する。
interface MessageListProps {
  messages: Message[];
  streamingText: string;
  isStreaming: boolean;
}

/*
  メッセージ一覧の表示処理

  【処理概要】
  親コンポーネント(ChatContainer)から受け取ったmessagesを1件ずつ表示する。
  roleに応じてユーザーとAIの配置・見た目を切り替え、本文が空のときは吹き出しを表示しない。

  【処理フロー】
  1. messagesをmapで順番に処理する。
  2. 各メッセージのroleを判定し、ユーザー用またはAI用のクラスを設定する。
  3. メッセージ固有のidをkeyに指定し、Reactが一覧の各要素を識別できるようにする。
  4. contentがある場合だけ、本文を吹き出しとして表示する。
*/

export default function MessageList({ 
  messages,
  streamingText,
  isStreaming,
}: MessageListProps) {

  // 一番下へスクロールするための目印となるdiv要素を参照するRef
  // Memo : スクロール位置の基準にするため、対象のdiv要素（のDOM）をuseRefで保持しておく
  const bottomRef = useRef<HTMLDivElement>(null);

  // messages（メッセージ一覧）の変更を検知してuseEffectを発火させ、
  // 画面の一番下（bottomRefの位置）までスムーズに自動スクロールさせる
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (

    <div className="message-list">
      {messages.map((message) => {

        // roleを判定し、以降の配置と見た目の切り替えに使う
        const isUser = message.role === 'user';

        // message.idで各メッセージを識別し、isUserで行のスタイルを切り替える
        return (
          <div
            key={message.id}
            className={`message-item ${isUser ? 'message-item-user' : 'message-item-ai'}`}
          >

            {/* isUserの値に応じて、メッセージ内容の配置を切り替える */}
            <div
              className={`message-content-stack ${isUser ? 'stack-user' : 'stack-ai'}`}
            >

              {/* message.contentがある場合だけ吹き出しを表示する */}
              {message.content && (
                <div
                  className={`message-bubble ${isUser ? 'message-user' : 'message-ai'}`}
                >
                  {/* isUserがtrueならユーザー用、falseならAI用の吹き出しスタイルを適用する */}
                  {message.content}
                </div>
              )}
            </div>
          </div>
        );
      })}


      {/* ストリーミング中、または表示するテキストがある場合にAIのメッセージ欄を表示 */}
      {(isStreaming || streamingText) && (
        <div className="message-item message-item-ai">
          <div className="message-bubble message-ai">

            {/* 受信したAIのテキストを表示 */}
            {streamingText}

            {/* ストリーミング中かつテキストがまだない場合に
            ローディング表示（TypingIndicator）を行い、それ以外は何も描画しない */}
            {(() => {
              if (isStreaming && !streamingText) {
                return <TypingIndicator />;
              }
              return null;
            })()}

            {/* 論理演算子で記述する場合 */}
            {/* {isStreaming && !streamingText && <TypingIndicator />} */}

          </div>
        </div>
      )}

      {/* 一番下へのスクロール用の目印 */}
      <div ref={bottomRef} /> 

    </div>
  );
}
