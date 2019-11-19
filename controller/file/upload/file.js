/**
 * @api {post} /file/upload/img 上传图片
 * @apiVersion 0.1.0
 * @apiName img
 * @apiGroup File
 *
 * @apiParam {String} project_id 项目id
 * @apiSuccessExample Response (example):
 *  {
    }
 */
const fm = require('formidable');
const path = require('path');
const fs = require('fs');
module.exports = (req, send) => {
    const toSend = (code, msg, data = []) => {
        send.json({ code, msg, data });
    }
    let form = new fm.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../../public/static'); //文件保存的临时目录为static文件夹（文件夹不存在会报错，一会接受的file中的path就是这个）
    form.maxFieldsSize = 100 * 1024 * 1024; //用户头像大小限制为最大1M    
    form.keepExtensions = true; //使用文件的原扩展名 
    form.multiples =true; //多选
    //上传文件只能通过这个插件接收  file是上传文件 fields是其他的
    form.parse(req, (err, fields, file) => {
        if(err) return toSend("0","文件读取失败！");
        let filePath = []; //临时目录的名字
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if (file.tmpFile) {
            filePath.push(file.tmpFile.path);
        } else {
            for (var key in file) {
                if (file[key].path) {
                    filePath.push(file[key].path);
                }
            }
        }
        Promise.all(filePath.forEach((item)=>{
            new Promise((resolve,reject)=>{
                let fileExt = item.substring(item.lastIndexOf('.'));
                let targetDir = path.join(__dirname, '../../../public/uploads');
                //以当前时间戳对上传文件进行重命名  
                let fileName = new Date().getTime() + fileExt;
                let targetFile = path.join(targetDir, fileName);
                fs.rename(item,targetFile,(err,res)=>{
                    if(err) return reject();
                    resolve('/public/uploads/' + fileName);
                })
            })
        })).then(res=>{
            return toSend("1","操作成功!",res);
        }).catch(err=>{
            if(err) return toSend("0","操作失败!",err);
        })
    });
}