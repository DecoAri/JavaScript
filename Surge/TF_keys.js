$persistentStore.write(null, 'request_id')
let url = $request.url
let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')
let session_id = $request.headers['x-session-id'] || $request.headers['X-Session-Id']
let session_digest = $request.headers['x-session-digest'] || $request.headers['X-Session-Digest']
let request_id = $request.headers['x-request-id'] || $request.headers['X-Request-Id']
let X_Apple_AMD_M = $request.headers['X-Apple-AMD-M'] || $request.headers['x-apple-amd-m']
let UA = $request.headers['User-Agent'] || $request.headers['user-agent']
$persistentStore.write(key, 'key')
$persistentStore.write(session_id, 'session_id')
$persistentStore.write(session_digest, 'session_digest')
$persistentStore.write(request_id, 'request_id')
$persistentStore.write(X_Apple_AMD_M, 'X-Apple-AMD-M')
$persistentStore.write(UA, 'TFUA')
if ($persistentStore.read('request_id') !== null) {
  $notification.post('请关闭本脚本', '信息获取成功','')
} else {
  $notification.post('信息获取失败','请打开MITM H2开关并添加testflight.apple.com','')
}
$done({})