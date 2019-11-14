/**
 * @api {post} /bg/addbg 添加bug记录
 * @apiVersion 0.1.0
 * @apiName 添加记录addbg
 * @apiGroup Bg
 *
 * @apiParam {String} project_id 项目id
 * @apiParam {String} userid 用户id
 * @apiParam {String} title 标题
 * @apiParam {Number} priority 优先级 1-3 最大越高
 * @apiParam {String} dealing_people 处理人
 * @apiParam {String} describes 描述详情
 * @apiParam {Number} type 类型 1、2、3
 * @apiParam {String} closing_date 截止日期
 * @apiParam {Number} severity 严重程度 1、2、3
 */
const mysql=require('../../utils/mysql.config');
const UUID = require('uuid');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    //项目ID  用户id 标题 优先级 处理人 描述 类型 截止时间 严重程度
    const {project_id,userid,title,priority,dealing_people,describes,type,closing_date,severity} = body;
    if(!project_id || !userid || !title || !priority ||!dealing_people ||!describes || !type || 
        !closing_date || !severity) return toSend("0","缺少参数");
    if(!(isNaN(closing_date)&&!isNaN(Date.parse(closing_date)))){
    　　return toSend("0","日期格式错误！");
    }
    if(isNaN(priority)) return toSend("0","priority字段需int类型");
    if(isNaN(type)) return toSend("0","type字段需int类型");
    if(isNaN(severity)) return toSend("0","severity字段需int类型");
    conn.connect();
    conn.query(`INSERT INTO bg (bg_id,project_id,userid,title,priority,dealing_people,describes,type,closing_date,severity) VALUES (
        '${UUID.v1().replace(/-/g,"")}','${project_id}','${userid}','${title}','${priority}','${dealing_people}','${describes}','${type}',
        '${closing_date}','${severity}'
    )`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        return toSend("1","添加成功！");
    })
}