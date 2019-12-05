/**
 * @api {get} /bg/search 搜索记录
 * @apiVersion 0.1.0
 * @apiName search
 * @apiGroup Bg
 *
 * @apiParam {String} value *关键字
 * @apiParam {String} page 分页 不传 默认查当前10条数据
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
    let {value,page} =body;
    if (!value) return toSend("0", "缺少参数");

    const towhere='bg_id,title,priority,dealing_name,type,status,time';
    let sql=`select ${towhere} from bg where title like '%${value}%'`;
    let sql2=sql.replace(`${towhere}`,"count(1)");
    if(!page) page=1;
    var start = (page - 1) * 10;

    sql+=` limit ${start},10`;
   
    conn.connect();
    conn.query(sql, (err, res) => {
       if(err) return toSend("0","系统错误");
       // 计算总页数
       conn.query(sql2,(err,res2)=>{
            if (err) return toSend("0", "系统错误！");
            let allNum = res2[0]['count(1)'];
            toSend("1", "查询成功！", {
                allNum:allNum,
                allPage:Math.ceil(allNum/10),
                currentPage:page || 1,
                data:res
            });
        })
    })
}