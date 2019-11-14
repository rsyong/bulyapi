/**
 * @api {get} /project/team 查询项目成员
 * @apiVersion 0.1.0
 * @apiName 查询项目成员team
 * @apiGroup project
 *
 * @apiParam {String} project_id 项目id
 * @apiSuccessExample Response (example):
 *     {
    "code": "1",
    "msg": "查询成功！",
    "data": [
        {
            "id": 4,
            "userid": "ec15313004f211ea8fd7c3887249b9f5",
            "phone": "13594284610",
            "password": "ranran",
            "email": "409431858@qq.com",
            "head": null,
            "username": "ran",
            "time": "2019-11-12T06:06:03.000Z"
        },
        {
            "id": 3,
            "userid": "d08ed60004f211ea8fd7c3887249b9f5",
            "phone": "135942846101",
            "password": "ranran1",
            "email": "",
            "head": null,
            "username": "ran1",
            "time": "2019-11-13T07:42:49.000Z"
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
    if(!body.project_id) return toSend("0","缺少参数");
    conn.connect();
    //查询当前项目下有多少成员
    conn.query(`SELECT parject_team FROM project where project_id='${body.project_id}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        let fors=[];
        res.forEach((item,index)=>{
            fors.push(
                new Promise((resolve,reject)=>{
                    conn.query(`SELECT * FROM user where userid='${item.parject_team}'`,(err,res2)=>{
                        if(err) {
                            toSend("0","查询错误！");
                            return reject(); 
                        };
                        resolve(res2[0]);
                    })
                })
            )
        })
        Promise.all(fors).then(res=>{
            toSend("1","查询成功！",res);
        });
    })
}