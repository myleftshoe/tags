# Delete Product

## Delete Single Product

``` json
// pass id to delete as url param
[DELETE] https://esl.minew.com:9090/V1/goods/[id]?storeId=123

response {
    "errcode": 200
}
```

## Batch Delete

``` json
// pass array of ids to delete
[DELETE] https://esl.minew.com:9090/V1/goods?storeId=123

body [
    "x333"
]

response {
    "errcode": 200
}

```

