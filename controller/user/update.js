/**
 * @api {post} /user/update 更新资料
 * @apiVersion 0.1.0
 * @apiName update
 * @apiGroup User
 *
 * @apiParam {String}   userid   *用户ID
 * @apiParam {Number} phone 手机号
 * @apiParam {String}  head 头像
 * @apiParam {String}  username   用户名
 * @apiParam {String}  password   密码
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
    if(!body.userid) return toSend("0","缺少参数userid");
    conn.connect();
    conn.query(`SELECT * FROM user where userid='${body.userid}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length==0) return toSend("0","该用户未注册！");
        if(res.length>0){
            changeUser();
        }
    })
    const changeUser=()=>{
        let sql=sqlold=`update user set `;
        let {phone,head,username,password}=body;
        if(phone){
            if(!By.isTelCode(phone)) return toSend("0","手机号格式有误！");
            sql+=`phone='${phone}',`;
        }else if(head){
            sql+=`head='${head}',`;
        }else if(username){
            if(username.length<4) return toSend("0","用户名至少4位");
            sql+=`username='${username}',`;
        }else if(password){
            if(password.length<6) return toSend("0","密码至少6位");
            sql+=`password='${password}',`;
        }
        if(sql==sqlold){
            return toSend("0","最少应有一项被修改");
        }
        if(sql.lastIndexOf(",")>-1){
            sql=sql.substring(0,sql.length-1);
        }
        sql+=` where userid='${body.userid}'`;
        conn.query(sql,(err,res)=>{
            if(err) return toSend("0","系统错误！");
            toSend("1","修改成功！");
        })
    }
}