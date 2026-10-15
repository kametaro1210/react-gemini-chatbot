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

    // 指定したIDの会話（部屋）を削除するAPIを呼び出す
    async delete(id: string): Promise<void> {
        await api.delete(`/conversations/${id}`);
    },
};