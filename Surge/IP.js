var 中国电信 = ['460-03','460-05','460-11'];
var 中国联通 = ['460-01','460-06','460-09'];
var 中国移动 = ['460-00','460-02','460-04','460-07','460-08'];
var 中国广电 = ['460-15'];
var 中国铁通 = ['460-20'];
let v4 = $network.v4.primaryAddress
var ssid = $network.wifi.ssid
var carrier = $network["cellular-data"].carrier
var router = $network.v4.primaryRouter
var radio = $network["cellular-data"].radio
$httpClient.get("http://ip-api.com/json/", function(error, response, body){
    var jsondata = JSON.parse(body)
    var city = jsondata.city
    var query = jsondata.query
    var emoji = getFlagEmoji(jsondata.countryCode)
    var regex=/^192.168/
    if(regex.test(v4)){
        if(`${v4}` == `${query}`){
            $done({
            title: `${ssid}`,
	    content: `${emoji}: ${query}\nRouter: ${router}\nLocal IP: ${v4}`,
            icon: "wifi",
            'icon-color': "#00FF00"
	    });
        }else{
            $done({
            title: `${ssid}`,
	    content: `${emoji}: ${query}\nRouter: ${router}\nLocal IP: ${v4}`,
            icon: "wifi",
            'icon-color': "#00FF00"
	    });
        }
    }else if(`${radio}` == "null"){
        if(`${v4}` == `${query}`){
            $done({
	    title: `Hotspot`,
	    content: `${emoji}: ${query}\nRouter: ${router}\nLocal IP: ${v4}`,
            icon: "personalhotspot",
            'icon-color': "#0000FF"
	    });
        }else{
            $done({
	    title: `Hotspot`,
	    content: `${emoji}: ${query}\nRouter: ${router}\nLocal IP: ${v4}`,
            icon: "personalhotspot",
            'icon-color': "#0000FF"
	    });
        }
    }else{
        let 运营商 = "";
        if(中国电信.includes(carrier)){
            运营商 = "China Telecom";
        }else if(中国联通.includes(carrier)){
            运营商 = "China Unicom";
        }else if(中国移动.includes(carrier)){
            运营商 = "China Mobile";
        }else if(中国广电.includes(carrier)){
            运营商 = "China Broadcasting Network";
        }else if(中国铁通.includes(carrier)){
            运营商 = "China Tietong";
        }else{
            运营商 = "𝓜𝓸𝓫𝓲𝓵𝓮 𝓝𝓮𝓽𝔀𝓸𝓻𝓴";
        }
        if(`${v4}` == `${query}`){
            $done({
            title: `${运营商}`,
            content: `Radio: ${radio}\n${emoji}: ${query}\nLocal IP: ${v4}`,
            icon: "antenna.radiowaves.left.and.right",
            'icon-color': "#EA0300"
	    });
        }else{
            $done({
            title: `${运营商}`,
            content: `Radio: ${radio}\n${emoji}: ${query}\nLocal IP: ${v4}`,
            icon: "antenna.radiowaves.left.and.right",
            'icon-color': "#EA0300"
	    });
        }
    }
});
function getFlagEmoji(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};
function getFlagEmoji(country_code) {
    if(country_code === `TW`){
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
};