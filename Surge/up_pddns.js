/*****
Surge iOS添加内容如下：
[Script]这个section下粘贴以下内容：
up_pddns = type=event,event-name=network-changed,script-path=up_pddns.js,argument=owner=👨&token=🔑&repo=🏠&branch=🛣️&filePath=📄&fileName=📖


请替换argument里面的👨、🔑、🏠、🛣️、📄和📖。
👨为你github的用户名
🔑为github的personal access token。如不知道该开什么权限请全部勾选（⚠️别把token分享给别人）
🏠为你的库名称
🛣️为你的branch（一般为main或者master）
📄为你的最终文件的路径，如：path/to/your-DDNS.json
📖为你的文件名称：如DDNS.json

举个完整例子：
https://raw.githubusercontent.com/woaini/PDDNS/main/DDNS.json
或
https://raw.githubusercontent.com/woaini/PDDNS/main/Surge/DDNS.json 此条带filePath


****/



var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));
var base64encode = function (e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e.charCodeAt(a++),
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}
var base64decode = function (e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = ''; o < t;) {
        do r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1) break;
        do a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1) break;
        d += String.fromCharCode(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c) return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1) break;
        d += String.fromCharCode((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h) return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1) break;
        d += String.fromCharCode((3 & c) << 6 | h)
    }
    return d
}
var hexToBytes = function (hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
var bytesToHex = function (bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
var bytesToString = function (arr) {
    var str = "";
    arr = new Uint8Array(arr);
    for (i in arr) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
}
var stringToBytes = function (str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push(ch & 0xFF);
            ch = ch >> 8;
        }
        while (ch);
        re = re.concat(st.reverse())
    }
    return re;
}
var bytesToBase64 = function (bytes) {

    // Use browser-native function if it exists
    // if (typeof btoa == "function") return btoa(bytesToString(bytes));

    for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64EncodeChars.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
            else base64.push("=");
        }
    }
    return base64.join("");
}
var base64ToBytes = function (base64) {

    // Use browser-native function if it exists
    // if (typeof atob == "function") return stringToBytes(atob(base64));

    // Remove non-base-64 characters
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64EncodeChars.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
            (base64EncodeChars.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }

    return bytes;

}
var hexToString = function (hex) {
    var arr = hex.split("")
    var out = ""
    for (var i = 0; i < arr.length / 2; i++) {
        var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
        var charValue = String.fromCharCode(tmp);
        out += charValue
    }
    return out
}
var stringToHex = function (str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    val += "0a"
    return val
}
var hexToBase64 = function (str) {
    return base64encode(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
var base64ToHex = function (str) {
    for (var i = 0,
             bin = base64decode(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
};

let ddns = {};
ddns.owner = getArgs().ower;
ddns.token = getArgs().token;
ddns.repo = getArgs().repo;
ddns.branch = getArgs().branch;
ddns.filePath = getArgs().filePath;
ddns.fileName = getArgs().fileName;
ddns.commitMessage = "Auto update";

(async function() {
  await Promise.all([
    getV4(),
    getV6(),
    getSha()
  ]);
  ddns.fileContent = ddns.v4 + ';' + ddns.v6
  ddns.hexContent = stringToHex(ddns.fileContent);
  ddns.base64Content = hexToBase64(ddns.hexContent);
  await commit();
  $done();
})();

// get public ip
function getV4() {
  return new Promise(function(resolve) {
    $httpClient.get('https://api.ipify.org', function(error,head,data) {
      ddns.v4 = data
      console.log(ddns.v4)
      resolve()
    })
  });
}

function getV6() {
  return new Promise(function(resolve) {
    $httpClient.get('https://ipapi.co/json/', function(error,head,data) {
      ddns.v6 = JSON.parse(data).ip
      console.log(ddns.v6)
      resolve()
    })
  });
}

//获取文件sha值
function getSha() {
  return new Promise(function(resolve) {
    $httpClient.get({
      url: `https://api.github.com/repos/${ddns.owner}/${ddns.repo}/contents/${ddns.fileName}`,
      headers: {
        "Authorization": 'token ' + ddns.token
      }},
      function(error,headers,resp) {
        let jsonResp = JSON.parse(resp)
        ddns.sha = jsonResp.sha
        resolve()
      }
    );
  })
}

//commit message
function commit() {
  const body =  {
    message: ddns.commitMessage,
    content: ddns.base64Content,
    branch: ddns.branch,
    sha: ddns.sha,
  };
  return new Promise(function(resolve) {
    $httpClient.put({
      url: `https://api.github.com/repos/${ddns.owner}/${ddns.repo}/contents/${ddns.fileName}`,
      headers: {
        "Authorization": 'token ' + ddns.token
      },
      body: body},
      function(error,headers,resp) {
        console.log(headers.status)
        console.log(resp)
        if (headers.status === 200 || headers.status === 201) {
          $notification.post('Commit DDNS IP','文件上传/修改成功!',''),
          console.log("文件上传/修改成功!");
          resolve();
        } else {
          console.log("文件上传/修改失败!");
          console.log(error)
          resolve();
        }
      },
    );
  })
}

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}