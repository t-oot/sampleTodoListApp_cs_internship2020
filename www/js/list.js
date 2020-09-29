var task_editid = "";
/**
 * 編集用タスクリスト表示
 * @param {JSON} data 表示するタスクのリスト
 */
var dispTasksListEdit = function (data) {
  // list_edit.htmlの<ons-list id="listView_edit">を取得
  var elem_list = document.getElementById("listView_edit");
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
        var elem_list_item = document.createElement("ons-list-item");
        // <ons-list-item>のHTML要素にタイトル名を追加
        elem_list_item.innerHTML =
          `
        <label class="left">
        <ons-icon icon="md-edit">
      </label>
      <label for="check-1" class="center">
        ` +
          taskTitle +
          `
      </label>`;
        elem_list_item.addEventListener("click", {
          title: taskTitle,
          id: data.items[i].id,
          handleEvent: createEditDialog,
        }); //タップ時
        console.log(elem_list_item.innerHTML);
        // <ons-list-item>タスクをリストに追加
        elem_list.appendChild(elem_list_item);
      }
    }
  }

  //編集するTODOのリストプルフック
  var pullHook = document.getElementById("pull-hook-edit");

  pullHook.addEventListener("changestate", function (event) {
    var message = "";

    switch (event.state) {
      case "initial":
        message = "スワイプして更新";
        break;
      case "preaction":
        message = "離してください";
        break;
      case "action":
        message = "更新中...";
        break;
    }

    pullHook.innerHTML = message;
  });

  pullHook.onAction = function (done) {
    getTaskslistEdit(done);
  };
};

/**
 * 完了したタスクリスト表示
 * @param {JSON} data 表示するタスクのリスト
 */
var dispTasksListCompleted = function (data) {
  // page2.htmlの<ons-list id="listView_completed">を取得
  var elem_list = document.getElementById("listView_completed");
  // 子要素を全て削除
  elem_list.textContent = null;

  /**
   * タスクの数に応じて一覧を作成
   */
  for (var i = 0; i < data.items.length; i++) {
    // タスクの状態がcompleted(=完了)の場合
    if (data.items[i].status === "completed") {
      // タスクのタイトルを取得
      var taskTitle = data.items[i].title;

      // タスクのタイトルがあるとき
      if (taskTitle) {
        // 空の<ons-list-item>を作成
        var elem_list_item = document.createElement("ons-list-item");
        // <ons-list-item>のHTML要素にタイトル名を追加
        elem_list_item.innerHTML =
          `
        <label class="left">
        <ons-checkbox input-id="check-` +
          i +
          `" onchange='inCompleteTask(` +
          JSON.stringify(data.items[i]) +
          `)' checked></ons-checkbox>
      </label>
      <label for="check-1" class="center">
        ` +
          taskTitle +
          `
      </label>`;
        console.log(elem_list_item.innerHTML);
        // <ons-list-item>タスクをリストに追加
        elem_list.appendChild(elem_list_item);
      }
    }
  }

  //完了したTODOのリストプルフック
  pullHook = document.getElementById("pull-hook-done");

  pullHook.addEventListener("changestate", function (event) {
    var message = "";

    switch (event.state) {
      case "initial":
        message = "スワイプして更新";
        break;
      case "preaction":
        message = "離してください";
        break;
      case "action":
        message = "更新中...";
        break;
    }

    pullHook.innerHTML = message;
  });

  pullHook.onAction = function (done) {
    getTaskslist(true, done);
  };
};

/**
 * タスクリスト表示
 * @param {JSON} data 表示するタスクのリスト
 */
var dispTasksList = function (data) {
  // list.htmlの<ons-list id="listView">を取得
  var elem_list = document.getElementById("listView");
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
        var elem_list_item = document.createElement("ons-list-item");
        // <ons-list-item>のHTML要素にタイトル名を追加
        elem_list_item.innerHTML =
          `
        <label class="left">
        <ons-checkbox input-id="check-` +
          i +
          `" onchange='CompleteTask(` +
          JSON.stringify(data.items[i]) +
          `)' ></ons-checkbox>
      </label>
      <label for="check-1" class="center">
        ` +
          taskTitle +
          `
      </label>`;
        console.log(elem_list_item.innerHTML);
        // <ons-list-item>タスクをリストに追加
        elem_list.appendChild(elem_list_item);
      }
    }
  }
  //進行中のTODOのリストプルフック
  var pullHook = document.getElementById("pull-hook");

  pullHook.addEventListener("changestate", function (event) {
    var message = "";

    switch (event.state) {
      case "initial":
        message = "スワイプして更新";
        break;
      case "preaction":
        message = "離してください";
        break;
      case "action":
        message = "更新中...";
        break;
    }

    pullHook.innerHTML = message;
  });

  pullHook.onAction = function (done) {
    getTaskslist(false, done);
  };
};
/**
 * タスクを完了させる
 *  @param {int} id 完了させようとするタスクのID
 */
var CompleteTask = function (task) {
  task["status"] = "completed";
  updateTasks(task["id"], task);
};

/**
 * タスクを未完了させる
 *  @param {int} id 完了させようとするタスクのID
 */
var inCompleteTask = function (task) {
  task["status"] = "needsAction";
  updateTasks(task["id"], task);
};

/**
 * タスク編集
 */
