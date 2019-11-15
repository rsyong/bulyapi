/**
 * @api {get} /bg/list 查询记录
 * @apiVersion 0.1.0
 * @apiName 查询记录list
 * @apiGroup Bg
 *
 * @apiParam {String} project_id *项目id
 * @apiParam {Number} type 类型 type=1我创建的 type=2 分配给我 type=3 紧急bug type=4最新bug  *传type=1、type=2必传userid
 * @apiParam {String} userid 用户id
 * @apiParam {Number} page 分页(不传显示全部)
 * @apiSuccessExample Response (example):
 *     {
    "code": "1",
    "msg": "查询成功！",
    "data": {
        "allPage": 11, //总页数
        "currentPage": "2", //当前页
        "data": [
            {
                "id": 11,
                "bg_id": null,
                "project_id": "9c99dc90051611eab17c0d4fd16d9c36",
                "userid": null,
                "title": null,
                "priority": null,
                "dealing_people": null,
                "describes": null,
                "type": null,
                "closing_date": null,
                "severity": null,
                "status": 0,
                "time": "2019-11-15T06:15:48.000Z"
            }
        ]
    }
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
    let sql2=sql.replace("*","count(1)");
    const {page} =body;
    if(page){
        var start = (page - 1) * 10;
        sql+=` limit ${start},10`;
    }
    conn.query(sql, (err, res) => {
        if (err) return toSend("0", "系统错误！");
        // 计算总页数
        conn.query(sql2+" ; "+sql,(err,res2)=>{
            if (err) return toSend("0", "系统错误！");
            var allPage = res2[0]['count(1)'];
            toSend("1", "查询成功！", {
                allPage:allPage,
                currentPage:page,
                data:res
            });
        })
    })
}