import api from '../../lib/api';

export const uploadRepository = {
    
    /*
        画像アップロード処理

        【目的】
        画像ファイルをサーバーに送信し、アップロードされた画像のURLを取得する。

        【処理フロー】
        1. new FormData()で、フォームの入力値やファイルをまとめて送信するための入れ物を作成する。
        2. 受け取った画像ファイルを'image'という項目名でFormDataに追加する。
        3. /uploadにPOSTリクエストを送信する。
            headersのContent-Typeに'multipart/form-data'を指定し、
            リクエスト本文がファイルを含むフォームデータ形式であることをサーバーに伝える。
        4. レスポンスから画像のURLを取り出して呼び出し元に返す。
    */

    async uploadImage(file: File): Promise<string> {

        const formData = new FormData();
        formData.append('image', file);

        const result = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
        
        return result.data.imageUrl;
    },
};