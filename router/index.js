const user=require('../controller/user');
const project=require('../controller/project');
const bg=require('../controller/bg');
const file=require('../controller/file');
const test=require('../controller/test/test');
const tool=require('../controller/tool');
exports.setRequestUrl=(app)=>{
    //user
    app.post("/user/login",user.login);   //登录
    app.post("/user/register",user.register);   //注册
    app.post("/user/code",user.code);   //获取验证码
    app.post("/user/send_mailer",user.send_mailer);   //发送邮箱
    app.post("/user/update_email",user.update_email);   //更新邮箱
    app.post("/user/update",user.update);   //更新资料

    //project
    app.post("/project/project",project.project);  //添加项目
    app.get("/project/list",project.list);  //查询项目
    app.get("/project/team",project.team);  //查询项目成员
    app.post("/project/invitation",project.invitation);  //添加项目成员
    app.post("/project/deletes",project.deletes);  //删除项目
    app.post("/project/update",project.update);  //修改项目
    app.post("/project/delete_team",project.delete_team);  //删除项目成员
    app.post("/project/exit_project",project.exit_project);  //退出项目
    
    //bg
    app.post("/bg/addbg",bg.addbg);  //添加bug记录
    app.get("/bg/list",bg.list);  //查询bug记录
    app.post("/bg/deletes",bg.deletes);  //删除bug记录
    app.get("/bg/details",bg.details);  //查询详情
    app.post("/bg/handle",bg.handle);  //操作bug记录
    app.get("/bg/search",bg.search);  //查询bug记录
    app.post("/bg/update",bg.update);  //更新bug记录

    //file
    app.post("/file/uploadImg",file.uploadImg);  //添加图片
    app.post("/file/uploadfile",file.uploadfile);  //上传文件

    //test
    app.post("/test",test); //测试接口

    //tool
    app.post("/tool/feedback",tool.feedback);
}