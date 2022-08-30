!(async () => {
ids = $persistentStore.read('APP_ID')
if (ids == '') {
	$notification.post('所有TF已加入完毕','模块已自动关闭','')
	$done($httpAPI('POST', '/v1/modules', {'Auto module for JavaScripts': 'false'}))
} else {
  ids = ids.split(',')
  await list(ids)
	$done()
}
})();

async function list(ids) {
	for (const id of ids) {
		await autoPost(id)
	}
}

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
        let jsonData = JSON.parse(data)
        if (jsonData.data.status == 'FULL') {
          console.log(ID + ' ' + jsonData.data.message)
          resolve();
        } else {
          $httpClient.post({url: testurl + ID + '/accept',headers: header}, function(error, resp, body) {
            let jsonBody = JSON.parse(body)
            $notification.post(jsonBody.data.name, 'TestFlight加入成功', '')
            console.log(jsonBody.data.name + ' TestFlight加入成功')
						ids = $persistentStore.read('APP_ID').split(',')
						console.log(ids)
						if (ids.indexOf(ID)) {
							console.log('in ' + ID)
							ids.splice(ids.indexOf(ID), 1)
							ids = ids.toString()
							$persistentStore.write(ids,'APP_ID')
							resolve()
						} else if (ID == $persistentStore.read('APP_ID')) {
							console.log('=' + ID)
							$persistentStore.write('','APP_ID')
							resolve()
						} else {
							console.log('else ' + ID)
							resolve()
						}
          });
        }
      } else {
        if (error =='The request timed out.') {
          resolve();
        } else {
          $notification.post('自动加入TF', error,'')
          console.log(ID + ' ' + error)
          resolve();
        }
      }
    })
  })
}