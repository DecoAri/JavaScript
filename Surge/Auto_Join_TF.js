!(async () => {
ids = $persistentStore.read('APP_ID')
if (ids == '') {
  $notification.post('所有TF已加入完毕','模块已自动关闭','')
  $done($httpAPI('POST', '/v1/modules', {'Auto module for JavaScripts': 'false'}))
} else {
  ids = ids.split(',')
  for await (const ID of ids) {
    await autoPost(ID)
  }
}
$done()
})();

function autoPost(ID) {
  let Key = $persistentStore.read('key')
  let checkStatus = 'https://testflight.apple.com/join/' + ID
  let checkHeader = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'
  }
  let joinUrl = 'https://testflight.apple.com/v3/accounts/' + Key + '/ru/'
  let header = {
    'X-Session-Id': `${$persistentStore.read('session_id')}`,
    'X-Session-Digest': `${$persistentStore.read('session_digest')}`,
    'X-Request-Id': `${$persistentStore.read('request_id')}`,
    'X-Apple-AMD-X': `${$persistentStore.read('X-Apple-AMD-X')}`,
    'User-Agent': `${$persistentStore.read('TFUA')}`
  }
  return new Promise(function(resolve) {
    $httpClient.get({url: checkStatus, headers: checkHeader}, function(error, resp, data) {
      let lowerData = data.toLowerCase()
      switch (true) {
        case lowerData.includes("not found"):
          ids = $persistentStore.read('APP_ID').split(',')
          ids = ids.filter(ids => ids !== ID)
          $persistentStore.write(ids.toString(),'APP_ID')
          console.log(ID + ': 不存在该TF，已自动删除该APP_ID')
          $notification.post(ID, '不存在该TF', '已自动删除该APP_ID')
          resolve()
          break;
        case lowerData.includes("this beta isn't accepting any new testers right now"):
          console.log(ID + ": This beta isn't accepting any new testers right now")
          resolve()
          break;
        case lowerData.includes("this beta is full"):
          console.log(ID + ": This beta is full")
          resolve()
          break;
        case lowerData.includes("get testflight"):
          $httpClient.post({url: joinUrl + ID + '/accept',headers: header}, function(error, resp, body) {
            if (error === null) {
              let appName = JSON.parse(body).data.name
              console.log('🎉' + appName + '🎉' + ' (' + ID + '): ' + ' TestFlight加入成功')
              $notification.post('🎉' + appName, 'TestFlight加入成功', '')
              ids = $persistentStore.read('APP_ID').split(',')
              ids = ids.filter(ids => ids !== ID)
              $persistentStore.write(ids.toString(),'APP_ID')
              resolve();
            } else if (error =='The request timed out.') {
              resolve();
            } else if (error.includes("error -1012")) {
              $notification.post('自动加入TF', error,'请获取TF账户信息，模块已自动关闭，获取成功后再自行打开模块')
              $done($httpAPI('POST', '/v1/modules', {'Auto module for JavaScripts': 'false'}))
              resolve();
            } else {
              $notification.post('自动加入TF', error,'')
              console.log(ID + ': ' + error)
              resolve();
            }
          });
          break;
        default:
          $notification.post('其他问题，请查看日志')
          console.log('Error: ' + error)
          console.log(data)
          resolve()
      }
    })
  })
}