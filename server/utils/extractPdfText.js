import PDFParser from "pdf2json";

export const extractPdfText = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((txt) => {
          txt.R.forEach((r) => {
            const value = r.T || "";

try {
  text += decodeURIComponent(value) + " ";
} catch {
  text += value + " ";
}
          });
        });
        text += "\n";
      });

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
};