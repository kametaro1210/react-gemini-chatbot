import api from '../../lib/api';
import { Conversation } from './conversation.entity';

export const conversationRepository = {
    async create(): Promise<Conversation> {
        const { data } = await api.post('/conversations');
        console.log('testの表示:', data);
        return new Conversation(data);
    },
};