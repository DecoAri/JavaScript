/****
写脚本缘由：私有DDNS脚本，由于Surge自带的sgddns无法同时解析ipv4和ipv6同时使用。由于经常换网络环境，不一定全是公网IP，可能只有公网V6，可能全部都有。所以自写一份私有ddns脚本。

⚠️需要配合python/JS自动上传本机公网IP到github后此脚本才可用

⚠️请详细（一个个字）阅读

使用方法：在Surge中文本编辑配置文件。

Surge iOS添加内容如下：
[Script]这个section下粘贴以下内容：
DDNS = type=dns,script-path=https://raw.githubusercontent.com/DecoAri/JavaScript/main/Surge/PDDNS.js,argument=URL=🌍&TOKEN=🔑
[Host]下添加以下内容：
// 随便写一个不常见域名例如
home.mac.pddns = script:DDNS
把你的家里的节点的server改为上面的域名： home.mac.pddns

请替换argument里面的🌍和🔑
🌍为你github私有库的dns IP文件的链接（该文件的IP由py/js自动上传，请不要自己填写文件内容）
🔑为github的personal access token。如不知道该开什么权限请全部勾选（⚠️别把token分享给别人）

自动上传IP到github请访问本库的up_pddns.js或者python库
****/

let ddnsurl = {
  url: getArgs().URL,
  headers: {
    'Authorization': 'token ' + getArgs().TOKEN
  }
}

$httpClient.get(ddnsurl, function(error, response, data){
  $done({addresses:  data.split(';'), ttl: 600});
});

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}