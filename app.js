//buly接口
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const router=require('./router/index');
app.all('*',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    if(req.method=="OPTIONS"){
        res.send(200);
    }else{
        next();
    }
})
app.use(bodyParser.urlencoded({extended:false}));
//设置静态文件
app.use('/public',express.static('public'));
router.setRequestUrl(app);
app.listen(3001,()=>{
    console.log("服务已启动端口3001");
})