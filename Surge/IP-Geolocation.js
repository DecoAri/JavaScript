const flags = new Map([[ "NA" , "globe.americas.fill" ],["SA","globe.americas.fill"], [ "EU" , "globe.europe.africa.fill" ], [ "AS" , "globe.asia.australia.fill" ], [ "OC" , "globe.asia.australia.fill" ], [ "AF" , "globe.europe.africa.fill" ]])
const carriers = new Map([["460-03","China Telecom"], ["460-05","China Telecom"], ["460-11","China Telecom"], ["460-01","China Unicom"], ["460-06","China Unicom"], ["460-09","China Unicom"], ["460-00","China Mobile"],  ["460-02","China Mobile"], ["460-04","China Mobile"], ["460-07","China Mobile"], ["460-08","China Mobile"], ["460-15","China Broadcasting Network"], ["460-20","China Mobile"]])

$httpClient.get({url: 'https://www.youtube.com/premium', headers: {'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}}, function(error,resp,body) {
    let reg = new RegExp ("contentRegion\\\":\\\"\\w{2}\\\"")
    let a = JSON.stringify(reg.exec(body))
    console.log(a)
    let YouTube = a.replace(/(\[\"contentRegion\\\":\\\")(\w+)\\\"\"\]/, '$2')
  $httpClient.get("http://ip-api.com/json/", function(error, response, body){
    $httpClient.get("http://ip-api.com/json/" + JSON.parse(body).query + "?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query", function(error, response, body){
      if ($network.wifi.ssid == null) {
        $done({
          title: carriers.get($network["cellular-data"].carrier) + "｜" + $network["cellular-data"].radio,
          content: `${flagEmojis(JSON.parse(body).countryCode)}: ${JSON.parse(body).city} :${flagEmojis(YouTube)}\nISP: ${JSON.parse(body).isp}`,
          icon: flags.get(JSON.parse(body).continentCode),
          'icon-color': $argument
        })
      } else {
        $done({
          title: $network.wifi.ssid,
          content: `${flagEmojis(JSON.parse(body).countryCode)}: ${JSON.parse(body).city} :${flagEmojis(YouTube)}\nISP: ${JSON.parse(body).isp}`,
          icon: flags.get(JSON.parse(body).continentCode),
          'icon-color': $argument
        })
      }
    })
  })
})

function flagEmojis(country_code) {
  const codes = (country_code == 'TW' || country_code == 'HK') ? 'CN':country_code
  const codePoints = codes
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}