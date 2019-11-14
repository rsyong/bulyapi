/**
 * @api {post}   /project/project  添加项目
 * @apiVersion  0.1.0
 * @apiName 添加项目
 * @apiGroup    project
 *
 * @apiParam {String} project_name 项目名
 * @apiParam {String} userid 用户id
 */
const mysql = require('../../utils/mysql.config');
const UUID = require('uuid');
module.exports = (req, send) => {
    const body = req.body;
    const conn = mysql.init();
    const toSend = (code, msg, data = []) => {
        send.json({ code, msg, data });
        conn.end();
    }
    if (!body.project_name || !body.userid) return toSend("0", "缺少参数");
    conn.connect();
    conn.query(`SELECT * FROM user where userid='${body.userid}'`, (err, res) => {
        if (err) return toSend("0", "系统错误！");
        if (res.length > 0) {
            conn.query(`INSERT INTO project (project_name,project_user,username,project_id,parject_team,parject_img) VALUES (
                '${body.project_name}','${body.userid}','${res[0].username}','${UUID.v1().replace(/-/g, "")}','${body.userid}','${body.img || ""}'
            )`, (err, res) => {
                if (err) return toSend("0", "系统错误！");
                return toSend("1", "添加成功！");
            })
        } else {
            return toSend("0", "userid无效！");
        }
    })

}