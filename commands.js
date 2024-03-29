// Define admin phone numbers
const allowedAdmins = [
    '6285782299563',
    'admin2_phone_number',
    // Add more admin phone numbers as needed
];

const executeCommand = async (client, message, config) => {
    try {
        if (!message.body.startsWith(config.prefix)) {
            return; // Exit early if message doesn't start with the prefix
        }

        let senderInfo = '';
        let groupInfo = '';

        // Get sender information
        const sender = await message.getContact();
        if (sender) {
            senderInfo = ` From: ${sender.pushname} (${sender.id.user})`;
        }

        // Get chat information
        const chat = await message.getChat();
        if (chat.isGroup) {
            groupInfo = `Grup: ${chat.name}`;
        } else {
            groupInfo = 'Pesan tidak berasal dari grup\n';
        }

        console.log( `Pesan :${message.body}` + senderInfo + groupInfo);

        if ((message._data.caption === `${config.prefix}sticker`)) {
            client.sendMessage(message.from, "*[⏳]* Loading..");
            const media = await message.downloadMedia();
            await client.sendMessage(message.from, media, {
                sendMediaAsSticker: true,
                stickerName: config.name,
                stickerAuthor: config.author
            });
            client.sendMessage(message.from, "*[✅]* Successfully!");
        } else if (message.body === `${config.prefix}sticker`) {
            client.sendMessage(message.from, "*[⏳]* Loading..");
            const quotedMsg = await message.getQuotedMessage();
            if (message.hasQuotedMsg && quotedMsg.hasMedia) {
                const media = await quotedMsg.downloadMedia();
                await client.sendMessage(message.from, media, {
                    sendMediaAsSticker: true,
                    stickerName: config.name,
                    stickerAuthor: config.author
                });
                client.sendMessage(message.from, "*[✅]* Successfully!");
            } else {
                await client.sendMessage(message.from, '*[❎]* Reply with an image first!');
            }
        } else if (message.body === `${config.prefix}image`) {
            const quotedMsg = await message.getQuotedMessage();
            if (message.hasQuotedMsg && quotedMsg.hasMedia) {
                const media = await quotedMsg.downloadMedia();
                await client.sendMessage(message.from, media);
            } else {
                await client.sendMessage(message.from, '*[❎]* Reply with a sticker first!');
            }
        } else if (message.body.startsWith(`${config.prefix}change`)) {
            if (message.body.includes('|')) {
                const name = message.body.split('|')[0].replace(message.body.split(' ')[0], '').trim();
                const author = message.body.split('|')[1].trim();
                const quotedMsg = await message.getQuotedMessage();
                if (message.hasQuotedMsg && quotedMsg.hasMedia) {
                    const media = await quotedMsg.downloadMedia();
                    await client.sendMessage(message.from, media, {
                        sendMediaAsSticker: true,
                        stickerName: name,
                        stickerAuthor: author
                    });
                } else {
                    await client.sendMessage(message.from, '*[❎]* Reply with a sticker first!');
                }
            } else {
                await client.sendMessage(message.from, `*[❎]* Run the command:\n*${config.prefix}change <name> | <author>*`);
            }

        } else if (message.body === `${config.prefix}info` || message.body === `${config.prefix}help`) {
            // Logic for displaying information
            const infoMessage = `This is a bot created by ${config.author}.
            \nYou can use the following commands:
            \n- ${config.prefix}sticker: Membuat stiker video atau pun gambar
            \n- ${config.prefix}image: merubah setiker menjadi gambar
            \n- ${config.prefix}change <name> | <author>: Change sticker name and author *(eror)*
            \n- ${config.prefix}info: Menampilkan info-info terkait bot 
            \n- ${config.prefix}Tagall: Menmantion semua member grub
            
            \n*CATATAN*
            \n*TOLONG PAKAI DENGAN BAIK BOT INI, BOT INI DI BUAT UNTUK KESELAMATAN UMAT*
            `;
            await client.sendMessage(message.from, infoMessage);
        } else if (message.body === `${config.prefix}tagall` && chat.isGroup) {
            let text = "";
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                text += `@${participant.id.user} `;
            }

            await chat.sendMessage('Halo semua', { mentions });
        } else if (message.body === `${config.prefix}newcommand`) {

        } else {
            const chat = await client.getChatById(message.id.remote);
            await chat.sendSeen();
        }
    } catch (error) {
        console.error('Error:', error);
        await client.sendMessage(message.from, '*[❎]* Operation failed!');
    }
};

module.exports = {
    executeCommand
};
