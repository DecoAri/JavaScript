let xy = {};
xy.city = "重庆市";
xy.district = "区";
xy.lat = 100.75648332114813;
xy.lng = 107.2709211714478;
xy.province = "重庆";
xy.street = "大道";
(async function() {
    await token();
    await task();
    await status();
    if(xy.data == 0) {
        $notification.post("签到未开始", xy.id, "");
        $httpClient.post({
          url: 'https://sctapi.ftqq.com/SCT87132TpuhLxVx2dJZnsvyVfs0fYejf.send',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: 'title=签到未开始&desp=' + xy.id
        })
    } else if(xy.data == 1) {
        await submit();
        $notification.post("习柚", xy.msgs, "");
        $httpClient.post({
          url: 'https://sctapi.ftqq.com/SCT87132TpuhLxVx2dJZnsvyVfs0fYejf.send',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: 'title=习柚' + xy.msgs + '&desp=' + xy.msgs
        })
    } else if(xy.data == "-1") {
        $notification.post("习柚", xy.msg, "");
        $httpClient.post({
          url: 'https://sctapi.ftqq.com/SCT87132TpuhLxVx2dJZnsvyVfs0fYejf.send',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: 'title=习柚&desp=' + xy.msg
        })
    } else {
        $notification.post("错误", "网络或其他错误,需重新运行", "");
        $httpClient.post({
          url: 'https://sctapi.ftqq.com/SCT87132TpuhLxVx2dJZnsvyVfs0fYejf.send',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: 'title=错误&desp=网络或其他错误,需重新运行'
        })
    }
    $done()
})();

function token() {
    const loginurl = {
        url: 'https://www.yunzhixiyou.com/api/sys/manage/login',
        headers: {
            'User-Agent' : 'xiyou/4.2.2 2280 ios14.3 (iPhone 6s Plus)',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: 'password=00000&schoolId=000&username=0000000'
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

function status() {
    const statusurl = {
        url: 'https://www.yunzhixiyou.com/api/sign/isSignOrNoSignInt',
        headers: {
            'User-Agent' : 'xiyou/4.2.2 2280 ios14.3 (iPhone 6s Plus)',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
            'token' : xy.token
        },
        body: 'taskId=' + xy.id
    };
    return new Promise(function(resolve) {
        $httpClient.post(statusurl, function(error, resp, body) {
            xy.data =JSON.parse(body).result;
            console.log(body);
            xy.msg = JSON.parse(body).msg;
            resolve();
        });
    });
}

function submit() {
    const submiturl = {
        url: 'https://www.yunzhixiyou.com/api/sign/signIn',
        headers: {
            'User-Agent' : 'xiyou/4.2.2 2280 ios14.3 (iPhone 6s Plus)',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
            'token' : xy.token
        },
        body: "city=" + xy.city + "&district=" + xy.district + "&lat=" + xy.lat + "&lng=" + xy.lng + "&phoneUuid=uuid&province=" + xy.province + "&signStatus=1&street=" + xy.street + "&taskId=" + xy.id + "&type=1"
    };
    return new Promise(function(resolve) {
        $httpClient.post(submiturl, function(error, resp, body) {
            xy.msgs = JSON.parse(body).msg;
            resolve();
        });
    });
}