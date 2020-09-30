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
//位置情報の取得結果
function onSuccess(position) {
  //console.log(position.coords.latitude + "," + position.coords.longitude);
  for (const [key, value] of Object.entries(task_geo)) {
    if (task_geo[key]["notified"]) continue;
    var dist =
      distance(
        value.latlng[0],
        value.latlng[1],
        position.coords.latitude,
        position.coords.longitude
      ) * 1000;
    if (dist <= 100) {
      //100m以下で通知
      task_geo[key]["notified"] = true;
      cordova.plugins.notification.local.schedule({
        title: "TODO",
        text: value.title,
        foreground: true,
      });
    }
  }
}

//位置情報取得エラー
function onError(error) {
  alert("code: " + error.code + "\n" + "message: " + error.message + "\n");
}
//2点間の緯度経度距離
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return (
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    )
  );
}
