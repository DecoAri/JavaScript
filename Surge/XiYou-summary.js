let xy = {};
xy.body = "all",
(async function() {
    await token();
    await task();
    await submit()
    $done()
})();

function token() {
    const loginurl = {
        url: 'https://www.yunzhixiyou.com/api/sys/manage/login',
        headers: {
            'User-Agent' : 'xiyou/4.2.2 2280 ios14.3 (iPhone 6s Plus)',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: 'password=000000&schoolId=00000&username=00000'
    };
    return new Promise(function(resolve) {
        $httpClient.post(loginurl, function(error, resp, data) {
            xy.token =JSON.parse(data).token;
            resolve();
        });
    });
}

function task() {
    const taskurl = {
        url: 'https://www.yunzhixiyou.com/api/task/getTopTask',
        headers: {
            'User-Agent' : 'xiyou/4.2.2 2280 ios14.3 (iPhone 6s Plus)',
            'token' : xy.token
        },
    };
    return new Promise(function(resolve) {
        $httpClient.get(taskurl, function(error, resp, data) {
            xy.id = JSON.parse(data).data[0].id;
            resolve();
        });
    });
}

function submit() {
    let content = `<div>&nbsp;<span style="font-size: 12pt; -webkit-text-size-adjust: 100%;">&nbsp;<font color="#333333"><span style="caret-color: rgb(51, 51, 51);">` + xy.body
    xy.content = encodeURIComponent(content)
    xy.sign = encodeURI("</span></font></span></div>")
    const submiturl = {
        url: 'https://www.yunzhixiyou.com/api/summary/publish',
        headers: {
            'User-Agent' : 'xiyou/4.2.2 2280 ios14.3 (iPhone 6s Plus)',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
            'token' : xy.token
        },
        body: "content=" + xy.content + xy.sign + "&taskId=" + xy.id
    };
    return new Promise(function(resolve) {
        $httpClient.post(submiturl, function(error, resp, body) {
            xy.msg = JSON.parse(body).msg;
            console.log(body)
            $notification.post("习柚总结", xy.msg, "")
            resolve();
        });
    });
}