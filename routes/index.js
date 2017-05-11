var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../mysql/config');

var pool = mysql.createPool(config.mysql);

router.get('/',function(req, res, next){
  res.redirect('/index');
});
/* GET home page. 这是登录和注册的情况*/
router.get('/index', function(req, res, next) {
  res.render('index');
});

//登录接口
router.post('/index/login', function (req, res, next) {
  var username = req.body.username;//获取前台请求的参数
  var password = req.body.password;
  console.log("getData:"+username + "," +password);
  pool.getConnection(function (err, connection) {
    //先判断该账号是否存在
    var $sql = "select * from users where user_name=?";
    connection.query($sql, [username], function (err, result) {
      var resultJson = result;
      if (resultJson.length === 0) {
        result = {
          code: "0",
          msg: '该账号不存在'
        };
        res.json(result); // 以json形式，把操作结果返回给前台页面
        connection.release();// 释放连接
      } else {  
      //账号存在，可以登录，进行密码判断
      var $sql1 = "select * from users where user_name=?";
      connection.query($sql1, [username], function (err, result) {
        var temp = result[0].password;  //取得数据库查询字段值
        if (temp == password) {
          //密码正确
          // 判断是用户类型
          // console.log(result[0]);
          if(result[0].user_name === "admin"){
          //管理员登录
              result = {
                code: "1",
                msg: '/admin',
                user:result[0].user_name
              };
              res.json(result); // 以json形式，把操作结果返回给前台页面
          }else if(result[0].is_talking === 1 ){
          //主讲人登录
              result = {
                code: "1",
                msg: '/lottery',
                user:result[0].user_name
              };
              res.json(result); // 以json形式，把操作结果返回给前台页面

          }else{
          //听众登录
              result = {
                code: "1",
                msg: '/grade',
                user:result[0].user_name
              };
              res.json(result); // 以json形式，把操作结果返回给前台页面
          }

        } else {
          result = {
            code: "2",
            msg: '密码错误'
          };
          res.json(result); // 以json形式，把操作结果返回给前台页面
        }

        connection.release();// 释放连接
      });
      }
    });
  });
});

//注册接口
//0表示该账号被注册，1表示注册成功,2表示注册失败,3表示数据库的问题
router.post('/index/register', function (req, res, next) {
  var username = req.body.username;//获取前台请求的参数
  var password = req.body.password;
  var nickName = req.body.nickName;
  //检查用户名是否已经注册
  pool.getConnection(function(err,connection){
    var serch_username = "select * from users where user_name=?";
    connection.query(serch_username,[username],function(err,result){
      console.log(err);
      if(err){
        res.send(JSON.stringify({code:4,msg:"数据库方面有问题"}));
      }
      if(result.length>0){
        result = {
          code: "0",
          msg: '该账号已经被注册!'
        };
        res.json(result); // 以json形式，把操作结果返回给前台页面
        connection.release();// 释放连接
      }else{//账号还未被注册
            pool.getConnection(function(err,connection){
              var sql = "insert into users (user_name,password,true_name,has_talk,is_talking,have_grade) value(?,?,?,0,0,0)";
              connection.query(sql,[username,password,nickName],function(err,result){
                if(err){
                  res.send(JSON.stringify({code:3,msg:"数据库方面有问题"}));
                }else{
                  //插入成功
                  if(result){
                    //重定向到users.html
                    // res.redirect('/users');
                    jsonResult = {
                          code: "1",
                          msg: '注册成功'
                        };
                  res.json(jsonResult); // 以json形式，把操作结果返回给前台页面
                  }else{
                    jsonResult = {
                          code: "2",
                          msg: '注册失败'
                        };
                        res.json(jsonResult);
                  }

                }
              })

            });
      }
    })
  });

});


module.exports = router;
