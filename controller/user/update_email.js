/**
 * @api {post} /user/update_email 更新邮箱
 * @apiVersion 0.1.0
 * @apiName update_email
 * @apiGroup User
 *
 * @apiParam {String} userid   *用户ID
 * @apiParam {String} email *邮箱
 * @apiParam {String} code *验证码
 *
 * @apiSuccessExample Response (example):
 *  {
        "code": "1",
        "msg": "修改成功！",
        "data": []
    }
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
    if(!body.userid || !body.email || !body.code) return toSend("0","缺少参数");
    if(!By.IsEmail(body.email)) return toSend("0","邮箱错误！");
    conn.connect();
    conn.query(`SELECT * FROM user where userid='${body.userid}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length==0) return toSend("0","该用户未注册！");
        changeUser();
    })
    const changeUser=()=>{
        let {email,code,userid}=body;
        conn.query(`select * from user_code where email='${email}' limit 1`,(err,res2)=>{
            if(err) return toSend("0","系统错误！");
            if(res2.length==0) return toSend("0","请发送验证码！");
            if(code==res2[0].code){
                conn.query(`update user set email='${email}' where userid='${userid}'`,(err,res3)=>{
                    if(err) return toSend("0","系统错误！");
                    return toSend("1","修改成功！");
                })
            }else{
                return toSend("0","验证码错误！");
            }
        })
    }
}