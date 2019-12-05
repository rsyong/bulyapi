/**
 * @api {get} /bg/update 更新bug记录
 * @apiVersion 0.1.0
 * @apiName update
 * @apiGroup Bg
 *
 * @apiParam {String} userid 用户id
 * @apiParam {String} bg_id bug记录id
 * @apiParam {String} title 标题
 * @apiParam {Number} priority 优先级 1-3 最大越高
 * @apiParam {String} dealing_people 处理人
 * @apiParam {String} describes 描述详情
 * @apiParam {Number} type 类型 1、2、3
 * @apiParam {String} closing_date 截止日期
 * @apiParam {Number} severity 严重程度 1、2、3
 * @apiSuccessExample Response (example):
 *  {
    "code": "1",
    "msg": "查询成功！",
    "data": {
        "allNum": 0,
        "allPage": 0,
        "currentPage": 1,
        "data": []
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
    let {userid,bg_id} =body;
    if (!userid || !bg_id) return toSend("0", "缺少参数");
    let sql=sqlold='update bg set ';
    if(title){
        sql+=`title='${title}',`;
    }else if(priority){
        sql+=`priority='${priority}',`;
    }else if(dealing_people){
        sql+=`dealing_people='${dealing_people}',`;
    }else if(describes){
        sql+=`describes='${describes}',`;
    }else if(type){
        sql+=`type='${type}',`;
    }else if(closing_date){
        sql+=`closing_date='${closing_date}',`;
    }else if(severity){
        sql+=`severity='${severity}',`;
    }
    if(sql==sqlold) return toSend("0","最少应有一项被修改");
    if(sql.lastIndexOf(",")>-1){
        sql=sql.substring(0,sql.length-1);
    }
    sql+=` where bg_id='${bg_id}' and userid='${userid}'`;
    conn.connect();
    conn.query(sql, (err, res) => {
       if(err) return toSend("0","系统错误");
       return toSend("1","修改成功");
    })
}