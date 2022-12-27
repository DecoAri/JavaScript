//滔搏运动（TopSports）发售监控
/***********
暂不支持多城市监控，如需要请配置多个本地脚本或修改脚本本体（小白勿动）

已支持多双鞋发售通知

只支持Quantumult X / Loon（因名字不能清楚知道鞋子样子，所以需要图片通知来决定是否需要去抽奖，所以暂不支持surge，Loon未适配）

qx脚本配置（cron按需自行修改）：

[task_local]
50 8,10,11,12,13,14 * * * https://github.com/DecoAri/JavaScript/blob/main/Quantumult-X/topsports.js?raw=true, tag=滔搏监控, enabled=true


城市代码请复制以下url在浏览器打开查看cityCode
https://m-app.topsports.com.cn/app/location/cityList

⚠️⚠️⚠️使用前请先运行以下脚本
打开qx，点击右下角风车，下拉找到工具&分析，点击构造HTTP请求，再点击右下角的写脚本图标，进去之后删除里面全部内容，复制以下代码并替换里面的中文，然后运行即可。

$done($prefs.setValueForKey("请修改此中文为城市代码", "cityCode"))

***********/
//以下为脚本本体



const getShoes = {
    url: "https://m-app-cdn.topsports.com.cn/presale-api/activity/list?brandCode=TS&cityCode=" + $prefs.valueForKey("cityCode") + "&current=1&pageSize=10",
    method: "GET"
};

$task.fetch(getShoes).then(response => {
    let jsonData = JSON.parse(response.body)
    let i = 0
    let shoes = jsonData.data.extend
    if (shoes == null) {
        console.log("👟没有新鞋发售")
    } else {
        while (shoes) {
            if (jsonData.data.extend[i] == undefined) {
                break;
            } else {
                shoes = jsonData.data.extend[i]
                console.log(JSON.stringify(shoes))
                let start = time(jsonData.data.extend[i].exchangeStartTime)
                let end = time(jsonData.data.extend[i].exchangeEndTime)
                $notify("👟有新鞋发售啦", jsonData.data.extend[i].productName, "发售时间：" + start +"\n" + "结束时间：" + end, {"media-url": jsonData.data.extend[i].indexPicUrl});
                console.log("👟有新鞋发售啦" + "\n" + jsonData.data.extend[i].productName + "\n" + "发售时间：" + start +"\n" + "结束时间：" + end)
                i++
            }
        }
    }
    $done()
}, reason => {
    $notify("滔搏发售", "脚本运行出错", reason.error);
    $done();
});


function time(releaseDate) {
    var date = new Date(releaseDate);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    return Y+M+D+h+m+s;
}