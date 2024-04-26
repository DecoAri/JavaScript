/***
本人懒，懒得改能用就行

IP检测评分等等等等等等，懒得写了
***/


let net = {}; //预留的空对象, 便于"函数"(function)之间读

net.中国电信 = ['460-03','460-05','460-11'];
net.中国联通 = ['460-01','460-06','460-09'];
net.中国移动 = ['460-00','460-02','460-04','460-07','460-08'];
net.中国广电 = ['460-15'];
net.中国铁通 = ['460-20'];
net.v4 = $network.v4.primaryAddress
net.ssid = $network.wifi.ssid
net.carrier = $network["cellular-data"].carrier
net.router = $network.v4.primaryRouter
net.radio = $network["cellular-data"].radio;

(async function() {
  await ipapi();
  await Promise.all([
    scam(),
    ipinfo(),
    youtube()
  ]);
    var regex=/^192.168/
    if(regex.test(net.v4)){
        if(net.v4 == net.query){
            $done({
              title: `${net.ssid}`,
              content: `ASN: `+net.asn+`\n`+net.youtube+`: Google     `+net.emoji+`: `+net.query+`\nIPs: `+net.router+` & `+net.v4+`\nFraud score: `+net.score+`       `+net.risk+` risk`+`\nTor: `+net.tor+`   VPN: `+net.vpn+`\nRelay: `+net.relay+`   Proxy: `+net.proxy+`\nServer: `+net.server+`   Hosting: `+net.hosting+`\nASN Type: `+net.atype+`\nName: `+net.aname+`\nCompany Type: `+net.ctype+`\nName: `+net.cname,
              icon: "wifi",
              'icon-color': "#00FF00"
            });
        }else{
            $done({
              title: `${net.ssid}`,
              content: `ASN: `+net.asn+`\n`+net.youtube+`: Google     `+net.emoji+`: `+net.query+`\nIPs: `+net.router+` & `+net.v4+`\nFraud score: `+net.score+`       `+net.risk+` risk`+`\nTor: `+net.tor+`   VPN: `+net.vpn+`\nRelay: `+net.relay+`   Proxy: `+net.proxy+`\nServer: `+net.server+`   Hosting: `+net.hosting+`\nASN Type: `+net.atype+`\nName: `+net.aname+`\nCompany Type: `+net.ctype+`\nName: `+net.cname,
              icon: "wifi",
              'icon-color': "#00FF00"
            });
        }
    }else if(`${net.radio}` == "null"){
        if(`${net.v4}` == `${net.query}`){
            $done({
            title: `Hotspot`,
            content: `ASN: `+net.asn+`\n`+net.youtube+`: Google     `+net.emoji+`: `+net.query+`\nIPs: `+net.router+` & `+net.v4+`\nFraud score: `+net.score+`       `+net.risk+` risk`+`\nTor: `+net.tor+`   VPN: `+net.vpn+`\nRelay: `+net.relay+`   Proxy: `+net.proxy+`\nServer: `+net.server+`   Hosting: `+net.hosting+`\nASN Type: `+net.atype+`\nName: `+net.aname+`\nCompany Type: `+net.ctype+`\nName: `+net.cname,
            icon: "personalhotspot",
            'icon-color': "#0000FF"
            });
        }else{
            $done({
            title: `Hotspot`,
            content: `ASN: `+net.asn+`\n`+net.youtube+`: Google     `+net.emoji+`: `+net.query+`\nIPs: `+net.router+` & `+net.v4+`\nFraud score: `+net.score+`       `+net.risk+` risk`+`\nTor: `+net.tor+`   VPN: `+net.vpn+`\nRelay: `+net.relay+`   Proxy: `+net.proxy+`\nServer: `+net.server+`   Hosting: `+net.hosting+`\nASN Type: `+net.atype+`\nName: `+net.aname+`\nCompany Type: `+net.ctype+`\nName: `+net.cname,
            icon: "personalhotspot",
            'icon-color': "#0000FF"
            });
        }
    }else{
        if(net.中国电信.includes(net.carrier)){
            net.运营商 = "China Telecom";
        }else if(net.中国联通.includes(net.carrier)){
            net.运营商 = "China Unicom";
        }else if(net.中国移动.includes(net.carrier)){
            net.运营商 = "China Mobile";
        }else if(net.中国广电.includes(net.carrier)){
            net.运营商 = "China Broadcasting Network";
        }else if(net.中国铁通.includes(net.carrier)){
            net.运营商 = "China Tietong";
        }else{
            net.运营商 = "𝓜𝓸𝓫𝓲𝓵𝓮 𝓝𝓮𝓽𝔀𝓸𝓻𝓴";
        }
        if(`${net.v4}` == `${net.query}`){
            $done({
            title: `${net.运营商}`,
            content: `Radio: `+net.radio+`     ASN: `+net.asn+`\n`+net.youtube+`: Google     `+net.emoji+`: `+net.query+`\nIPs: `+net.router+` & `+net.v4+`\nFraud score: `+net.score+`       `+net.risk+` risk`+`\nTor: `+net.tor+`   VPN: `+net.vpn+`\nRelay: `+net.relay+`   Proxy: `+net.proxy+`\nServer: `+net.server+`   Hosting: `+net.hosting+`\nASN Type: `+net.atype+`\nName: `+net.aname+`\nCompany Type: `+net.ctype+`\nName: `+net.cname,
            icon: "antenna.radiowaves.left.and.right",
            'icon-color': "#EA0300"
            });
        }else{
            $done({
            title: `${net.运营商}`,
            content: `Radio: `+net.radio+`     ASN: `+net.asn+`\n`+net.youtube+`: Google     `+net.emoji+`: `+net.query+`\nIPs: `+net.router+` & `+net.v4+`\nFraud score: `+net.score+`       `+net.risk+` risk`+`\nTor: `+net.tor+`   VPN: `+net.vpn+`\nRelay: `+net.relay+`   Proxy: `+net.proxy+`\nServer: `+net.server+`   Hosting: `+net.hosting+`\nASN Type: `+net.atype+`\nName: `+net.aname+`\nCompany Type: `+net.ctype+`\nName: `+net.cname,
            icon: "antenna.radiowaves.left.and.right",
            'icon-color': "#EA0300"
            });
        }
    };
})();

