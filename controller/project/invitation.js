/**
 * @api {post} /project/invitation 邀请成员
 * @apiVersion 0.1.0
 * @apiName 查询邀请成员invitation
 * @apiGroup project
 *
 * @apiParam {String} project_id 项目id
 * @apiParam {String} invitation_email 邀请人邮箱
 * @apiSuccessExample Response (example):
*     {
        "code": "1",
        "msg": "添加成功！",
        "data": []
    }
 */
const mysql=require('../../utils/mysql.config');
const By=require('../../utils/By');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.project_id) return toSend("0","缺少参数project_id");
    if(!body.invitation_email) return toSend("0","缺少参数invitation_email");
    if(!By.IsEmail(body.invitation_email)) return toSend("0","邮箱格式错误");
    conn.connect();
    conn.query(`select * from project where project_id='${body.project_id}' limit 1`,(err,res)=>{
        if(err) return toSend("0","查询失败！");
        if(res.length==0) return toSend("0","没有该项目！");
        const {project_name,project_user,project_id,parject_img} = res[0];
        conn.query(`select * from user where email='${body.invitation_email}'`,(err,res2)=>{
            if(err) return toSend("0","查询失败！");
            if(res2.length==0) return toSend("0","该用户未注册！");
            const {username,userid}=res2[0];
            conn.query(`select * from project where project_id='${body.project_id}' and parject_team='${userid}'`,(err,res3)=>{
                if(err) return toSend("0","查询失败！");
                if(res3.length>0){
                    return toSend("0","已加入该项目");
                }else{
                    conn.query(`insert into project (project_name,project_user,username,project_id,parject_team,parject_img) values (
                        '${project_name}','${project_user}','${username}','${project_id}','${userid}','${parject_img}'
                    )`)
                    toSend("1","添加成功！");
                }
            })
        })
    })
}