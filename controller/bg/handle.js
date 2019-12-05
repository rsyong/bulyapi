/**
 * @api {post}   /bg/handle  处理bug记录
 * @apiVersion  0.1.0
 * @apiName handle
 * @apiGroup  Bg
 *
 * @apiParam {String} bg_id 项目id
 * @apiParam {String} status 状态 1 已解决 2未解决 3未解决并转发 4关闭bug
 * @apiParam {String} new_dealing_id 新的处理人id status=3 必填
 * @apiParam {String} dealing_desc 处理人说明
 * @apiSuccessExample Response (example):
 * {
    "code": "1",
    "msg": "修改成功",
    "data": []
    }
 */
const mysql = require('../../utils/mysql.config');
module.exports = (req, send) => {
    const body = req.body;
    const conn = mysql.init();
    const toSend = (code, msg, data = []) => {
        send.json({ code, msg, data });
        conn.end();
    }
    if (!body.bg_id || !body.status) return toSend("0", "缺少参数");
    conn.connect();
    let sql=`update bg set status='${body.status}',dealing_desc='${body.dealing_desc || ""}' where bg_id='${body.bg_id}'`;
    const change=()=>{
        conn.query(sql,(err,res)=>{
            if(err) return toSend("0","系统错误！");
            return toSend("1","处理成功！");
        })
    }
    if(body.status==3){
        if (!body.new_dealing_id) return toSend("0", "缺少参数new_dealing_id");
        conn.query(`select describes,dealing_name from bg where bg_id='${body.bg_id}'`,(err,res)=>{
            if(err)  return toSend("0", "系统错误");
            if(res.length==0)   return toSend("0", "没有该记录");
            let {describes,dealing_name}=res[0];
            describes+='<br />##'+dealing_name+':<br />'+ body.dealing_desc || '';
            conn.query(`select username from user where userid='${body.new_dealing_id}'`,(err,res)=>{
                if(err) return toSend("0", "系统错误");
                if(res.length==0) return toSend("0", "该用户未注册");
                const {username} =res[0];
                sql=`update bg set status='${body.status}',describes='${describes}',dealing_people='${body.new_dealing_id}',dealing_name='${username}' where bg_id='${body.bg_id}'`;
                change();
            })
        })
    }else if(body.status==4){
        conn.query(sql,(err,res)=>{
            if(err) return toSend("0","系统错误！");
            conn.query(`insert into bg_old select * from bg where bg_id='${body.bg_id}'`,(err,res)=>{
                if(err) return toSend("0", "系统错误");
                if(res.affectedRows==1){
                    conn.query(`delete from bg where bg_id='${body.bg_id}'`,(err,res)=>{
                        if(err) return toSend("0", "系统错误");
                        return toSend("1", "修改成功");
                    })
                }else{
                    return toSend("0", "添加失败");
                }
            })
        })
    }else{
        change();
    }
}