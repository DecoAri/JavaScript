function getPower(callback) {
  $httpClient.get({
    url: 'https://api.follow.is/wallets?userId='
  }, function (error, resp, body) {
    let power = JSON.parse(body).data[0].dailyPowerToken / 1e18
    callback(power);  // 将获取到的 power 通过回调传递给调用者
  });
}

function postRequest() {
  $httpClient.post({
    url: 'https://api.follow.is/wallets/transactions/claim_daily',
    headers: {'cookie': 'authjs.session-token='},
    body: {"csrfToken": ""}
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
      console.log('\n'+error +
      console.log("Retrying request...");
      $done();  // 其他情况结束流程
    }
  });
}

getPower(function (initialPower) {  // 脚本运行时首次获取power
  console.log('Initial Power before POST: ' + initialPower);
  $notification.post('Follow', 'Power: ' + initialPower,'如果没收到Power更新通知请重新执行脚本', {'media-url':'https://app.follow.is/opengraph-image.png'})
  postRequest();  // 获取完power后，开始执行POST请求
});