/**
 * @api {post} /user/register 注册
 * @apiVersion 0.1.0
 * @apiName register
 * @apiGroup User
 *
 * @apiParam {Number} phone 手机号 可选
 * @apiParam {String} password 密码
 * @apiParam {String} username 用户名
 * @apiParam {String} email 邮箱
 * @apiParam {String} code 验证码
 */
const mysql=require('../../utils/mysql.config');
const By=require('../../utils/By');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.password || !body.username || !body.email || !body.code) return toSend("0","缺少参数");
    if(!body.phone){
        body.phone="";
    }
    if(!By.IsEmail(body.email)) return toSend("0","邮箱格式有误！");
    if(body.password.length<6) return toSend("0","密码最少6位！");
    if(body.username.length<4) return toSend("0","用户名最少4位！");
    conn.connect();
    conn.query(`SELECT * FROM user where email='${body.email}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length>0) return toSend("0","该邮箱已注册！");
        if(res.length==0){
            conn.query(`select code from user_code where email='${body.email}'`,(err,res2)=>{
                if(err) return toSend("0","系统错误！");
                if(res2.length==0) return toSend("0","请发送验证码！");
                const {code} =res2[0];
                if(code!=body.code) return toSend("0","验证码错误！");
                conn.query(`INSERT INTO user (userid,phone,password,email,username) VALUES (
                    '${By.uuid()}','${body.phone}','${body.password}','${body.email}','${body.username}')`,(err,res)=>{
                    if(err) return toSend("0","系统错误！");
                    toSend("1","注册成功！");
                })
            })
        }
    })
}