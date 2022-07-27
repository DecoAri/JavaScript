#Only for Chongqing now.
#Adjust yourself or waiting for me.

(async function() {
    await OMG();
    $done();
})();

function OMG() {
  return new Promise(function(resolve) {
    $httpClient.post({url: 'https://fpwx.o2o.cmbchina.com/wechatmp-gateway/wechat/rush/order/create', headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.26(0x18001a25) NetType/WIFI Language/en', 'Content-Type': 'application/json'}, body: {"chnlUserId":`${$persistentStore.read("chnlUserId")}`,"chnlId":"01","productNo":$persistentStore.read("productNo"),"productBakNo":$persistentStore.read("productBakNo"),"buyCount":1,"cardType":"1100","userVouId":null,"cityNo":"23","longitude":"106.587217","dimension":"29.565589","blackListToken":""}}, function(error,resp,body) {
      let msg = JSON.parse(body).respMsg
      let code = JSON.parse(body).respCode
      if (code == 1000 || code == "COU_PC_0000000019" || code == "COU_PC_0000000026") {
        $notification.post("🛍️周二提前购", "🧾订单状态：" + msg,"⚠️仅限周三使用哦（不要忘了去掌上生活付款）")
        resolve();
      } else {
        console.log(msg)
        OMG()
      }
    })
  })
}