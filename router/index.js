const user=require('../controller/user');
const project=require('../controller/project');
const bg=require('../controller/bg');
const file=require('../controller/file');
exports.setRequestUrl=(app)=>{
    app.post("/user/login",user.login);   //登录
    app.post("/user/register",user.register);   //注册
    app.post("/user/code",user.code);   //获取验证码
    app.post("/user/send_mailer",user.send_mailer);   //发送邮箱
    app.post("/user/update",user.update);   //更新资料

    app.post("/project/project",project.project);  //添加项目
    app.get("/project/list",project.list);  //查询项目
    app.get("/project/team",project.team);  //查询项目成员
    app.post("/project/invitation",project.invitation);  //添加项目成员
    app.post("/project/deletes",project.deletes);  //删除项目
    app.post("/project/update",project.update);  //修改项目
    
    app.post("/bg/addbg",bg.addbg);  //添加bug记录
    app.get("/bg/list",bg.list);  //查询bug记录
    app.post("/bg/deletes",bg.deletes);  //删除bug记录

    app.post("/file/uploadImg",file.uploadImg);  //添加图片
}