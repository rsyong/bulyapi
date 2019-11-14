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
    form.maxFieldsSize = 1 * 1024 * 1024; //用户头像大小限制为最大1M    
    form.keepExtensions = true; //使用文件的原扩展名 
    //上传文件只能通过这个插件接收  file是上传文件 fields是其他的
    form.parse(req, (err, fields, file) => {
        console.log(file);
        if(err) return toSend("0","文件读取失败！");
        var filePath = ''; //临时目录的名字
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if (file.tmpFile) {
            filePath = file.tmpFile.path;
        } else {
            for (var key in file) {
                if (file[key].path && filePath === '') {
                    filePath = file[key].path;
                    break;
                }
            }
        }
        //文件后缀
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        //判断文件类型是否允许上传  
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) return toSend("0", "文件类型不支持");

        //文件移动的目录文件夹
        var targetDir = path.join(__dirname, '../../../public/uploads');
        //以当前时间戳对上传文件进行重命名  
        var fileName = new Date().getTime() + fileExt;

        var targetFile = path.join(targetDir, fileName);
        fs.rename(filePath,targetFile,(err,res)=>{
            if(err) return toSend("0","操作失败!");
            var fileUrl = '/public/uploads/' + fileName;
            return toSend("1","操作成功!",fileUrl);
        })
    });
}