
// メッセージの送信者を定義する型（ユーザー、またはAIアシスタント）
export type MessageRole = 'user' | 'assistant';

export class Message {
    id!: string;               // メッセージ固有のID
    conversationId!: string;   // 所属する会話のID
    role!: MessageRole;        // 送信者の役割（user または assistant）
    content!: string;          // メッセージの本文
    imageUrl?: string;         // 添付された画像のURL（オプション）
    createdAt!: Date;          // メッセージの作成日時

    constructor(data: Message) {

        // 渡されたデータの項目(data)を、そのままメッセージオブジェクト(this)にコピーする
        Object.assign(this, data);

        // 文字列のcreatedAtをDate型に変換して上書き
        this.createdAt = new Date(data.createdAt);
    }
}