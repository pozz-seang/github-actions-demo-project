const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { convertToReadableDate } = require("./date");

let callLogsArr = ["A1", "A2", "A3", "A4", "A5", "A6"];
callLogsArr = callLogsArr.map((CLA) =>
  require(`../data/call log/json/${CLA}.json`)
);


// callLogsArr.map(CLA => fs.existsSync(`../data/call log/json/${CLA}.json`) && fs.renameSync(`../data/call log/json/${file}.json`, `../data/call log/json/${targetDate}/${file}.json`) && console.log(`Moved: ${file}.json`));

const convertJson2Pdf = async (callLogs, targetDate) => {
  const pdfPath = "./data/call log/pdf";
  
  [pdfPath].forEach(
    (folder) =>
      fs.mkdirSync(`${folder}/${targetDate}`, { recursive: true }) ||
      console.log(`Folder created: ${folder}/${targetDate}`)
  );

  for (i = 0; i < callLogs.length; i++) {
    let infoLog = {
      date: targetDate,
      MISSED: 0,
      OUTGOING: 0,
      INCOMING: 0,
      unknown: 0,
      total: 0,
    };
    const tgDate = new Date(
      targetDate.split("-").reverse().join("-")
    ).toDateString();

    console.log(tgDate);
    const log = callLogs[i].data.filter((log) => {
        const logDate = new Date(log.callDayTime).toDateString();

        if (logDate === tgDate) {
          log.callDayTime = convertToReadableDate(log.callDayTime);
          if (log.type_name === "MISSED") infoLog.MISSED++;
          else if (log.type_name === "OUTGOING") infoLog.OUTGOING++;
          else if (log.type_name === "INCOMING") infoLog.INCOMING++;
          else infoLog.unknown++;
          infoLog.total += 1;
        }
        return logDate === tgDate;
      })
      .sort((a, b) => {
        const timeA = new Date(a.callDayTime).getTime();
        const timeB = new Date(b.callDayTime).getTime();
        return timeA - timeB;
      })
      .map((log, index) => {
        return { id: index + 1, ...log };
      });

    const filePath = path.join(path.join(__dirname, "." + pdfPath + "/" + targetDate), `RCLA${i + 1} ${targetDate}.pdf`);

    createPDF(log, filePath, infoLog);
  }
};

const createPDF = (data, filePath, infoLog) => {
  const doc = new PDFDocument({ margin: 50 });

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("CallLog Report A" + (i + 1), { align: "center" })
    .moveDown(2);

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`Date: ${infoLog.date}`)
    .text(`Missed: ${infoLog.MISSED}`)
    .text(`Outgoting: ${infoLog.OUTGOING}`)
    .text(`Incoming: ${infoLog.INCOMING}`)
    .text(`Unknown: ${infoLog.unknown}`)
    .text(`Total: ${infoLog.total}`)
    .moveDown();

  doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  data.forEach((log, index) => {
    const logId = index + 1;

    if (index > 0) {
      doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    }
    doc.moveDown();
    // doc.moveDown()
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`ID: ${logId}`)
      .text(`Number: ${log.phNumber}`)
      .text(`Call type: ${log.type_name || "null"}`)
      .text(`Date time: ${log.callDayTime}`)
      .text(`Duration: ${log.callDuration}s`)
      .moveDown();
  });

  doc.end();
  console.log(`PDF generated: ${filePath}`);
};


// const targetDate = "19-01-2025";
// convertJson2Pdf(callLogsArr, targetDate);


module.exports = {
  convertJson2Pdf
}