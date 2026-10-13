import { atom } from 'jotai';
import type { Conversation } from './conversation.entity';

/**
 * 複数コンポーネント間で共有して参照・更新できる「会話一覧」のグローバルな状態管理（Atom）
 * - 初期値: 空の配列（[]）
 * - 用途: サイドバーでの会話一覧表示や、チャット作成・削除時の状態同期に使用
 */

export const conversationsAtom = atom<Conversation[]>([]);