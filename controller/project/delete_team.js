/**
 * @api {post}   /project/delete_team  删除成员
 * @apiVersion  0.1.0
 * @apiName delete_team
 * @apiGroup    project
 *
 * @apiParam {String} project_id 项目id
 * @apiParam {String} team_id 成员id
 * @apiSuccessExample Response (example):
 * {
    "code": "0",
    "msg": "删除失败或者没有该权限",
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
    if (!body.project_id || !body.team_id) return toSend("0", "缺少参数");
    conn.connect();
    conn.query(`delete from project where project_id='${body.project_id}' and parject_team='${body.team_id}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.affectedRows>0){
            toSend("1","删除成功！");
        }else{
            toSend("0","删除失败或者没有该权限!");
        }
    })
}