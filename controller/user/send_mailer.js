/**
 * @api {post} /user/send_mailer 发送邮箱验证码
 * @apiVersion 0.1.0
 * @apiName send_mailer
 * @apiGroup User
 *
 * @apiParam {String} email 邮箱
 *  @apiSuccessExample Response (example):
 *     {
        "code": "1",
        "msg": "发送成功！",
        "data": "250 Ok: queued as "
    }
 */
const mysql=require('../../utils/mysql.config');
const sendMail=require('../../utils/sendMail');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.email) return toSend("0","缺少参数");
    conn.connect();
    conn.query(`SELECT * FROM user where email='${body.email}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length>0) return toSend("0","该邮箱已注册！");
        let num=parseInt(Math.random()*10000);

        conn.query(`select email from user_code where email='${body.email}'`,(err,res2)=>{
            if(err) return toSend("0","系统错误！");
            if(res2.length==0){
                conn.query(`insert into user_code (email,code) values ('${body.email}','${num}')`,(err,res)=>{
                    if(err) return toSend("0","系统错误！");
                    sendMail.send(body.email,'用【'+num+'】作为你的验证码。',(err,info)=>{
                        if(err) return toSend("0","系统错误！");
                        toSend("1","发送成功！",info.response);
                    });
                })
            }else{
                conn.query(`update user_code set code='${num}' where email='${body.email}'`,(err,res3)=>{
                    if(err) return toSend("0","系统错误！");
                    sendMail.send(body.email,'用【<b style="color:red">'+num+'</b>】作为你的验证码。',(err,info)=>{
                        if(err) return toSend("0","系统错误！");
                        toSend("1","发送成功！",info.response);
                    });
                })
            }
        })
    })
}