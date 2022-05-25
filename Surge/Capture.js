!(async () => {
let mods = (await httpAPI("GET", "/v1/modules", null))
let modsStatus = /MitM All Hostnames/.test(mods.enabled)
let capture = (await httpAPI("GET", "/v1/features/capture", null))
if ($trigger === "button") {
    if (capture.enabled == false){
        await httpAPI("POST", "/v1/features/capture", {enabled: "true"})
        await httpAPI("POST", "/v1/modules", {"MitM All Hostnames": "true"})
        $done({
            title:"HTTP Capture",
            content:"Capture: \u2611     Hostnames: \u2611",
            icon: "hand.raised.square.on.square.fill",
            "icon-color": "ED0001"
        })
    } else {
        await httpAPI("POST", "/v1/features/capture", {enabled: "false"})
        await httpAPI("POST", "/v1/modules", {"MitM All Hostnames": "false"})
        $done({
            title:"HTTP Capture",
            content:"Capture: \u2612     Hostnames: \u2612",
            icon: "archivebox",
            "icon-color": "88989F"
        })
    }
} else if(modsStatus == true || capture.enabled == true) {
        $done({
            title:"HTTP Capture",
            content:"Capture: " + iconStatus(capture.enabled) + "     Hostnames: " + iconStatus(modsStatus),
            icon: "hand.raised.square.on.square.fill",
            "icon-color": "ED0001"
        })
} else {
        $done({
            title:"HTTP Capture",
            content:"Capture: " + iconStatus(capture.enabled) + "     Hostnames: " + iconStatus(modsStatus),
            icon: "archivebox",
            "icon-color": "88989F"
        })
}
})();

function httpAPI(method = "", path = "", body = "") {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}

function iconStatus(status) {
  if (status) {
    return "\u2611";
  } else {
    return "\u2612"
  }
}