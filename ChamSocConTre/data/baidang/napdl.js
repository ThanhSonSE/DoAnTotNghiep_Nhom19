const aws = require("aws-sdk");
const fs = require("fs");

aws.config.update({
    region : "local",
    endpoint : "http://localhost:8000"
});

let duLieu = JSON.parse(fs.readFileSync("./baidang.json","utf8"));

let docClient = new aws.DynamoDB.DocumentClient();

duLieu.forEach((item) => {
    let params = {
        TableName : "BaiDang",
        Item : {
            "idLoai" : item.idLoai,
            "idBai" : item.idBai,    
            "tieuDe" : item.tieuDe,
            "noiDungTomTat" : item.noiDungTomTat,
            "tinhTrang" : item.tinhTrang,
            "noiDung" : item.noiDung
        }
    };

    docClient.put(params,(err,data)=>{
        if(err){
            console.error(`Thêm thất bại vì ${err}`);
        }else console.log(`Thêm thành công`);
    });
});