var express = require('express');
var router = express.Router();

// 数据库配置
var mysql = require('mysql');
var config = require('../mysql/config');

var pool = mysql.createPool(config.mysql);

/* grade.html */
// router.get('/', function(req, res, next) {
//   // res.send('这应该是听众登录的情况!');
//   var user = req.query.user;
//   res.locals.user = user;
//   res.locals.master = "陆兆亮";
//   res.locals.topic = "《XAML培训》";
//   res.render('grade');
// });


/* grade.html */
router.get('/', function(req, res, next) {
  // res.send('这应该是听众登录的情况!');
  
  pool.getConnection(function(err, connection){
    var user = req.query.user;
    res.locals.user = user;
    var mysql ="SELECT * FROM teach_table WHERE is_talking=1"
    connection.query(mysql, function (err, result) {
        console.log(result);
        var user = req.query.user;
        res.locals.user = user;
        res.locals.master = result[0].true_name;
        res.locals.topic = result[0].class;
        res.render('grade');
        connection.release();// 释放连接
     });
  });
  

});


router.post('/',function(req, res, next){
  //获取前台请求的参数
  var username = req.body.username;
  var score = req.body.score;
  // console.log("getData:"+username + "," +score);
 pool.getConnection(function (err, connection) {
  //操作数据库
  // 判断是否已经打过分
  var serch_haveGrade = "select have_grade from users where user_name=?";
  connection.query(serch_haveGrade, [username], function (err, result) {
    var graded = result;
    // console.log(graded)
    if(graded[0].have_grade === 1){//已经打过分了
            result = {
                  code: "3",
                  msg: '已经打过分了'
            };
            res.json(result); // 以json形式，把操作结果返回给前台页面
            connection.release();// 释放连接
    }else{//还没打分,开始打分
        var $sql = "update users set your_grade=? where user_name=?";
         connection.query($sql, [score,username], function (err, result) {
            var resultJson = result;
            // console.log(resultJson);
            if (resultJson.changedRows === 1) {//users表字段添加成功
                var sql1="update teach_table set total_score=total_score+?,all_people=all_people+1,average=total_score/all_people where is_talking=1";
                  connection.query(sql1, [score], function (err, result) {
                    var resultSuccsee = result;
                    // console.log(resultSuccsee);
                    if(resultSuccsee.changedRows ===1){//technology表计算平均分成功

                      var have_gradeSql ="update users set have_grade=1 where user_name=?"
                      connection.query(have_gradeSql, [username], function (err, result) {
                        var have_result = result;
                        if(have_result.changedRows ===1){//打分判断变成1
                          result = {
                            code: "1",
                            msg: '打分成功'
                          };
                          res.json(result); // 以json形式，把操作结果返回给前台页面
                          connection.release();// 释放连接
                        }else{        //打分判断变成1失败
                          result = {
                            code: "0",
                            msg: '打分失败'
                          };
                          res.json(result); // 以json形式，把操作结果返回给前台页面
                          connection.release();// 释放连接
                        }
                      });//have_grade状态变1
                      
                    }else{//technology表计算平均分失败
                        result = {
                          code: "0",
                          msg: '打分失败'
                        };
                        res.json(result); // 以json形式，把操作结果返回给前台页面
                        connection.release();// 释放连接
                    }
                  });//technology表操作

            }else{
                result = {
                  code: "0",
                  msg: '打分失败'
                };
                res.json(result); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            }
         })

    }
  })

 	
 })

});

module.exports = router;
