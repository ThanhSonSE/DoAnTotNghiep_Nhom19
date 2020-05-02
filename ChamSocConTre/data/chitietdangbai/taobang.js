const aws = require("aws-sdk");

aws.config.update({
    region : "local",
    endpoint : "http://localhost:8000"
});

let dynamodb = new aws.DynamoDB();

let params = {
    TableName : "ChiTietDangBai",
    KeySchema : [
        {AttributeName : "idBai", KeyType : "HASH"},
        {AttributeName : "idNguoiDung", KeyType : "RANGE"}
    ],
    AttributeDefinitions :[
        {AttributeName : "idBai", AttributeType : "N"},
        {AttributeName : "idNguoiDung", AttributeType : "N"}
    ],
    ProvisionedThroughput : {
        ReadCapacityUnits : 10,
        WriteCapacityUnits : 10
    }
};

dynamodb.createTable(params,(err,data)=>{
    if(err){
        console.error(`Lỗi tạo ${err}`);
    }else console.log(`Tạo thành công`);
});