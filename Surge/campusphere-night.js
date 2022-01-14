let cp = {};
cp.long = $persistentStore.read("经度");
cp.la = $persistentStore.read("纬度");
cp.location = $persistentStore.read("地区");
(async function() {
    await login();
    await wid();
    await form()
    await submit()
    $done()
})();
function login() {
    const loginurl = {
        url: 'http://' + $persistentStore.read("ip") + ':8080/wisedu-unified-login-api-v1.0/api/login?login_url=http%3A%2F%2Fauthserver.' + $persistentStore.read("学校") + '.cn%2Fauthserver%2Flogin%3Fservice%3Dhttps%253A%252F%252F' + $persistentStore.read("学校") + '.campusphere.net%252Fiap%252FloginSuccess&password=' + $persistentStore.read("密码") + '&username=' + $persistentStore.read("账号"),
    };
    return new Promise(function(resolve) {
        $httpClient.post(loginurl, function(error, resp, data) {
            console.log(resp.status)
            if (resp.status != 200) {
                login()
            } else {
                let jsonData = JSON.parse(data);
                console.log(jsonData.msg)
                if (jsonData.msg != "login success!") {
                    login()
                } else {
                    let cookies = jsonData.cookies
                    let regex = /route.*MOD_AUTH_CAS/
                    cp.cookie = cookies.replace(regex, "MOD_AUTH_CAS")
                    console.log('\n' + cp.cookie)
                    resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成
                }
            }
        });
    });
}

function wid() {
    const widurl = {
        url: 'https://' + $persistentStore.read("学校") + '.campusphere.net/wec-counselor-sign-apps/stu/sign/getStuSignInfosInOneDay',
        headers: {
          'Cookie' : cp.cookie,
          'Content-Type' : `application/json;charset=utf-8`
        },
        body: '{}'
    };
    return new Promise(function(resolve) {
        $httpClient.post(widurl, function(error, resp, data) {
            let jsonData = JSON.parse(data);
            console.log('\n' + data)
            cp.leave = jsonData["datas"].leaveTasks[0]
            if (cp.leave == undefined) {
              cp.wid = jsonData["datas"].unSignedTasks[0].signInstanceWid
              cp.signWid = jsonData["datas"].unSignedTasks[0].signWid
            } else {
              cp.wid = jsonData["datas"].leaveTasks[0].signInstanceWid
              cp.signWid = jsonData["datas"].leaveTasks[0].signWid
            }
            resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成
        });
    });
}

function form() {
    const formurl = {
      url: 'https://' + $persistentStore.read("学校") + '.campusphere.net/wec-counselor-sign-apps/stu/sign/detailSignInstance',
      headers: {
        'Cookie' : cp.cookie,
        'Content-Type' : 'application/json;charset=utf-8'
      },
      body: `{
        "signWid": ${cp.signWid},
        "signInstanceWid": ${cp.wid}
      }`,
    };
    return new Promise(function(resolve) {
        $httpClient.post(formurl, function(error, resp, data) {
            let jsonData = JSON.parse(data);
            cp.formWid = jsonData.datas.extraField[0].extraFieldItems[0].wid
            cp.formcontent = jsonData.datas.extraField[0].extraFieldItems[0].content
            resolve();
        })
    })
}
function submit() {
    const bodys = {
      "position": `${cp.location}`,
      "isMalposition": 1,
      "extraFieldItems": [
        {
          "extraFieldItemWid": `${cp.formWid}`,
          "extraFieldItemValue": `${cp.formcontent}`
        }
      ],
      "longitude": `${cp.long}`,
      "latitude": `${cp.la}`,
      "abnormalReason": "",
      "signInstanceWid": `${cp.wid}`,
      "isNeedExtra": 1,
      "signPhotoUrl": `${$persistentStore.read("照片")}`,
      "uaIsCpadaily": false
    }
    const submiturl = {
        url: 'https://' + $persistentStore.read("学校") + '.campusphere.net/wec-counselor-sign-apps/stu/sign/submitSign',
        headers: {
          'Cookie' : cp.cookie,
          'Content-Type' : 'application/json;charset=utf-8'
        },
        body: JSON.stringify(bodys)
    };
    return new Promise(function(resolve) {
        $httpClient.post(submiturl, function(error, resp, data) {
            let jsonData = JSON.parse(data);
            cp.msg = jsonData.message
            console.log(cp.msg)
            $httpClient.post({
                url: 'https://sctapi.ftqq.com/' + $persistentStore.read("server酱") + '.send',
                header: {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body: 'title=今日校园' + cp.msg + '&desp=今日校园'
            }, function(error,resp,data) {
                let jsonData = JSON.parse(data)
                console.log('\n' + jsonData.message)
                $notification.post("今日校园", cp.msg, jsonData.message)
                resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成
            })
        });
    });
}
