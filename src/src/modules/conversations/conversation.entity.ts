import { Message } from '../messages/message.entity';

// 会話と、その会話に属するメッセージのデータを表すクラス
export class Conversation {
    id!: string;                // 会話固有のID
    userId!: string;            // 会話を所有するユーザーのID
    title?: string;             // 会話のタイトル（オプション）
    createdAt!: Date;           // 会話の作成日時
    updatedAt!: Date;           // 会話の最終更新日時
    messages?: Message[];       // 会話に属するメッセージの一覧（オプション）

    constructor(data: Conversation) {
        // 渡されたデータの項目を、会話オブジェクト(this)にコピーする
        Object.assign(this, data);

        // 文字列の日時をDate型に変換して上書き
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);

        // メッセージがあればMessageインスタンスに変換し、未指定なら空配列にする
        this.messages = data.messages?.map((message) => new Message(message)) || [];
    }
}