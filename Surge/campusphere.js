let cp = {};
cp.long = $persistentStore.read("经度");
cp.la = $persistentStore.read("纬度");
cp.location = $persistentStore.read("地区");
(async function() {
    await login();
    await wid();
    await form();
    await submit();
    $done();
})();
function login() {
    console.log("await login")
    const loginurl = {
        url: 'http://' + $persistentStore.read("ip") + ':8080/wisedu-unified-login-api-v1.0/api/login?login_url=http%3A%2F%2Fauthserver.' + $persistentStore.read("学校") + '.cn%2Fauthserver%2Flogin%3Fservice%3Dhttps%253A%252F%252F' + $persistentStore.read("学校") + '.campusphere.net%252Fiap%252FloginSuccess&password=' + $persistentStore.read("密码") + '&username=' + $persistentStore.read("账号"),
        timeout: 30
    };
    return new Promise(function(resolve) {
        $httpClient.post(loginurl, function(error, resp, data) {
            if (typeof(resp) == "undefined") {
                console.log(resp)
                login()
            }else if (resp.status != 200) {
                console.log(resp.status)
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
    console.log("await wid")
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
            cp.unsign = jsonData["datas"].unSignedTasks[0]
            if (typeof(cp.unsign) == "undefined" && typeof(cp.leave) == "undefined") {
                console.log("无签到")
                $done($notification.post("无签到","",""))
            } else if (typeof(cp.unsign) == "undefined") {
                cp.wid = jsonData["datas"].leaveTasks[0].signInstanceWid
                cp.signWid = jsonData["datas"].leaveTasks[0].signWid
            } else {
              cp.wid = jsonData["datas"].unSignedTasks[0].signInstanceWid
              cp.signWid = jsonData["datas"].unSignedTasks[0].signWid
            }
            resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成
        });
    });
}

function form() {
    console.log("await form")
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
            cp.formWid1 = jsonData.datas.extraField[1].extraFieldItems[0].wid
            cp.formWid2 = jsonData.datas.extraField[2].extraFieldItems[0].wid
            cp.formWid3 = jsonData.datas.extraField[3].extraFieldItems[0].wid
            cp.formWid4 = jsonData.datas.extraField[4].extraFieldItems[0].wid
            cp.formcontent = jsonData.datas.extraField[0].extraFieldItems[0].content
            cp.formcontent1 = jsonData.datas.extraField[1].extraFieldItems[0].content
            cp.formcontent2 = jsonData.datas.extraField[2].extraFieldItems[0].content
            cp.formcontent3 = jsonData.datas.extraField[3].extraFieldItems[0].content
            cp.formcontent4 = jsonData.datas.extraField[4].extraFieldItems[0].content
            resolve();
        })
    })
}
function submit() {
    console.log("await submit")
    const bodys = {
          "abnormalReason": "",
          "position": `${cp.location}`,
          "longitude": `${cp.long}`,
          "isNeedExtra": 1,
          "latitude": `${cp.la}`,
          "isMalposition": 1,
          "extraFieldItems": [
            {
              "extraFieldItemWid": `${cp.formWid}`,
              "extraFieldItemValue": `${cp.formcontent}`
            },
            {
              "extraFieldItemWid": `${cp.formWid1}`,
              "extraFieldItemValue": `${cp.formcontent1}`
            },
            {
              "extraFieldItemWid": `${cp.formWid2}`,
              "extraFieldItemValue": `${cp.formcontent2}`
            },
            {
              "extraFieldItemWid": `${cp.formWid3}`,
              "extraFieldItemValue": `${cp.formcontent3}`
            },
            {
              "extraFieldItemWid": `${cp.formWid4}`,
              "extraFieldItemValue": `${cp.formcontent4}`
            }
          ],
          "signPhotoUrl": "",
          "uaIsCpadaily": false,
          "signInstanceWid": `${cp.wid}`
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
            $notification.post("今日校园", cp.msg, "")
            resolve();
        });
    });
}