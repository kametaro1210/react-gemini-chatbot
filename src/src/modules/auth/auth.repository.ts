
import api from '../../lib/api';
import { User } from '../users/user.entity';


export const authRepository = {

/* 
    ユーザー登録（サインアップ）処理
    
    【処理概要】
    ユーザーの登録情報（名前、メールアドレス、パスワード）を受け取り、
    バックエンドのAPIにリクエストを送信して新規アカウントを作成します。
    成功時は、レスポンスに含まれるユーザー情報と認証トークンを返却します。
    
    【処理フロー】
    1. 引数として受け取った name, email, password をペイロードとして、POST 
        /auth/signup エンドポイントへAPIリクエストを送信する。
    2. レスポンスデータから user と token を抽出する。
    3. 取得したユーザーデータを User クラスのインスタンスに変換する。
    4. 変換した User インスタンスと token をオブジェクトにまとめて返却する。
*/

    async signup(
        name: string,
        email: string,
        password: string,
    ): Promise<{ user: User; token: string }> {
        const result = await api.post('/auth/signup', { name, email, password });
        const { user, token } = result.data;
        return { user: new User(user), token };
    },

/* 
    ログイン（サインイン）処理
    
    【処理概要】
    メールアドレスとパスワードを受け取り、
    バックエンドのAPIにリクエストを送信してログイン認証を行います。
    処理が完了するまでの「非同期処理の結果（将来得られるデータ）」を保証するため、
    Promise<{ user: User; token: string }> 型のオブジェクトを返却します。
    
    【処理フロー】
    1. 引数として受け取った email, password をペイロードとして、POST 
        /auth/signin エンドポイントへAPIリクエストを送信する。
    2. await を使い、サーバーからのレスポンス（Promiseの完了）を待機する。
    3. レスポンスデータから user と token を抽出する。
    4. 取得したユーザーデータを User クラスのインスタンスに変換する。
    5. 変換した User インスタンスと token をオブジェクトにまとめて返却する。
*/

    async signin(
        email: string,
        password: string,
    ): Promise<{ user: User; token: string }> {
        const result = await api.post('/auth/signin', { email, password });
        const { user, token } = result.data;
        return { user: new User(user), token };
    },
};