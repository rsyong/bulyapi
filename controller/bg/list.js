/**
 * @api {get} /bg/list 查询记录
 * @apiVersion 0.1.0
 * @apiName 查询记录list
 * @apiGroup Bg
 *
 * @apiParam {String} project_id 项目id
 * @apiParam {Number} type 类型 type=1我创建的 type=2 分配给我 type=3 紧急bug type=4最新bug  *传type=1、type=2必传userid
 * @apiParam {String} userid 用户id 
 * @apiSuccessExample Response (example):
 *     {
        "code": "1",
        "msg": "查询成功！",
        "data": [
            {
                "id": 2,
                "bg_id": "e7b79810052111ea81d001335ce64cfb",
                "project_id": "9c99dc90051611eab17c0d4fd16d9c36",
                "userid": "ec15313004f211ea8fd7c3887249b9f5",
                "title": "测试bug",
                "priority": 1,
                "dealing_people": "d08ed60004f211ea8fd7c3887249b9f5",
                "describes": "学生端顶部滑动会出现一根线条",
                "type": 1,
                "closing_date": "2019-11-19T16:00:00.000Z",
                "severity": 3,
                "status": 0,
                "time": "2019-11-13T01:53:39.000Z"
            }
        ]
    }
 */
const mysql = require('../../utils/mysql.config');
module.exports = (req, send) => {
    const body = req.query;
    const conn = mysql.init();
    const toSend = (code, msg, data = []) => {
        send.json({ code, msg, data });
        conn.end();
    }
    if (!body.project_id) return toSend("0", "缺少参数");
    conn.connect();
    let sql = `SELECT * FROM bg where project_id='${body.project_id}'`;
    if (body.type) {
        switch (body.type) {
            case '1':
                sql = `SELECT * FROM bg where project_id='${body.project_id}' AND userid='${body.userid}'`;
                break;
            case '2':
                sql = `SELECT * FROM bg where project_id='${body.project_id}' AND dealing_people='${body.userid}'`;
                break;
            case '3':
                sql = `SELECT * FROM bg where project_id='${body.project_id}' AND severity>'2'`;
                break;
            case '4':
                sql = `SELECT * FROM bg where project_id='${body.project_id}' AND date_sub(CURDATE(),INTERVAL 7 DAY) <= DATE(time)`;
                break;
            default:
                break;
        }
    };
    conn.query(sql, (err, res) => {
        if (err) return toSend("0", "系统错误！");
        toSend("1", "查询成功！", res);
    })
}