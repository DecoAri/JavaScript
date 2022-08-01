let chnlUserId = JSON.parse($request.body).chnlUserId
$persistentStore.write(chnlUserId, ’chnlUserId‘)
console.log(’若chnlUserId后有字符串则获取成功\nchnlUserId：‘ + $persistentStore.read(’chnlUserId‘))
$done({})