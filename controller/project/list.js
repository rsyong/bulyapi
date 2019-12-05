/**
 * @api {get} /project/list 查询项目列表
 * @apiVersion 0.1.0
 * @apiName 查询项目list
 * @apiGroup project
 *
 * @apiParam {String} userid 用户id
 * @apiSuccessExample Response (example):
 * {
    "code": "1",
    "msg": "查询成功！",
    "data": [
        {
            "id": 2,
            "project_name": "测试", //项目名字
            "project_user": "ec15313004f211ea8fd7c3887249b9f5", //创建者
            "username": "test", //创建者名字
            "project_id": "48e51f7004f711ea8ddead8f4671599b", //项目id
            "parject_team": "ec15313004f211ea8fd7c3887249b9f5",
            "parject_img": null, //项目图片
            "time": "2019-12-02T07:31:10.000Z"
        }
    ]
}
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