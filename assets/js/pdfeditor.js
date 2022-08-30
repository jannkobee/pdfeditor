const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
let mainpdf;
let payeesjson = [];

async function getPdf(file) {
  const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
  mainpdf = existingPdfBytes;
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  fields.forEach((field) => {
    const name = field.getName();
    const replacename = name.replace(/\s+/g, "-");
    $(".fillpdf-container").append(`
      <div class="form-names">
          <label class="form-label">${name}</label>
          <input class="${replacename} form-control">
      </div>
    `);
  });
}

$(document).ready(function () {
  const pdf = "assets/pdf.pdf";
  // const json = "assets/listofpayees.json";
  $(".display-pdf").attr("src", pdf);
  // getPdf(pdf);
});

async function savepdf(pdfname) {
  const pdfDoc = await PDFDocument.load(mainpdf);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  for (i = 0; i < fields.length; i++) {
    const data = fields[i].getName();
    const replacedata = data.replace(/\s+/g, "-");
    const texts = $(`.${replacedata}`).val();
    let everyfield = form.getTextField(data);
    everyfield.setText(texts);
  }
  const pdfBytes = await pdfDoc.save();

  download(pdfBytes, `${pdfname}.pdf`, "application/pdf");
}

