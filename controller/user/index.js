const login = require('./login');
const register = require('./register');
const code = require('./code');
const send_mailer = require('./send_mailer');
const update = require('./update');
const update_email = require('./update_email');
module.exports={
    login,
    register,
    code,
    send_mailer,
    update,
    update_email
}