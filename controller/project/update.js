/**
 * @api {post} /project/update 更新项目资料
 * @apiVersion 0.1.0
 * @apiName update
 * @apiGroup project
 *
 * @apiParam {String}   userid   *用户ID
 * @apiParam {String}   project_id   *项目ID
 * @apiParam {Number} project_name 项目名字
 * @apiParam {String}  parject_img 项目图片
 *
 * @apiSuccessExample Response (example):
 *  {
        "code": "1",
        "msg": "修改成功！",
        "data": []
    }
 */
const mysql=require('../../utils/mysql.config');
module.exports=(req,send)=>{
    const body=req.body;
    const conn=mysql.init();
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
        conn.end();
    }
    if(!body.userid) return toSend("0","缺少参数userid");
    if(!body.project_id) return toSend("0","缺少参数project_id");
    conn.connect();
    conn.query(`SELECT * FROM project where project_id='${body.project_id}'`,(err,res)=>{
        if(err) return toSend("0","系统错误！");
        if(res.length==0) return toSend("0","没有该项目！");
        if(res.length>0){
            if(body.userid==res[0].project_user){
                changeUser();
            }else{
                return toSend("0","只有创建者拥有权限修改！");
            }
        }
    })
    const changeUser=()=>{
        let sql=sqlold=`update project set `;
        let {project_name,parject_img}=body;
        if(project_name){
            sql+=`project_name='${project_name}',`;
        }else if(parject_img){
            sql+=`parject_img='${parject_img}',`;
        }
        if(sql==sqlold){
            return toSend("0","最少应有一项被修改");
        }
        if(sql.lastIndexOf(",")>-1){
            sql=sql.substring(0,sql.length-1);
        }
        sql+=` where project_id='${body.project_id}'`;
        conn.query(sql,(err,res)=>{
            if(err) return toSend("0","系统错误！");
            toSend("1","修改成功！");
        })
    }
}