/**
 * @api {post}   /project/delete  删除项目
 * @apiVersion  0.1.0
 * @apiName delete
 * @apiGroup    project
 *
 * @apiParam {String} project_id 项目id
 * @apiParam {String} userid 用户id
 * @apiSuccessExample Response (example):
 * {
    "code": "0",
    "msg": "没有该记录!",
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
    if (!body.project_id || !body.userid) return toSend("0", "缺少参数");
    conn.connect();
    conn.query(`delete from project where project_id='${body.project_id}' and project_user='${body.userid}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.affectedRows>0){
            conn.query(`delete from bg where project_id='${body.project_id}'`,(err,res)=>{
                if(err)  return toSend("0","系统错误！");
                conn.query(`delete from bg_old where project_id='${body.project_id}'`,(err,res)=>{
                    if(err)  return toSend("0","系统错误！");
                    return toSend("1","删除成功");
                });
            });
        }else{
            toSend("0","删除失败或者没有权限!");
        }
    })
}