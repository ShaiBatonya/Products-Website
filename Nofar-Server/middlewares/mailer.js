const mailer = require('nodemailer');

const mailer_middleware = async (req, res, next) => {

    try {

        const to = req.to


        const mail_template = req.template


        const transporter = mailer.createTransport({
            service: "gmail",
            auth: {
                user: "davidbiton2@gmail.com",
                pass: "warhwgvhawzfchka"
            }
        });

        const mail = {
            to,
            subject: req.subject,
            html: mail_template
        };

        const data = await transporter.sendMail(mail);

        next();

    } catch (error) {
        return res.status(500).json({
            message: "error in trying send email",
            error:error.message
        })
    }
};


module.exports = mailer_middleware