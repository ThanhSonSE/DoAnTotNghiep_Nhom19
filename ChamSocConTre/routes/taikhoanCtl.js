var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

const AWS = require('aws-sdk');

AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var urlencodeParser = bodyParser.urlencoded({ extended: false });

router.get('/', function (req, res, next) {
    var sess = req.session;
    var nd = sess.nd;
    if (!nd) {
        res.render('taikhoan', { thongbao: 0 });
    } else {
        if (nd.loaiTaiKhoan === 1) {
            res.render('admin', { nd: nd });
        } else if (nd.loaiTaiKhoan === 0) {
            res.render('nguoidung', { nd: nd });
        }
    }
    return;
});

router.post('/dangnhap', urlencodeParser, function (req, res, next) {

    var sess = req.session;
    var email = req.body.email;
    var password = req.body.password;

    let params = {
        TableName: "NguoiDung"
    };

    params.FilterExpression = '#email = :email';
    params.ExpressionAttributeNames = { '#email': 'email' };
    params.ExpressionAttributeValues = { ':email': String(email) };
    docClient.scan(params, (err, data) => {
        if (err) {
            res.render('file404');
        } else {
            console.log(data.Items.length);
            if (data.Items.length === 0) {
                res.render('taikhoan', { thongbao: "Không có" });
            } else {
                data.Items.forEach((nd) => {
                    if (nd.password === password) {
                        sess.nd = nd;
                        if (nd.loaiTaiKhoan === 1) {
                            res.render('admin', { nd: nd });
                        } else if (nd.loaiTaiKhoan === 0) {
                            res.render('nguoidung', { nd: nd });
                        }
                    } else {
                        res.render('taikhoan', { thongbao: "pass sai" });
                    }
                });
            }
        }
        res.end();
        return;
    });
});

router.get('/dangxuat', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            res.render('file404');
        }
        res.render('taikhoan', { thongbao: 0 });
    });
});

router.post('/dangky', urlencodeParser,function (req, res, next) {

    let email = req.body.email;
    let tenNguoiDung = req.body.tenNguoiDung;
    let password = req.body.password;
    let soDienThoai = req.body.soDienThoai;

    console.log(email+"-"+tenNguoiDung+"-"+password+"-"+soDienThoai);

    let par = {
      TableName: "NguoiDung"
    };
  
    par.FilterExpression = '#email = :email';
    par.ExpressionAttributeNames = { '#email': 'email' };
    par.ExpressionAttributeValues = { ':email': String(email) };
    docClient.scan(par, (err, data) => {
      if (err) {
        res.render('file404');
        return;
      } else {
        if (data.Items.length === 0) {
          let params = {
            TableName: 'NguoiDung',
            Item: {
              "loaiTaiKhoan" : Number(0),
              "email": String(email),
              "password": String(password),
              "soDienThoai": String(soDienThoai),
              "tenNguoiDung": String(tenNguoiDung),
              "tinhTrang" : Number(1)
            }
          };
          docClient.put(params, (err, data) => {
            if (err) {
              res.render('file404');
              return;
            }
            else {
              res.render('taikhoan', { thongbao: "đăng ký thành công" }); 
              return; 
            }
          });    
        }else{
          res.render('taikhoan', { thongbao: "email bị trùng" });
          return;
        }   
        return; 
      }
    });
  });

  router.get('/ktemail/:email', urlencodeParser,function (req, res, next) {

    let email = req.params.email;

    console.log(email);

    let par = {
      TableName: "NguoiDung"
    };
  
    par.FilterExpression = '#email = :email';
    par.ExpressionAttributeNames = { '#email': 'email' };
    par.ExpressionAttributeValues = { ':email': String(email) };
    docClient.scan(par, (err, data) => {
      if (err) {
        res.render('file404');
        return;
      } else {
        if (data.Items.length === 0) {
          res.send("0");
        }else{
          res.send("email bị trùng");
        }   
        return; 
      }
    });
  });

module.exports = router;