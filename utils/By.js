const UUID = require('uuid');
const uuid=()=>{
    return UUID.v1().replace(/-/g,'');
}
module.exports={
    uuid
}
