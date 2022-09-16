const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
  
let mainexcel;
let payeesjson = [];

async function getPdf(file) {
  const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
  mainpdf = existingPdfBytes;
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  fields.forEach((field) => {
    console.log(field.getName());
  });
  // fields.forEach((field) => {
  //   const name = field.getName();
  //   const replacename = name.replace(/\s+/g, "-");
  //   $(".fillpdf-container").append(`
  //     <div class="form-names">
  //         <label class="form-label">${name}</label>
  //         <input class="${replacename} form-control">
  //     </div>
  //   `);
  // });
}

async function savepdf(pdfname) {
  const pdfDoc = await PDFDocument.load(mainpdf);
  // const form = pdfDoc.getForm();
  // const fields = form.getFields();

  // for (i = 0; i < fields.length; i++) {
  //   const data = fields[i].getName();
  //   const replacedata = data.replace(/\s+/g, "-");
  //   const texts = $(`.${replacedata}`).val();
  //   let everyfield = form.getTextField(data);
  //   everyfield.setText(texts);
  // }
  const pdfBytes = await pdfDoc.save();

  download(pdfBytes, `hello.pdf`, "application/pdf");
}

async function getexcel(excel) {
  const data = await (await fetch(excel)).arrayBuffer();
  mainexcel = data;
  saveexcel();
  // download(data, `test.xlsx`, "application/xlsx");
  // var wb = XLSX.utils.book_new();
  // wb.Props = {
  //   Title: "SheetJS Tutorial",
  //   Subject: "Test",
  //   Author: "Red Stapler",
  //   CreatedDate: new Date(2017, 12, 19),
  // };
  // wb.SheetNames.push("Test Sheet");
  // var ws_data = [["hello", "world"]];
  // var ws = XLSX.utils.aoa_to_sheet(ws_data);
  // wb.Sheets["Test Sheet"] = ws;
  // var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  // function s2ab(s) {
  //   var buf = new ArrayBuffer(s.length);
  //   var view = new Uint8Array(buf);
  //   for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  //   return buf;
  // }
}

function saveexcel() {
  const workbook = XLSX.read(mainexcel);
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  worksheet["!merges"].push({
    s: { r: 37, c: 0 }, // s ("start"): c = 1 r = 2 -> "B3"
    e: { r: 39, c: 10 }, // e ("end"):   c = 4 r = 3 -> "E4"
  });

}

$(document).ready(function () {
  const pdf = "assets/pdf.pdf";
  const excel = "assets/excel.xlsx";
  // const json = "assets/listofpayees.json";
  // $(".display-pdf").attr("src", pdf);
  // getPdf(pdf);
  getexcel(excel);
});

$(".newpdffile").click(function () {
  const name = $(".filename-input").val();
  savepdf(name);
});
