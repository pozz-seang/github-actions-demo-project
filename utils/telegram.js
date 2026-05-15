const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const { downloadTelegramFile } = require('../functions/downloadTelegramFile');
const { findUser, updateUser, createUser, deleteUser } = require('./users');
const { isValidDateFormat, normalizeDate, getDate } = require('../functions/date');
const { convertJson2Pdf } = require('../functions/convert');
const { TGBotToken } = require('../core/config');
const token = TGBotToken
const bot = new TelegramBot(token, { polling: true });



const tgWorker = () => {

    bot.on('message', async (msg) => {
        const {id, first_name} = msg.chat
        const fid = msg.from.id
        
        

        if(msg.text){
            if(msg.text.charAt(0) == '/'){
                const msgText = msg.text.toLocaleLowerCase().split("@")[0];
                const cmd = msgText.split(" ")[0].slice(1);
                const text = msgText.slice(cmd.length+2);

                sentTgMessage(id, "*VVD schatbot* is working 😉\n\nType /help to see available commands");
                if(cmd == "start") sentTgMessage(id, "*VVD Hello*, _this_ is `MarkdownV2`!\nVisit [Google](https://google.com)");
            
                if(cmd == "getme"){
                    const result = await findUser(fid)            
                    if (result.error) return sentTgMessage(id, result.error);
                    sentTgMessage(id, `🌟 Your info 🌟\n🆔 ID: ${result.id}\n🪪 Code: ${result.code}\n🧑🏻‍💻 TGID: ${result.idTg}\n📛 Name: ${result.name}`);
                }
            
                if(cmd == "update"){
                    const result = await updateUser(text, fid, first_name)
                    if (result.error) return sentTgMessage(id, result.error);
                    sentTgMessage(id, `🌟 Your info 🌟\n🆔 ID: ${result.user.id}\n🪪 Code: ${result.user.code}\n🧑🏻‍💻 TGID: ${result.user.idTg}\n📛 Name: ${result.user.name}`);
                }

                if(cmd == "create" || cmd == "start"){
                    const result = await createUser(text, fid, first_name) 
                    if (result.error){
                        if (cmd == "start") return
                        return sentTgMessage(id, result.error);
                    } 
                    sentTgMessage(id, `🌟 Your info 🌟\n🆔 ID: ${result.id}\n🪪 Code: ${result.code}\n🧑🏻‍💻 TGID: ${result.idTg}\n📛 Name: ${result.name}`);
                }

                if(cmd == "delete"){
                    const result = await deleteUser(fid)
                    if (result.error) return sentTgMessage(id, result.error);
                    sentTgMessage(id, result.message);
                    
                }    

                // if(cmd == "v"){
                //     const result = await findUser(msg.from.id)
                //     if (result.error) return sentTgMessage(id, result.error);
                //     if(result.role != "admin") return sentTgMessage(id, "🚫 You can't use this command,\n🎫 this command is for admin only");
                //     let date;
                //     if(text == "today" || text == "t" || text == "") date = getDate();
                //     else if(text == "yesterday" || text == "y") date = getDate(-1)
                //     else {
                //         if(isValidDateFormat(normalizeDate(text))) date = normalizeDate(text);
                //         else return sentTgMessage(id, "❌ Invalid date format.\n👉👈 Please use dd-mm-yyyy");
                //     }
                //     console.log(date);
                    
                //     const callLogsArr = fs.readdirSync(path.resolve(__dirname, `../data/call log/json`)).map((file) => file.split(".")[0]).map((CLA) => require(`../data/call log/json/${CLA}.json`) );
                //     await convertJson2Pdf(callLogsArr, date);

                //     await sentTgMessage(id, `📞 Telesale call log 📞\n🗓️ Date: ${date}`); 
                //     await sentDocumentTS(id, callLogsArr.map((_, i) => path.resolve(__dirname, `../data/call log/pdf/${date}/RCLA${i + 1} ${date}.pdf`)));
                // }

                if(cmd == "getclts"){

                    const result = await findUser(fid);
                
                    if (result.error) return sentTgMessage(id, result.error);
                    if (result.role !== "admin") return sentTgMessage(id, "🚫 Admins only 🚫\n🚫 You can't use this command,\n🎫 this command is for admin only");
                
                    let date = text === "today" || text === "t" || text === "" 
                        ? getDate() 
                        : text === "yesterday" || text === "y" 
                        ? getDate(-1) 
                        : isValidDateFormat(normalizeDate(text)) 
                        ? normalizeDate(text) 
                        : null;
                
                    if (!date) return sentTgMessage(id, "❌ Invalid date format. Use dd-mm-yyyy.");
                
                    try {
                        const callLogsArr = fs.readdirSync(path.resolve(__dirname, '../data/call log/json')).map(file => JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/call log/json/${file}`), 'utf-8')));
                        if (!callLogsArr.length) return sentTgMessage(id, "❌ No call logs found.");
                
                        await convertJson2Pdf(callLogsArr, date);
                
                        const pdfPaths = callLogsArr.map((_, i) =>path.resolve(__dirname, `../data/call log/pdf/${date}/RCLA${i + 1} ${date}.pdf`));
                
                        await sentTgMessage(id, `📞 Telesale call log 📞\n🗓️ Date: ${date}`);
                        await sentDocumentTS(id, pdfPaths);
                    } catch (error) {
                        console.error("Error:", error);
                        return sentTgMessage(id, "❌ Something went wrong. Please try again.");
                    }

                } 

                if(cmd == "help"){
                    sentTgMessage(id, "🤖 Baby Telesale bot 🤖\n\n📞 Call log\n📄 Send your call log json file to this bot\n\n🔍 Commands\n/start\n/getme\n/update [name]\n/create [name]\n/delete\n/help");
                }
            }
        }



        getDocumentTS(msg)
    }) 

}



//multiple function
const getDocumentTS = async (msg) => {
    if(!msg.document) return
    const {id} = msg.chat
    
    const result = await findUser(msg.from.id)            
    if (result.error) return await sentTgMessage(id, result.error);

    const fileId = msg.document.file_id;
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const savePath = path.resolve(__dirname, `../data/call log/json/${result.code}.${file.file_path.split(".").pop()}`);
    if(file.file_path.split(".").pop() == "json"){
        await downloadTelegramFile(fileUrl, savePath);
        await sentTgMessage(id, "Your call log is received 😉");
    }else{
        await sentTgMessage(id, "Your file is not a call log json 😢");
    }

}

const sentDocumentTS = async (chatId, documentPath)=>{
    for (const [index, doc] of documentPath.entries()) {
        try {
            await bot.sendDocument(chatId, doc);
            console.log(`Document ${index + 1} sent`);
        } catch (err) {
            sentTgMessage(chatId, `Error with document ${index + 1}`);
            console.error(`Error with document ${index + 1}:`, err.message);
        }
    }
}

const escapeMarkdownV2 = (text) => {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}


//main function
const editTgMessage = async (chatId, msgId, msg) => {
    try {
        const response = await bot.editMessageText(msg, {
            chat_id: chatId,
            message_id: msgId,
        });
        return response
    } catch (error) {
        console.error('Error sending message:', error);
    }
}


const sentTgMessage = async (chatId, msg, param = {parse_mode: 'MarkdownV2'}) => {
    try {
        const response = await bot.sendMessage(chatId, escapeMarkdownV2(msg), param);
        return response
    } catch (error) {
        
        console.error('Error sending message:', error);
    }
}


const sendTgMultipleDocuments = async (groupId, documents) => {
    for (const [index, doc] of documents.entries()) {
        try {
            await bot.sendDocument(groupId, doc);
            console.log(`Document ${index + 1} sent`);
        } catch (err) {
            console.error(`Error with document ${index + 1}:`, err.message);
        }
    }
};




module.exports  = {
    tgWorker
}