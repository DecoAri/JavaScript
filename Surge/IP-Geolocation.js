const flags = new Map([["NA","globe.americas.fill"],["SA","globe.americas.fill"], ["EU","globe.europe.africa.fill"], ["AS","globe.asia.australia.fill"], ["OC","globe.asia.australia.fill"], ["AF","globe.europe.africa.fill"]])
const carriers = new Map([["460-03","China Telecom"], ["460-05","China Telecom"], ["460-11","China Telecom"], ["460-01","China Unicom"], ["460-06","China Unicom"], ["460-09","China Unicom"], ["460-00","China Mobile"],  ["460-02","China Mobile"], ["460-04","China Mobile"], ["460-07","China Mobile"], ["460-08","China Mobile"], ["460-15","China Broadcasting Network"], ["460-20","China Mobile"]])
$httpClient.get("http://ip-api.com/json/", function(error, response, body){
  $httpClient.get("http://ip-api.com/json/" + JSON.parse(body).query + "?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query", function(error, response, body){
    if ($network.wifi.ssid == null) {
      $done({
        title: carriers.get($network["cellular-data"].carrier) + "｜" + $network["cellular-data"].radio,
        content: `${flagEmojis(JSON.parse(body).countryCode)}: ${JSON.parse(body).query}\nISP: ${JSON.parse(body).isp}\nCITY: ${JSON.parse(body).city}`,
        icon: flags.get(JSON.parse(body).continentCode),
        'icon-color': $argument
      })
    } else {
      $done({
        title: $network.wifi.ssid,
        content: `${flagEmojis(JSON.parse(body).countryCode)}: ${JSON.parse(body).query}\nISP: ${JSON.parse(body).isp}\nCITY: ${JSON.parse(body).city}`,
        icon: flags.get(JSON.parse(body).continentCode),
        'icon-color': $argument
      })
    }
  })
})

function flagEmojis(country_code) {
  if(country_code === `TW` || country_code === `HK` || country_code === `MO`){
    let codePoints = `CN`
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }else{
    const codePoints = country_code
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }
}
