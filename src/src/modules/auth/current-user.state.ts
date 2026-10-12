import { atom } from 'jotai';
import type { User } from '../users/user.entity';

/* 
    現在ログイン中のユーザー情報をアプリ全体で共有・管理するためのグローバルステート（Atom）
    
    【処理概要】
    Jotaiの atom 関数を使用して、アプリケーション全体のどこからでもアクセスできる状態（Atom）を定義。
    ユーザーの名前やメールアドレスなどのデータ構造をまとめた User 型を保持する箱として機能する。
    
    【コードの構成】
    1. atom: アプリ全体で共有するデータ（状態）の箱を作るための関数。
    2. User型: ユーザーが持つデータ（名前やメールアドレスなど）の組み合わせ方を定義した型。
    3. currentUserAtom: ログイン中のユーザー情報を保管・共有するためのグローバルステート（初期値は未設定）。
*/

export const currentUserAtom = atom<User>();