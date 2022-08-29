!(async () => {
if ($persistentStore.read('APP_ID') == null && $persistentStore.read('APP_ID2') == null) {
    $notification.post('模块已关闭','原因：APP_ID未手动配置，请手动配置','配置完成请重新打开脚本模块')
    $done($httpAPI('POST', '/v1/modules', {'Auto module for JavaScripts': 'false'}))
} else if ($persistentStore.read('APP_ID') == null) {
    await autoPost($persistentStore.read('APP_ID2'))
    if (autoPost($persistentStore.read('APP_ID2')) == null) {
      $done()
    } else {
      $done($httpAPI('POST', '/v1/modules', {'Auto module for JavaScripts': 'false'}))
    }
} else if ($persistentStore.read('APP_ID2') == null) {
    await autoPost($persistentStore.read('APP_ID'))
    if (autoPost($persistentStore.read('APP_ID')) == null) {
      $done()
    } else {
      $done($httpAPI('POST', '/v1/modules', {'Auto module for JavaScripts': 'false'}))
    }
} else {
    await autoPost($persistentStore.read('APP_ID'))
    
    await autoPost($persistentStore.read('APP_ID2'))
    
}
})();

function autoPost(APP_ID) {
  let ID = APP_ID
  let Key = $persistentStore.read('key')
  let testurl = "https://testflight.apple.com/v3/accounts/" + Key + "/ru/"
  let header = {
    "X-Session-Id": `${$persistentStore.read('session_id')}`,
    "X-Session-Digest": `${$persistentStore.read('session_digest')}`,
    "X-Request-Id": `${$persistentStore.read('request_id')}`
  }
  return new Promise(function(resolve) {
    $httpClient.get({url: testurl + ID,headers: header}, function(error, resp, data) {
      if (error === null) {
        let jsonData = JSON.parse(data)
        if (jsonData.data.status == "FULL") {
          console.log(jsonData.data.message)
          resolve();
        } else {
          $httpClient.post({url: testurl + ID + "/accept",headers: header}, function(error, resp, body) {
            let jsonBody = JSON.parse(body)
            $notification.post(jsonBody.data.name, "TestFlight加入成功", "若配置了模块，则脚本已自动关闭")
            console.log(jsonBody.data.name + " TestFlight加入成功")
            resolve('SUCCESS');
          });
        }
      } else {
        if (error =="The request timed out.") {
          resolve();
        } else {
          $notification.post('自动加入TF', error,'')
          console.log(error)
          resolve();
        }
      }
    })
  })
}
