const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment-timezone');
const colors = require('colors');
const fs = require('fs');
const { executeCommand } = require('./commands'); // Import executeCommand function
const config = require('./config.json');



const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],

    },
});

client.on('qr', (qr) => {
    console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] Scan the QR below : `);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.clear();

    fs.readFile('utf-8', (err, data) => {
        if (err) {
            console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] Console Text not found!`.yellow);
            console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] ${config.name} is Already!`.green);
        } else {
            console.log(data.green);
            console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] ${config.name} is Already!`.green);
        }
    });
});

client.on('message', async (message) => {
    if (message.chat) {
        const isGroup = message.chat.isGroup;

        // Memeriksa apakah pesan berasal dari grup atau bukan
        if (isGroup) {
            await executeCommand(client, message, config);
        } else {
            await executeCommand(client, message, config);
        }
    } else {
        await executeCommand(client, message, config);
    }
});


client.initialize();
