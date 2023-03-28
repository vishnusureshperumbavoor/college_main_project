const nodemailer = require("nodemailer")
const EMAIL = process.env.EMAIL 
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready',async () => {
    console.log('Whatapp automation is ready');
});

client.initialize();

module.exports = {
    sendMail:(user,msg)=>{
        return new Promise(async(resolve,reject)=>{
            let transporter = nodemailer.createTransport({
                service:'gmail',
                auth: {
                    user: EMAIL,
                    pass: EMAIL_PASSWORD
                },
              });
            
              let info = await transporter.sendMail({
                from: EMAIL, // sender address
                to: user.email, // list of receivers
                subject: "NBA Accreditation", // Subject line
                text: msg
              });
            
              console.log("Message sent: %s", info.messageId);
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              resolve(info)
        })
    },
    sendWhatsApp:(user,msg)=>{
        return new Promise(async(resolve,reject)=>{
            const number = user.mobile;
            const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
            const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India
            const number_details = await client.getNumberId(final_number);
            if (number_details) {
                await client.sendMessage(number_details._serialized, msg); 
                console.log("WhatsApp Message sent");
            } else {
                console.log(final_number, "Mobile number is not registered on whatsapp");
            }
        })
    },

    sendSMS:()=>{
        return new Promise(async(resolve,reject)=>{

        })
    }
}