/**
 * タスクリスト表示
 * @param {JSON} data 表示するタスクのリスト
 */
var dispTasksList = function (data) {
  // list.htmlの<ons-list id="listView">を取得
  var elem_list = document.getElementById('listView');
  // 子要素を全て削除
  elem_list.textContent = null;

  /**
   * タスクの数に応じて一覧を作成
   */
  for (var i = 0; i < data.items.length; i++) {
    // タスクの状態がneedsAction(=未完了)の場合
    if (data.items[i].status === "needsAction") {
      // タスクのタイトルを取得
      var taskTitle = data.items[i].title;

      // タスクのタイトルがあるとき
      if (taskTitle) {
        // 空の<ons-list-item>を作成
        var elem_list_item = document.createElement('ons-list-item');
        // <ons-list-item>のHTML要素にタイトル名を追加
        elem_list_item.innerHTML = taskTitle;
        // <ons-list-item>タスクをリストに追加
        elem_list.appendChild(elem_list_item);
      }
    }
  }
}

/**
 * タスク追加
 */
var addTask = function () {
  // TODO
};

/**
 * タスク追加ダイアログを表示
 */
var createInsertDialog = function () {
  // TODO
};

// タスク追加ダイアログを非表示
var hideInsertDialog = function () {
  // TODO
};
