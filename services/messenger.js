const options = require('../settings/options.js');
const messgener = require('./messenger.js');
const login = require('../settings/login.js');
var CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

module.exports = function(logger) {
    function sendEmail(subject, msgContent) {
        logger.debug('about to send email alert');
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: login.gmailUsername,
                pass: login.gmailPass
            }
        });
        var mailOptions = {
            from: login.gmailUsername,
            to: login.alertEmail,
            subject: subject,
            text: JSON.stringify(msgContent)
        };
    
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                logger.error(`Error sending email with error ${error}`);
            } else {
                logger.info(`Email sent to ${login.alertEmail} with subject: ${subject} and content:${msgContent}`);
            }
        });
    }
    
	return {
        sendEmail:sendEmail
	};
};