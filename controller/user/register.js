/**
 * @api {post} /user/register 注册
 * @apiVersion 0.1.0
 * @apiName 注册
 * @apiGroup User
 *
 * @apiParam {Number} phone 手机号
 * @apiParam {String} password 密码
 * @apiParam {String} username 用户名
 * @apiParam {String} email 邮箱
 * @apiParam {String} code 验证码
 */
const mysql=require('../../utils/mysql.config');
const UUID = require('uuid');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.phone || !body.password || !body.username || !body.email || !body.code) return toSend("0","缺少参数");
    conn.connect();
    conn.query(`SELECT * FROM user where email='${body.email}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length>0) return toSend("0","该邮箱已注册！");
        if(res.length==0){
            conn.query(`select code from user_code where email='${body.email}'`,(err,res2)=>{
                if(err) return toSend("0","系统错误！");
                const {code} =res2[0];
                if(code!=body.code) return toSend("0","验证码错误！");
                conn.query(`INSERT INTO user (userid,phone,password,email,username) VALUES (
                    '${UUID.v1().replace(/-/g,'')}','${body.phone}','${body.password}','${body.email}','${body.username}')`,(err,res)=>{
                    if(err) return toSend("0","系统错误！");
                    toSend("1","注册成功！");
                })
            })
        }
    })
}