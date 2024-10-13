/****************
只需要以下三个就能自动签到
https://api.follow.is/wallets?userId=xxxxxxx
1: 这整个url


https://api.follow.is/wallets/transactions/claim_daily
2: 请求头的cookie:authjs.session-token=
3: 整个请求体

现在已经有人写了脚本转换器。所以QX loon shadowrocket不再更新
以下示例脚本 自己改
****************/

function getPower(callback) {
  $httpClient.get({
    url: $persistentStore.read('Follow_URL')
  }, function (error, resp, body) {
    let power = JSON.parse(body).data[0].dailyPowerToken / 1e18
    callback(power);  // 将获取到的 power 通过回调传递给调用者
  });
}

function postRequest() {
  $httpClient.post({
    url: 'https://api.follow.is/wallets/transactions/claim_daily',
    headers: {'cookie': 'authjs.session-token=' + `${$persistentStore.read('Follow_sToken')}` + ';' + `${$persistentStore.read('Follow_sToken')}`},
    body: {"csrfToken": `${$persistentStore.read('Follow_csrfToken')}`}
  }, function (error, res, data) {
    let code = JSON.parse(data).code;
    console.log('Code: ' + code);

    if (code === 0) {
      getPower(function (finalPower) {  // 如果code=0，再次获取power
        console.log('Final Power after POST: ' + finalPower);
        $notification.post('Follow', 'Power: ' + finalPower,'Power updated', {'media-url':'https://app.follow.is/opengraph-image.png'})
        $done();  // 完成流程
      });
    } else if (code === 4000) {
      console.log("Retrying request...");
      postRequest();  // 如果code=4000，重新发起POST请求（不获取power）
    } else if (code === 1000) {
      $notification.post('Follow', '未授权', '请重新获取cookie', {'media-url':'https://app.follow.is/opengraph-image.png'})
      console.log(data)
      $done();  // 其他情况结束流程
    } else {
      $notification.post('其他错误', '查看日志', '')
      console.log('\n'+error + '\n'+res + '\n'+data)
      $done()
    }
  });
}

getPower(function (initialPower) {  // 脚本运行时首次获取power
  console.log('Initial Power before POST: ' + initialPower);
  $notification.post('Follow', 'Power: ' + initialPower,'如果没收到Power更新通知请重新执行脚本', {'media-url':'https://app.follow.is/opengraph-image.png'})
  postRequest();  // 获取完power后，开始执行POST请求
});