/**
作用：显示公共TF的分享链接（非公测链接无法显示）
路径：App--App Details--Description
使用方法：
Surge:
[Script]
TF_link = type=http-response,pattern=^https:\/\/testflight\.apple\.com\/v2\/accounts\/\w+-\w+-\w+-\w+-\w+\/apps\/\d+\/builds\/\d+$,requires-body=1,max-size=0,script-path=https://github.com/DecoAri/JavaScript/blob/main/Surge/TF_link.js?raw=true
[MITM]
hostname = testflight.apple.com

QX:
^https:\/\/testflight\.apple\.com\/v2\/accounts\/\w+-\w+-\w+-\w+-\w+\/apps\/\d+\/builds\/\d+$ url script-response-body https://github.com/DecoAri/JavaScript/blob/main/Surge/TF_link.js?raw=true
hostname = testflight.apple.com

**/


let obj = JSON.parse($response.body)
if (obj.data.shareUrl !== null) {
  obj.data.builds[0].description = obj.data.shareUrl + '\n' + obj.data.builds[0].description
  $done({body:JSON.stringify(obj)});
} else {$done({})}