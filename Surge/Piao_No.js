let cityNo = getArgs().cityNo
let longitude = getArgs().longitude
let dimension = getArgs().dimension
let productNo = getArgs().productNo
$persistentStore.write(cityNo, ’cityNo‘)
$persistentStore.write(longitude, ’longitude‘)
$persistentStore.write(dimension, ’dimension‘)
$persistentStore.write(productNo, ’productNo‘)
console.log(’\n‘ + $persistentStore.read(’cityNo‘) + ’\n‘ + $persistentStore.read(’longitude‘) + ’\n‘ + $persistentStore.read(’dimension‘)  + ’\n‘ + $persistentStore.read(’productNo‘) + ’\n若为四个数字串则正确‘)
$done({})

function getArgs() {
  return Object.fromEntries(
    $request.body
      .split(”&“)
      .map((item) => item.split(”=“))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}