const axios = require('axios');
const fs = require('fs');


async function downloadTelegramFile(fileUrl, savePath) {
    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream(savePath))
            .on('finish', resolve)
            .on('error', reject);
    });
}

module.exports = {
    downloadTelegramFile
}