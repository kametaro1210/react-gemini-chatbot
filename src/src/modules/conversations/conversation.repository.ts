import api from '../../lib/api';
import { Conversation } from './conversation.entity';

export const conversationRepository = {
    
    // 新しい会話（部屋）を作成するAPIを呼び出す
    async create(): Promise<Conversation> {
        const { data } = await api.post('/conversations');
        return new Conversation(data);
    },

    // 保存されているすべての会話（部屋）の一覧を取得するAPIを呼び出す
    async findAll(): Promise<Conversation[]> {
        const { data } = await api.get('/conversations');
        return data.map((item: Conversation) => new Conversation(item));
    },

    // 指定されたIDに一致する特定の会話（部屋）の詳細情報を取得するAPIを呼び出す
    async findOne(id: string): Promise<Conversation> {
        const { data } = await api.get(`/conversations/${id}`);
        return new Conversation(data);
    },

    // 指定した会話のタイトルをAPI経由でデータベースに更新・保存する
    async updateTitle(id: string, title: string): Promise<Conversation> {
        const { data } = await api.patch(`/conversations/${id}`, { title });
        return new Conversation(data);
    },

    // 指定したIDの会話（部屋）を削除するAPIを呼び出す
    async delete(id: string): Promise<void> {
        await api.delete(`/conversations/${id}`);
    },
};