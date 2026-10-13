import { useAtom } from 'jotai';
import ConversationItem from '../ConversationItem';
import './index.css';
import { conversationsAtom } from '../../../modules/conversations/conversation.state';
import { conversationRepository } from '../../../modules/conversations/conversation.repository';
import { useEffect } from 'react';

export default function ConversationList() {

  // conversationsAtomから現在の会話一覧を取得し、setConversationsで会話一覧を更新する
  const [conversations, setConversations] = useAtom(conversationsAtom);

  /**
   * コンポーネントがマウントされた（画面に初めて表示された）タイミングで1度だけ実行される処理
   * - データベースから会話一覧のデータを取得し、setConversationsでグローバル状態を更新する
   */

  useEffect(() => {
      // 非同期で会話一覧データを取得する内部関数
      const fetchConversations = async () => {
        try {
          // リポジトリ経由でサーバー（API）からすべての会話データを取得する
          const data = await conversationRepository.findAll();

          // 取得した会話データをJotaiのグローバル状態（setConversations）にセットし、画面に反映させる
          setConversations(data);
        } catch (error) {

          // データ取得に失敗した場合は、エラーをコンソールに出力する
          console.error(error);

        }
      };

    // 上記で定義したデータ取得関数を実行する
    fetchConversations();
  }, [setConversations]); // setConversationsが変更されない限り、初回マウント時のみ実行される

  return (

    // conversationsの各要素を順番に取り出し、1件ずつチャットルームの項目を画面に表示する
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
