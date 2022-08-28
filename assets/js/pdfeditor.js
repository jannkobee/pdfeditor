const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
let mainpdf;

async function getPdf(file) {
  const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
  mainpdf = existingPdfBytes;
}

$(document).ready(function () {
  const pdf = "assets/pdf.pdf";
  getPdf(pdf);
});

async function savepdf(name) {
  const pdfDoc = await PDFDocument.load(mainpdf);
  const form = pdfDoc.getForm();
  const nameField = form.getTextField("Payee Name");
  const addressField = form.getTextField("Payee Address");
  const foreignaddressField = form.getTextField("Payee Foreign Address");
  nameField.setText($(`#payeename`).val());
  addressField.setText($(`#payeeaddress`).val());
  foreignaddressField.setText($(`#payeeforeignaddress`).val());

  const pdfBytes = await pdfDoc.save();

  download(pdfBytes, `${name}.pdf`, "application/pdf");
}

$(".editpdf").click(function () {
  const name = $(".filename-input").val();
  savepdf(name);
});

// async function fillform(file) {
//     // Fetch an existing PDF document
//     const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());

//     // Load a PDFDocument from the existing PDF bytes
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);

//     // Embed the Helvetica font
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Get the first page of the document
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];

//     // Get the width and height of the first page
//     const { width, height } = firstPage.getSize();

//     // Draw a string of text diagonally across the first page
//     firstPage.drawText("This text was added with JavaScript!", {
//       x: 5,
//       y: height / 2 + 300,
//       size: 25,
//       font: helveticaFont,
//       color: rgb(0.95, 0.1, 0.1),
//     });

//     // Serialize the PDFDocument to bytes (a Uint8Array)
//     const pdfBytes = await pdfDoc.save();

//     // Trigger the browser to download the PDF document
//     //   download(pdfBytes, "pdf.pdf", "application/pdf");
//   }
