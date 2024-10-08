/****************
自己抓Follow wallet ID的URL

Claim daily URL的 header cookie的session token, body全部


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
    headers: {'cookie': 'authjs.session-token=' + `${$persistentStore.read('Follow_sToken')}`},
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
    } else {
      $notification.post('其他错误', '查看日志', '')
      console.log('\n'+error + '\n'+res + '\n'+data)
      console.log("Retrying request...");
      postRequest();  // 如果code=4000，重新发起POST请求（不获取power）
    }
  });
}

getPower(function (initialPower) {  // 脚本运行时首次获取power
  console.log('Initial Power before POST: ' + initialPower);
  $notification.post('Follow', 'Power: ' + initialPower,'如果没收到Power更新通知请重新执行脚本', {'media-url':'https://app.follow.is/opengraph-image.png'})
  postRequest();  // 获取完power后，开始执行POST请求
});