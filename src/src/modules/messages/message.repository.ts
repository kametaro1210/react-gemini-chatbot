import api from '../../lib/api';
import { Message, type MessageRole } from './message.entity';


/* 
メッセージ作成時に渡すパラメータのデータ構造
    
【概要】
メッセージを作成する関数（create）の引数として受け取るデータの形を定義します。
    
【含まれる項目】
- role: メッセージの送信者（MessageRole型）
- content: メッセージの本文（string型）
- imageUrl?: 添付画像のURL（省略可能なstring型）
*/

interface CreateParams {
    role: MessageRole;
    content: string;
    imageUrl?: string;
}

export const messageRepository = {

    /* 
    メッセージ作成処理
    
    【処理概要】
    会話IDとメッセージのパラメータを受け取り、バックエンドのAPIにPOSTリクエストを送信して
    新しいメッセージを作成します。
    成功時は、レスポンスから取得したデータをMessageクラスのインスタンスに変換して返却します。
    
    【処理フロー】
    1. await を使ってAPIからのレスポンスを待機しつつ、指定されたエンドポイントへリクエストを送信する。
        （※非同期処理の完了を待つため Promise<Message> として結果を返す）
    2. サーバーから返ってきたレスポンスデータ（data）を抽出する。
    3. 取得したデータ(定数 : data)を Message クラスのインスタンスに変換する。
    4. 変換した Message インスタンスを呼び出し元に返却する。
    */

    async create(conversationId: string, params: CreateParams): Promise<Message> {
        const { data } = await api.post(
        `/conversations/${conversationId}/messages`,
        params,
        );
        return new Message(data);
    },
};