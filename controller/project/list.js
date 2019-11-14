/**
 * @api {get} /project/list 查询项目列表
 * @apiVersion 0.1.0
 * @apiName 查询项目list
 * @apiGroup project
 *
 * @apiParam {String} userid 用户id
 */
const mysql=require('../../utils/mysql.config');
module.exports=(req,send)=>{
    const body=req.query;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.userid) return toSend("0","缺少参数");
    conn.connect();
    conn.query(`SELECT * FROM project where parject_team='${body.userid}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        toSend("1","查询成功！",res);
    })
}