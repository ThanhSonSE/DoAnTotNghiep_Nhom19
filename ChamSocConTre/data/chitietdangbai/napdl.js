const aws = require("aws-sdk");
const fs = require("fs");

aws.config.update({
    region : "local",
    endpoint : "http://localhost:8000"
});

let duLieu = JSON.parse(fs.readFileSync("./chitietdangbai.json","utf8"));

let docClient = new aws.DynamoDB.DocumentClient();

duLieu.forEach((item) => {
    let params = {
        TableName : "ChiTietDangBai",
        Item : {
            "idBai" : item.idBai,    
            "idNguoiDung" : item.idNguoiDung,
            "date" : item.date,
            "time" : item.time,
            "loaiBai" : item.loaiBai
        }
    };

    docClient.put(params,(err,data)=>{
        if(err){
            console.error(`Thêm thất bại vì ${err}`);
        }else console.log(`Thêm thành công`);
    });
});