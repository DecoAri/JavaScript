let cp = {};
cp.long = $prefs.valueForKey("经度");
cp.la = $prefs.valueForKey("纬度");
cp.location = $prefs.valueForKey("地区");
(async function() {
    await login()
    await wid()
    await form()
    await submit()
    $done();
})();

function login() {
    console.log("await response")
    const Head = {
        url: 'http://' + $prefs.valueForKey("ip") + ':8080/wisedu-unified-login-api-v1.0/swagger-ui.html',
        method: "HEAD"
    };
    const loginurl = {
        url: 'http://' + $prefs.valueForKey("ip") + ':8080/wisedu-unified-login-api-v1.0/api/login?login_url=http%3A%2F%2Fauthserver.' + $prefs.valueForKey("学校") + '.cn%2Fauthserver%2Flogin%3Fservice%3Dhttps%253A%252F%252F' + $prefs.valueForKey("学校") + '.campusphere.net%252Fiap%252FloginSuccess&password=' + $prefs.valueForKey("密码") + '&username=' + $prefs.valueForKey("账号")
    };
    return new Promise(function(resolve) {
        $task.fetch(Head).then(response => {
            console.log(response.statusCode)
            if (response.statusCode != 200) {
                login()
            } else {
                console.log("await login")
                $task.fetch(loginurl).then(resp => {
                    if (typeof(resp.body) == "undefined") {
                        console.log(resp.body)
                        login()
                    } else {
                        let jsonData = JSON.parse(resp.body);
                        if (jsonData.msg != "login success!") {
                            login()
                        } else {
                            let cookies = jsonData.cookies
                            let regex = /route.*MOD_AUTH_CAS/
                            cp.cookie = cookies.replace(regex, "MOD_AUTH_CAS")
                            console.log('\n' + cp.cookie)
                            resolve()
                        }
                    }
                }, reason => {
                    console.log(reason.error)
                    login()
                })
            }
        }, reason => {
            console.log(reason.error)
            login()
        });
    });
}

function wid() {
    console.log("await wid")
    const widurl = {
        url: 'https://' + $prefs.valueForKey("学校") + '.campusphere.net/wec-counselor-sign-apps/stu/sign/getStuSignInfosInOneDay',
        method: "POST",
        headers: {
          'Cookie' : cp.cookie,
          'Content-Type' : 'application/json;charset=utf-8'
        },
        body: '{}'
    };
    return new Promise(function(resolve) {
        $task.fetch(widurl).then(response => {
            let jsonData = JSON.parse(response.body);
            console.log('\n' + response.body)
            cp.leave = jsonData["datas"].leaveTasks[0]
            cp.unsign = jsonData["datas"].unSignedTasks[0]
            if (typeof(cp.unsign) == "undefined" && typeof(cp.leave) == "undefined") {
                console.log("无签到")
                $done($notify("无签到","",""))
            } else if (typeof(cp.unsign) == "undefined") {
                cp.wid = jsonData["datas"].leaveTasks[0].signInstanceWid
                cp.signWid = jsonData["datas"].leaveTasks[0].signWid
            } else {
              cp.wid = jsonData["datas"].unSignedTasks[0].signInstanceWid
              cp.signWid = jsonData["datas"].unSignedTasks[0].signWid
            }
              resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成
        }, reason => {
            console.log(reason.error)
            wid()
        })
    });
}

function form() {
    console.log("await form")
    const formurl = {
        url: 'https://' + $prefs.valueForKey("学校") + '.campusphere.net/wec-counselor-sign-apps/stu/sign/detailSignInstance',
        method: "POST",
        headers: {
          'Cookie' : cp.cookie,
          'Content-Type' : 'application/json;charset=utf-8'
        },
        body: `{
          "signWid": ${cp.signWid},
          "signInstanceWid": ${cp.wid}
        }`
    };
    return new Promise(function(resolve) {
        $task.fetch(formurl).then(response => {
            let jsonData = JSON.parse(response.body);
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
        }, reason => {
            console.log(reason.error)
            form()
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
        url: 'https://' + $prefs.valueForKey("学校") + '.campusphere.net/wec-counselor-sign-apps/stu/sign/submitSign',
        method: "POST",
        headers: {
          'Cookie' : cp.cookie,
          'Content-Type' : 'application/json;charset=utf-8'
        },
        body: JSON.stringify(bodys)
    };
    return new Promise(function(resolve) {
        $task.fetch(submiturl).then(response => {
            let jsonData = JSON.parse(response.body);
            cp.msg = jsonData.message
            console.log(cp.msg)
            $fask.fetch({url: 'https://sctapi.ftqq.com/' + $prefs.valueForKey("server酱") + '.send', method: 'POST'}).then(resp => {
                let jsonData = JSON.parse(data)
                console.log("方糖通知: " + jsonData.data.error)
                $notify("今日校园", cp.msg, "方糖通知: " + jsonData.data.error)
                resolve();
            }, reason => {
                resolve()
            })
        }, reason => {
            console.log(reason.error)
            submit()
        })
    });
}
