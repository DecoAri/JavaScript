/****
Unlock Nomo CAM and Nomo RAW.

Please note:
Nomo RAW premium need restored in Nomo CAM APP. So....restore Nomo CAM first.

Usage: Use Surge module or directly add them by yourself.

[Script]
Nomo = type=http-response,pattern=https://nomo.dafork.com/api/v5/iap/ios_verify$,requires-body=1,max-size=0,script-path=https://github.com/DecoAri/JavaScript/blob/main/Surge/Nomo.js?raw=true

[MITM]
hostname = %APPEND% nomo.dafork.com

****/

let obj = $response.body

obj = '{"sign":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE2OTY1Mzk1NTMsInJlcXVlc3Rfc2lnbiI6IjIxMDIwMjRjYTcxNWY0NjI5NDJlYzIzMmIwMDIyMmI0IiwidmFsaWRhdGVkX2lvc19pZHMiOlsiYmxpbmsuYWNhZGVteS5ub21vLnByby55ZWFyIl0sImhhc192YWxpZF9zdWJzY3JpcHRpb24iOnRydWUsInN1YnNjcmlwdGlvbl9leHBpcmVfYXQiOjQxMDA2ODgwMDB9.XLQk0ScKVpxIinNgtujwJtS75ckzkrlGdzcK76paTq65F2Bl5UH5ImTyTNvpj6YJiz_SoS87LkLMPAQOCEhESGCsqjYC4HUaKGBrPp1JW9bwa_P4UCKYddbyRv7Yr5-yuFYan6nxozRUTnze-6yd1dc8sJJnfaDyGTnnzieHodtHp0SFPD9zCkb4flrbaxciDIZVAWDt3MakkMe1azoGHjH2cYz1YU3aOZDaKChqZi4y-pevYIMTDFth1LQsJpzqfV0OcS25ObVs-8h8lKxSLRK338WIrB2cQbRM8MXTSx4Tm_dBXbbROoofIuPfU9WnLqF5xUCrLNpx_TuFwbUgaQ"}'

$done({obj});

