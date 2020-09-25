# アプリセットアップ方法

前回の課題で作成したクライアントIDとクライアントシークレットを使用する。  
Android Studioでエミュレーターが実行できる環境であることを前提とする。  
Androidエミュレータか、実機でしかGoogleログインの機能が使えないので注意。

1. config.xmlの以下の記述のvalueを変更する。  
WEB_APPLICATION_CLIENT_ID：作成したクライアントID(●●●●●●-●●●●●●●●●●●●●●●●.apps.googleusercontent.com)  
REVERSED_CLIENT_ID：クライアント IDの「.」で区切られた文字列の順序を入替えた値(com.googleusercontent.apps.●●●●●●-●●●●●●●●●●●●●●●●)  
```
<plugin name="cordova-plugin-googleplus" source="npm">
    <variable name="REVERSED_CLIENT_ID" value="" />
    <variable name="WEB_APPLICATION_CLIENT_ID" value="" />
</plugin>
```

2. index.jsファイルのあるjsフォルダにenv.jsファイルを作成

3. envファイルに以下を記述（作成した～は適宜変更）
```
var clientId = 'クライアントID';
var clientSecret = 'クライアントシークレット';
```

4. プロジェクトのディレクトリをコマンドラインで開き、  
「npm install」、「cordova prepare」を実行する。

5. 実行が終わったら、Androidエミュレーターを起動させた状態で、VSCodeより  
「Run Android on emulator」でアプリを実行する。ログイン画面が表示されればOK

6. config.xml、package.jsonに記載されている、  
WEB_APPLICATION_CLIENT_ID、REVERSED_CLIENT_IDの値を削除する（githubで公開しないため）

7. Androidアプリの証明書格納ファイルを作成する。以下のコマンドをコマンドプロンプトで実行する。  
パスワードを求められるが、そのままエンターを押すと証明書が表示される。  
「証明書のフィンガプリント」の欄の、「SHA1」の値をファイルにコピーしておく。
```
cd C:\Program Files\Android\Android Studio\jre\bin
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore"
```

8. Google API使用手順資料のp.4「認証情報を作成」の項目を参考に、  
AndoridのOAuth クライアント IDを作成する。アプリケーションの種類でAndroidを選択する。  
以下の項目を設定する。
* 名前：任意の名前
* パッケージ名：com.oauthtestapp
* 署名証明書フィンガープリント：上記で取得した「SHA1」認証キー

9. アプリ側のログインボタンから、Googleログイン認証が完了できればOK
