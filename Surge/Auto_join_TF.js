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
  let testurl = 'https://testflight.apple.com/v3/accounts/' + Key + '/ru/'
  let header = {
    'X-Session-Id': `${$persistentStore.read('session_id')}`,
    'X-Session-Digest': `${$persistentStore.read('session_digest')}`,
    'X-Request-Id': `${$persistentStore.read('request_id')}`
  }
  return new Promise(function(resolve) {
    $httpClient.get({url: testurl + ID,headers: header}, function(error, resp, data) {
      if (error === null) {
        if (resp.status == 404) {
          ids = $persistentStore.read('APP_ID').split(',')
          ids = ids.filter(ids => ids !== ID)
          $persistentStore.write(ids.toString(),'APP_ID')
          console.log(ID + ' ' + '不存在该TF，已自动删除该APP_ID')
          $notification.post(ID, '不存在该TF', '已自动删除该APP_ID')
          resolve()
        } else {
          let jsonData = JSON.parse(data)
          if (jsonData.data == null) {
            console.log(ID + ': ' + jsonData.messages[0].message)
            resolve();
          } else if (jsonData.data.status == 'FULL') {
            var name = jsonData.data.app.name
            console.log(name + ' (' + ID + '): ' + jsonData.data.message)
            resolve();
          } else {
            $httpClient.post({url: testurl + ID + '/accept',headers: header}, function(error, resp, body) {
              $notification.post('🎉' + name, 'TestFlight加入成功', '')
              console.log('🎉' + name + '🎉' + ' (' + ID + '): ' + ' TestFlight加入成功')
              ids = $persistentStore.read('APP_ID').split(',')
              ids = ids.filter(ids => ids !== ID)
              $persistentStore.write(ids.toString(),'APP_ID')
              resolve()
            });
          }
        }
      } else {
        if (error =='The request timed out.') {
          resolve();
        } else {
          $notification.post('自动加入TF', error,'')
          console.log(ID + ': ' + error)
          resolve();
        }
      }
    })
  })
}