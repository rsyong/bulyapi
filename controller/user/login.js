/**
 * @api {post} /user/login 登录
 * @apiVersion 0.1.0
 * @apiName login
 * @apiGroup User
 *
 * @apiParam {Number} phone 手机号
 * @apiParam {String} password 密码
 *
 * @apiSuccess {String}   userid        用户ID
 * @apiSuccess {String}     phone    手机号
 * @apiSuccess {String}     password    密码
 * @apiSuccess {String} email     邮箱
 * @apiSuccess {String}  head 头像
 * @apiSuccess {String}   username   用户名
 *
 * @apiSuccessExample Response (example):
 *     {
            "code": "1",
            "msg": "登录成功！",
            "data": {
                "id": 4,
                "userid": "ec15313004f211ea8fd7c3887249b9f5",
                "phone": "13594284610",
                "password": "ranran",
                "email": "409431858@qq.com",
                "head": null,
                "username": "ran",
                "time": "2019-11-12T06:06:03.000Z"
            }
        }
 */
const mysql=require('../../utils/mysql.config');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.phone || !body.password) return toSend("0","缺少参数");
    conn.connect();
    conn.query(`SELECT * FROM user where phone='${body.phone}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length==0) return toSend("0","该用户未注册！");
        if(res.length>0){
            if(body.password == res[0].password){
                return toSend("1","登录成功！",res[0]);
            }else{
                return toSend("0","密码错误！");
            }
        }
    })
}