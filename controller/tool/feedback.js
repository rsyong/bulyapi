/**
 * @api {post}   /tool/feedback 意见反馈
 * @apiVersion  0.1.0
 * @apiName feedback
 * @apiGroup tool
 *
 * @apiParam {String} userid 反馈人id
 * @apiParam {String} username 用户名字
 * @apiParam {String} title 标题 
 * @apiParam {String} content 内容 
 * @apiSuccessExample Response (example):
 * {
    "code": "1",
    "msg": "反馈成功",
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
    let {userid,username,title,content} = body;

    if(!userid || !username || !title || !content) return toSend("0","缺少参数");

    conn.connect();
    conn.query(`insert into tool (userid,username,title,content) values (
        '${userid}','${username}','${title}','${content}'
    )`,(err,res)=>{
        if(err) return toSend("0","系统错误");
        return toSend("1","反馈成功");
    })
}