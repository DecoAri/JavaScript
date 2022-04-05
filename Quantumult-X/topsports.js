//滔搏运动（TopSports）发售监控
/***********
暂不支持多城市监控，如需要请配置多个本地脚本并修改脚本本体（小白勿动）

暂不支持告诉你发售多少，后续再做，如果有后续的话（

只支持Quantumult X
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
    if (jsonData.data.extend === null) {
        console.log("没有新发售鞋👟")
        $done()
    } else {
        let start = time(jsonData.data.extend[0].exchangeStartTime);
        let end = time(jsonData.data.extend[0].exchangeEndTime);
        $notify("👟有新鞋发售啦", jsonData.data.extend[0].productName, "发售时间:" + start +"\n" + "结束时间:" + end + "\n" + "⚠️注：具体发售几双👟请自行查看", {"media-url": jsonData.data.extend[0].indexPicUrl});
        console.log("👟有新鞋发售啦" + "\n" + jsonData.data.extend[0].productName + "\n" + "发售时间:" + start +"\n" + "结束时间:" + end + "\n" + "⚠️注：具体发售几双👟请自行查看")
        $done();
    }
}, reason => {
    $notify("脚本运行出错", "", reason.error);
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
