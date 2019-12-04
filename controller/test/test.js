const By =require('../../utils/By');
module.exports=(req,send)=>{
    const body=req.body;
    const toSend=(code,msg,data=[])=>{
        send.json({code,msg,data});
    }
    return toSend("1","登录成功！",By.uuid());
}