var editTask = function () {
  // 入力値の取得
  item = document.getElementById("edit_task_title").value;

  if (!accessToken) {
    return;
  }
  //何も入力されていない場合は追加しない(空白文字列との厳密な比較)
  if (item === "") {
    hideEditDialog();
    //Toast_error.show();
    ons.notification.toast("タイトルが入力されていません", { timeout: 2000 }); //2秒間トースト表示
    return;
  }
  var inputTask = {
    title: item,
  };

  $.ajax({
    type: "get",
    url:
      "https://www.googleapis.com/tasks/v1/lists/@default/tasks/" +
      task_editid +
      "?access_token=" +
      accessToken,
    contentType: "application/JSON",
    dataType: "JSON",
    scriptCharset: "utf-8",

    success: function (data, status) {
      console.log(status, data);
      data["title"] = item;
      $.ajax({
        type: "put",
        url:
          "https://www.googleapis.com/tasks/v1/lists/@default/tasks/" +
          task_editid +
          "?access_token=" +
          accessToken,
        data: JSON.stringify(data), // 変更するタスク情報(idを含める)
        contentType: "application/JSON",
        dataType: "JSON",
        scriptCharset: "utf-8",

        success: function (data, status) {
          console.log(status, data);
          hideEditDialog();
          g.etTaskslistEdit();
        },

        error: function (data, status) {
          // Error
          console.log(status, data);
        },
      });
    },

    error: function (data, status) {
      // Error
      console.log(status, data);
    },
  });
};

/**
 * タスク追加
 */
var addTask = function () {
  // 入力値の取得
  item = document.getElementById("input_task_title").value;

  if (!accessToken) {
    return;
  }
  //何も入力されていない場合は追加しない(空白文字列との厳密な比較)
  if (item === "") {
    hideInsertDialog();
    //Toast_error.show();
    ons.notification.toast("タイトルが入力されていません", { timeout: 2000 }); //2秒間トースト表示
    return;
  }
  var inputTask = {
    title: item,
  };

  $.ajax({
    type: "post",
    url:
      "https://www.googleapis.com/tasks/v1/lists/@default/tasks?access_token=" +
      accessToken,
    data: JSON.stringify(inputTask), // 追加するタスク情報
    contentType: "application/JSON",
    dataType: "JSON",
    scriptCharset: "utf-8",

    success: function (data, status) {
      console.log(status, data);
      if (document.getElementById("map_check").checked) {
        data["notes"] = map.center.toString();
        $.ajax({
          type: "put",
          url:
            "https://www.googleapis.com/tasks/v1/lists/@default/tasks/" +
            data["id"] +
            "?access_token=" +
            accessToken,
          data: JSON.stringify(data), // 変更するタスク情報(idを含める)
          contentType: "application/JSON",
          dataType: "JSON",
          scriptCharset: "utf-8",

          success: function (data, status) {
            console.log(status, data);
            hideInsertDialog();
            getTaskslist(); // リストを更新
            getTaskslist(true);
          },

          error: function (data, status) {
            // Error
            console.log(status, data);
          },
        });
      } else {
        hideInsertDialog();
        getTaskslist(); // リストを更新
        getTaskslist(true);
      }
    },

    error: function (data, status) {
      // Error
      console.log(status, data);
    },
  });
};

/**
 * タスク編集ダイアログを表示
 */
var createEditDialog = function (e) {
  task_editid = this.id;
  var dialog = document.getElementById("edit-task");
  var that = this;
  if (dialog) {
    dialog.show();
    document.getElementById("edit_task_title").value = that.title;
  } else {
    ons
      .createElement("edit_task_dialog.html", { append: true })
      .then(function (dialog) {
        dialog.show();
        document.getElementById("edit_task_title").value = that.title;
      });
  }
};

/**
 * タスク編集ダイアログを非表示
 */
var hideEditDialog = function () {
  document.getElementById("edit-task").hide();
  document.getElementById("edit_task_title").value = "";
};

/**
 * タスク追加ダイアログを表示
 */
var createInsertDialog = function () {
  var dialog = document.getElementById("insert-task");

  if (dialog) {
    dialog.show();
  } else {
    ons
      .createElement("insert_task_dialog.html", { append: true })
      .then(function (dialog) {
        dialog.show().then(function () {
          initMap();
        });
      });
  }
};

/**
 * タスク追加ダイアログを非表示
 */
var hideInsertDialog = function () {
  document.getElementById("insert-task").hide();
  document.getElementById("input_task_title").value = "";
};
/**
 * 編集画面へ移動
 */
var openEditor = function () {
  var elem_list = document.getElementById("listView");
  // 子要素を全て削除
  if (elem_list) elem_list.textContent = null;
  elem_list = document.getElementById("listView_completed");
  // 子要素を全て削除
  if (elem_list) elem_list.textContent = null;
  document
    .querySelector("#appNavigator")
    .pushPage("toolbar_edit.html", { animation: "fade" });
};
/**
 * TODOリスト画面に戻る
 */
var showTODOList = function () {
  document
    .querySelector("#appNavigator")
    .popPage()
    .then(function () {
      getTaskslist(); // リストを更新
      getTaskslist(true);
    });
};

var toggleMap = function (e) {
  document.getElementById("wrap").hidden = !e.checked;
};
