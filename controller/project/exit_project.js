/**
 * @api {post}   /project/exit_project  退出项目
 * @apiVersion  0.1.0
 * @apiName exit_project
 * @apiGroup    project
 *
 * @apiParam {String} project_id 项目id
 * @apiParam {String} userid 用户id
 * @apiSuccessExample Response (example):
 * {
    "code": "1",
    "msg": "退出成功！",
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
    conn.query(`delete from project where project_id='${body.project_id}' and parject_team='${body.userid}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.affectedRows>0){
            toSend("1","退出成功！");
        }else{
            toSend("0","退出失败或者没有权限!");
        }
    })
}