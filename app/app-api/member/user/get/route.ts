
export async function GET() {
    const responseText = {
        "code": 0,
        "data": {
            "nickname": "free@hotmail.com(免费用户)",
            "avatar": "",
            "mobile": "",
            "sex": 0,
            "point": 0,
            "experience": 100,
            "level": {
                "id": 1,
                "name": "青铜",
                "level": 1,
                "icon": "http://127.0.0.1:48080/admin-api/infra/file/4/get/59a1d52ebd38cc843fb5fafc30bce85f15d6ac22c8227dc3fe775d064f71ca6e.png"
            },
            "brokerageEnabled": null,
            "products": [
                {
                    "createTime": 1726670109000,
                    "updateTime": 1726670109000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 30,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "1",
                    "productName": "9",
                    "expTime": 1756569600000
                },
                {
                    "createTime": 1726670109000,
                    "updateTime": 1726670109000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 30,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "1",
                    "productName": "8",
                    "expTime": 1756569600000
                },
                {
                    "createTime": 1726670109000,
                    "updateTime": 1726670109000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 30,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "1",
                    "productName": "6",
                    "expTime": 1756569600000
                },
                {
                    "createTime": 1726670109000,
                    "updateTime": 1726670109000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 30,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "1",
                    "productName": "7",
                    "expTime": 1756569600000
                },
                {
                    "createTime": 1725469411000,
                    "updateTime": 1726189942000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 12,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "1",
                    "productName": "4",
                    "expTime": 1756656000000
                },
                {
                    "createTime": 1725469214000,
                    "updateTime": 1725469214000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 8,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "1",
                    "productName": "1",
                    "expTime": 1757001600000
                },
                {
                    "createTime": 1725463005000,
                    "updateTime": 1735705043000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 7,
                    "userId": 1,
                    "bizId": "1",
                    "bizCode": "1",
                    "productName": "2",
                    "expTime": 1767196800000
                },
                {
                    "createTime": 1725461697000,
                    "updateTime": 1726190169000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 5,
                    "userId": 1,
                    "bizId": "2",
                    "bizCode": "0",
                    "productName": "5",
                    "expTime": 1751299200000
                },
                {
                    "createTime": 1725461269000,
                    "updateTime": 1726190183000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 3,
                    "userId": 1,
                    "bizId": "1",
                    "bizCode": "1",
                    "productName": "3",
                    "expTime": 1749830400000
                },
                {
                    "createTime": 1725461269000,
                    "updateTime": 1726190183000,
                    "creator": "1",
                    "updater": "1",
                    "deleted": false,
                    "id": 10,
                    "userId": 1,
                    "bizId": "1",
                    "bizCode": "1",
                    "productName": "10",
                    "expTime": 1749830400000
                }
            ],
            "allProducts": [
                {
                    "label": "订单中心",
                    "value": "1",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "求购",
                    "value": "2",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "UU自动上架",
                    "value": "3",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "C5Game自动上架",
                    "value": "4",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "UU自动发货",
                    "value": "5",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "饰品保险箱",
                    "value": "6",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "开箱辅助",
                    "value": "7",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "悠悠有品自动压价",
                    "value": "8",
                    "dictType": "product_name_type",
                    "status": 0
                },
                {
                    "label": "Eco自动购买",
                    "value": "9",
                    "dictType": "product_name_type",
                    "status": 0
                }
                ,
                {
                    "label": "C5自动购买",
                    "value": "10",
                    "dictType": "product_name_type",
                    "status": 0
                }
            ]
        },
        "msg": ""
    }

    return Response.json(responseText);
}
