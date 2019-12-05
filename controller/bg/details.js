/**
 * @api {get} /bg/details 查询记录详情
 * @apiVersion 0.1.0
 * @apiName details
 * @apiGroup Bg
 *
 * @apiParam {String} bg_id *项目id
 * @apiSuccessExample Response (example):
 *  {
    "code": "1",
    "msg": "查询成功",
    "data": {
        "id": 4,
        "bg_id": "5605d5c0171011ea905d7d901936236b", //记录id
        "project_id": "9c99dc90051611eab17c0d4fd16d9c36", //项目id
        "userid": "ec15313004f211ea8fd7c3887249b9f5", //用户id
        "title": "测试", //标题
        "priority": "1", //优先级
        "dealing_people": "d08ed60004f211ea8fd7c3887249b9f5", //处理人id
        "describes": "学生端顶部滑动会出现一根线条", //详情
        "type": "1", //类型
        "closing_date": "2019/12/25",  //最迟处理时期
        "severity": "2", //严重程度
        "status": "0", //状态 1 已解决 2未解决 3未解决并转发 4关闭bug
        "dealing_name": null, //处理人名字
        "dealing_desc": "", //处理人说明
        "time": "2019-12-05T03:35:44.000Z" //日期
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
    if (!body.bg_id) return toSend("0", "缺少参数");
    conn.connect();
    conn.query(`select * from bg where bg_id='${body.bg_id}' limit 1`, (err, res) => {
        if(err) return toSend("0","系统错误");
        if(res.length==0) return toSend("0","没有该记录");
        return toSend("1","查询成功",res[0]);
    })
}