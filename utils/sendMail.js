const nodemailer = require('nodemailer');
//创建一个smtp服务器
const config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '511772477@qq.com', //注册的163邮箱账号
        pass: 'rzkjndbuvpfwbjjf' //邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);
const send=(email,text,callback)=>{
    var mail = {
        // 发件人
        from: '"Bugs" <511772477@qq.com>',
        // 主题
        subject: 'buly-bug管理平台',//邮箱主题
        // 收件人
        to:email,//前台传过来的邮箱
        // 邮件内容，HTML格式
        html:text//发送验证码
    };
    transporter.sendMail(mail, (err, info)=>{
        callback(err,info);
    });
}
module.exports={
    send
}
