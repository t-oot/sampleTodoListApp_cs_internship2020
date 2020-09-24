var scope = 'https://www.googleapis.com/auth/tasks';
var accessToken = null;
var redirect_uri = 'http://localhost:8000';

/**
 * Google APIの認証
 */
var clickLoginButton = function () {
    // ログイン
    window.plugins.googleplus.login({
        'webClientId': clientId,
        'offline': true,
        'scopes': scope,
        'redirect_uri': redirect_uri,
    },
        function (obj) {
            // 認証
            $.post('https://www.googleapis.com/oauth2/v4/token', {
                'code': obj.serverAuthCode,
                'client_id': clientId,
                'client_secret': clientSecret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code',
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .done(function (data, status) {    // トークンの取得に成功
                    console.log(status, data);
                    accessToken = data.access_token;
                    // リフレッシュトークンを保存
                    window.localStorage.setItem("refresh_token", data.refresh_token);

                    // リスト画面に遷移
                    document.querySelector('#appNavigator')
                        .pushPage('toolbar.html', { animation: "fade" });
                })
                .fail(function (data, status) {    // トークンの取得に失敗
                    console.log(status, data);
                    accessToken = null;
                });
        },
        function (msg) {
            console.log("Error: " + msg);
        }
    );
};

/**
 * リフレッシュトークンからアクセストークンを再取得
 */
var getAccessTokenByRefreshToken = function () {
    $.post('https://www.googleapis.com/oauth2/v4/token', {
        'refresh_token': window.localStorage.getItem("refresh_token"),
        'client_id': clientId,
        'client_secret': clientSecret,
        'redirect_uri': redirect_uri,
        'grant_type': 'refresh_token',
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .done(function (data, status) {    // トークンの取得に成功
            accessToken = data.access_token;

            // リスト画面に遷移
            document.querySelector('#appNavigator')
                .pushPage('toolbar.html', { animation: "fade" });
        })
        .fail(function (data, status) {    // トークンの取得に失敗
            console.log(status, data);
            window.localStorage.removeItem("refresh_token");
            // ログインから再度実行
            clickLoginButton();
        });
}

/**
 * GET タスクリストを取得して表示する(Tasks: list)
 */
var getTaskslist = function () {
    if (!accessToken) {
        return;
    }

    // タスクを取得(デフォルトのリストを指定)
    $.get('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
        'access_token': accessToken
    })
        .done(function (data, status) {
            console.log(status, data);
            // 取得したタスクでリストを表示
            dispTasksList(data);
        })
        .fail(function (data, status) {
            console.log(status, data);
        });
};

/**
 * POST タスクを新規登録する(Tasks: insert)
 * @param {json} inputTask 登録するタスク情報
 */
var insertTask = function (inputTask) {
    if (!accessToken) {
        return;
    }

    var inputTask = inputTask;

    $.ajax({
        type: 'post',
        url: 'https://www.googleapis.com/tasks/v1/lists/@default/tasks?access_token=' + accessToken,
        data: JSON.stringify(inputTask), // 追加するタスク情報
        contentType: 'application/JSON',
        dataType: 'JSON',
        scriptCharset: 'utf-8',

        success: function (data, status) {
            console.log(status, data);
            getTaskslist();
        },

        error: function (data, status) {
            // Error
            console.log(status, data);
        }
    });
};

/**
 * PUT タスクを更新する(Tasks: update)
 * @param {string} task タスクID
 * @param {JSON} updateTask 変更するタスク情報
 */
var updateTasks = function (task, updateTask) {
    if (!accessToken) {
        return;
    }

    $.ajax({
        type: 'put',
        url: 'https://www.googleapis.com/tasks/v1/lists/@default/tasks/' + task + '?access_token=' + accessToken,
        data: JSON.stringify(updateTask), // 変更するタスク情報(idを含める)
        contentType: 'application/JSON',
        dataType: 'JSON',
        scriptCharset: 'utf-8',

        success: function (data, status) {
            console.log(status, data);
            getTaskslist();
        },

        error: function (data, status) {
            // Error
            console.log(status, data);
        }
    });
}