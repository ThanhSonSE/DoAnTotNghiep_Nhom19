const aws = require("aws-sdk");
const fs = require("fs");

aws.config.update({
    region : "local",
    endpoint : "http://localhost:8000"
});

let duLieu = JSON.parse(fs.readFileSync("./nguoidung.json","utf8"));

let docClient = new aws.DynamoDB.DocumentClient();

duLieu.forEach((item) => {
    let params = {
        TableName : "NguoiDung",
        Item : {
            "loaiTaiKhoan" : item.loaiTaiKhoan,
            "email" : item.email,    
            "password" : item.password,
            "soDienThoai" : item.soDienThoai,
            "tenNguoiDung" : item.tenNguoiDung,
            "tinhTrang" : item.tinhTrang
        }
    };

    docClient.put(params,(err,data)=>{
        if(err){
            console.error(`Thêm thất bại vì ${err}`);
        }else console.log(`Thêm thành công`);
    });
});