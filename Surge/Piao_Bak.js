let productBakNo = JSON.parse($response.body).respData.bakNo
$persistentStore.write(productBakNo, ’productBakNo‘)
console.log(’若productBakNo后有字符串则获取成功\nproductBakNo：‘ + $persistentStore.read(’productBakNo‘))
$done({})