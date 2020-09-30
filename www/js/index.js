// 各ページの初期設定
document.addEventListener("init", function (event) {
  // 表示対象のページを取得
  var page = event.target;

  if (page.matches("#list-page")) {
    // タスクを取得
    getTaskslist();
  }
  if (page.matches("#list-page-completed")) {
    // 完了済みタスクを取得
    getTaskslist(true);
  } else {
    //暫定的。
    // 完了済みタスクを取得
    getTaskslistEdit();
  }
});

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
  // 認証済みかどうか判定
  if (window.localStorage.getItem("refresh_token")) {
    getAccessTokenByRefreshToken();
    window.cordova.plugins.backgroundMode.setEnabled(true); //バックグラウンド起動
    var watchID = GPSLocation.watchPosition(onSuccess, onError, {
      timeout: 600000,
    });
    cordova.plugins.notification.local.schedule({
      title: "TODOリストアプリの通知",
      text: "タスクに設定した位置に近くなると通知します",
      foreground: true,
    });
  } else {
    // ログイン画面を表示
    document
      .querySelector("#appNavigator")
      .pushPage("login.html", { animation: "fade" });
  }
}

function onSuccess(position) {
  var element = document.getElementById("geolocation");
  console.log(position.coords.latitude + "," + position.coords.longitude);
}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert("code: " + error.code + "\n" + "message: " + error.message + "\n");
}
