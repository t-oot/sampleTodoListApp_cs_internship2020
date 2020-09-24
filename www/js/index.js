// 各ページの初期設定
document.addEventListener('init', function (event) {
  // 表示対象のページを取得
  var page = event.target;

  if (page.matches('#list-page')) {
    // タスクを取得
    getTaskslist();
  }
});

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
  // 認証済みかどうか判定
  if (window.localStorage.getItem("refresh_token")) {
    getAccessTokenByRefreshToken();
  } else {
    // ログイン画面を表示
    document.querySelector('#appNavigator').pushPage('login.html', { animation: "fade" });
  }
}
