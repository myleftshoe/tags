# Add Product

Check if product with given barcode exists before adding. `barcode` is `ID:` in the UI and sent as 'id' in the `POST` body (see Examples below). *It is not* the barcode in the ui which is optional!

```json
[GET] https://esl.minew.com:9090/V1/goods/check?storeId=123&barcode=20000

response {
    "errcode": 200,
    "errmsg": "可添加"
}
```

## Example 1

Note: `id` is ***required*** and `barcode` *optional*

```json
[POST] https://esl.minew.com:9090/V1/goods?storeId=123

body: {
    "id": "20000",
    "barcode": "",
    "qrcode": "",
    "label1": "",
    "label2": "",
    "label3": "",
    "label4": "test",
    "label5": "",
    "label6": "",
    "label7": "",
    "label8": "",
    "label9": "",
    "label10": "",
    "label11": "",
    "label12": "",
    "label13": "",
    "label14": "",
    "label15": "",
    "label16": "",
    "label17": "",
    "label18": "",
    "label19": "",
    "label20": "",
    "label21": "",
    "label22": "",
    "label23": "",
    "label24": "",
    "label25": "",
    "label26": "",
    "label27": "",
    "label28": "",
    "label29": "",
    "label30": "",
    "label31": "",
    "label32": "",
    "label33": "",
    "label34": "",
    "label35": "",
    "label36": "",
    "label37": "",
    "label38": "",
    "label39": "",
    "label40": "",
    "label41": "",
    "label42": "",
    "label43": "",
    "label44": "",
    "label45": "",
    "label46": "",
    "label47": "",
    "label48": "",
    "label49": "",
    "label50": ""
}
```

## Example 2
`id` appears to be the only required field and it can contain letters
```json
[POST] https://esl.minew.com:9090/V1/goods?storeId=123
body: {
    "id": "FV00001",
    "barcode": "",
    "qrcode": "",
    "label1": "",
    "label2": "",
    "label3": "",
    "label4": "",
    "label5": "",
    "label6": "",
    "label7": "",
    "label8": "",
    "label9": "",
    "label10": "",
    "label11": "",
    "label12": "",
    "label13": "",
    "label14": "",
    "label15": "",
    "label16": "",
    "label17": "",
    "label18": "",
    "label19": "",
    "label20": "",
    "label21": "",
    "label22": "",
    "label23": "",
    "label24": "",
    "label25": "",
    "label26": "",
    "label27": "",
    "label28": "",
    "label29": "",
    "label30": "",
    "label31": "",
    "label32": "",
    "label33": "",
    "label34": "",
    "label35": "",
    "label36": "",
    "label37": "",
    "label38": "",
    "label39": "",
    "label40": "",
    "label41": "",
    "label42": "",
    "label43": "",
    "label44": "",
    "label45": "",
    "label46": "",
    "label47": "",
    "label48": "",
    "label49": "",
    "label50": ""
}
```

Attempting to add another product with the same id:

```json
response: {
  "errcode": 10000701,
  "errmsg": "已添加"
}
```