function ipapi() {
return new Promise(function(resolve) {
  $httpClient.get("http://ip-api.com/json/", function(error, response, body){
    var jsondata = JSON.parse(body)
    net.city = jsondata.city
    net.query = jsondata.query
    net.emoji = getFlagEmoji(jsondata.countryCode)
    //net.proxy = jsondata.proxy
    //net.hosting = jsondata.hosting
    resolve();
  })
})
};

function scam() {
return new Promise(function(resolve) {
  $httpClient.get({url: 'https://scamalytics.com/ip/' + net.query}, function(error,resp,html) {
    const regex = /"score":"(\d+)"/;
    const regex1 = /"risk":"(\w+)"/;
    const regex2 = /<th>Server<\/th>\s*<td><div class="risk (yes|no)">(Yes|No)<\/div><\/td>/;
    const regex3 = /<th>Tor Exit Node<\/th>\s*<td><div class="risk (yes|no)">(Yes|No)<\/div><\/td>/;
    const match = html.match(regex);
    const same = html.match(regex1);
    const server = html.match(regex2);
    const tor = html.match(regex3)
    net.score = match[1];
    net.risk = same[1];
    net.server = server[2];
    net.tor = tor[2];
        resolve();
  });
})
};

function ipinfo() {
return new Promise(function(resolve) {
  $httpClient.get({url: 'https://ipinfo.io/widget/demo/' + net.query}, function(error,resp,data) {
    let jsonData = JSON.parse(data)
    net.asn = jsonData.data.asn.asn
    net.atype = jsonData.data.asn.type
    net.aname = jsonData.data.asn.name
    net.ctype = jsonData.data.company.type
    net.cname = jsonData.data.company.name
    net.proxy = jsonData.data.privacy.proxy
    net.hosting = jsonData.data.privacy.hosting
    net.vpn = jsonData.data.privacy.vpn
    net.relay = jsonData.data.privacy.relay
      resolve();
  })
})
};

function youtube() {
return new Promise(function(resolve) {
  $httpClient.get({url: 'https://www.youtube.com/premium', headers: {'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}}, function(error,resp,body) {
    let reg = new RegExp ("contentRegion\\\":\\\"\\w{2}\\\"")
    let a = JSON.stringify(reg.exec(body))
    let YouTube = a.replace(/(\[\"contentRegion\\\":\\\")(\w+)\\\"\"\]/, '$2')
    net.youtube = getFlagEmoji(YouTube)
      resolve();
  })
})
};

/**
function getFlagEmoji(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};
**/

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