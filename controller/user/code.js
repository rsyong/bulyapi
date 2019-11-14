/**
 * @api {post} /user/code 获取验证码
 * @apiVersion 0.1.0
 * @apiName code
 * @apiGroup User
 *
 * @apiParam {Number} phone 手机号
 *  @apiSuccessExample Response (example):
 *     {
        "code": "1",
        "msg": "成功！",
        "data": {
            "code": "2",
            "msg": "提交成功",
            "smsid": "15736488024002871917"
        }
    }
 */
const mysql=require('../../utils/mysql.config');
var iHuyi = require("../../utils/ihuyi");
var i = new iHuyi('C81507877','b69f8e2c6aa288e33484593394a8264c');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.phone) return toSend("0","缺少参数");
    conn.connect();
    conn.query(`SELECT * FROM user where phone='${body.phone}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length>0) return toSend("0","该手机号已注册！");
        let num=parseInt(Math.random()*10000);
        conn.query(`insert into user_code (phone,code) values ('${body.phone}','${num}')`,(err,res2)=>{
            if(err) return toSend("0","系统错误！");
            i.send(body.phone,`您的验证码是：${num}。请不要把验证码泄露给其他人。`,(data)=>{
                if(data.code==2){
                    toSend("1","发送成功！",data);
                }else{
                    toSend("0","发送失败！",data);
                }
            });
        })
    })
}