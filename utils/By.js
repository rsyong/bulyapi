const UUID = require('uuid');
const uuid=()=>{
    return UUID.v1().replace(/-/g,'');
}

//验证手机号
const Telreg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
const isTelCode=(str)=>{
    return Telreg.test(str);
}

//验证邮箱
const Emailreg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
const IsEmail=(str)=>{
    return Emailreg.test(str);
}
module.exports={
    uuid,
    isTelCode,
    IsEmail
}
