/**
 * @api {post}   /bg/delete  删除bug记录
 * @apiVersion  0.1.0
 * @apiName delete
 * @apiGroup    Bg
 *
 * @apiParam {String} bg_id 项目id
 * @apiParam {String} userid 用户id
 * @apiSuccessExample Response (example):
 * {
    "code": "0",
    "msg": "没有该bug记录!",
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
    if (!body.bg_id || !body.userid) return toSend("0", "缺少参数");
    conn.connect();
    conn.query(`delete from bg where bg_id='${body.bg_id}' and userid='${body.userid}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.affectedRows>0){
            toSend("1","删除成功！");
        }else{
            toSend("0","没有该bug记录或者没有权限!");
        }
    })
}