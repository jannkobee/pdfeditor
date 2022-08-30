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

function getPayees(jsonUrl) {
  $.ajax({
    type: "GET",
    url: jsonUrl,
    dataType: "json",
    success: function (data) {
      payeesjson = data;
      console.log(payeesjson);
      for (i = 0; i < payeesjson.length; i++) {
        $(".payees-dropdown").append(`
          <option value="${payeesjson[i]["name"]}">${payeesjson[i]["name"]}</option>
        `);
      }
    },
  });
}

function saveJson() {
  $.ajax({
    url: "/request",
    type: "POST",
    dataType: "json",
    data: {
      name: "kobe",
      designation: "professional",
    },
    success: function (data) {
      console.log(data);
    },
    error: function (err) {
      console.error(err);
    },
  });
  // $.post(
  //   "/request",
  //   {
  //     name: "viSion",
  //     designation: "Professional gamer",
  //   },
  //   function (data, status) {
  //     console.log(data);
  //   }
  // );
  // confetti();
  // const octokit = new Octokit({
  //   auth: "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",
  // });

  // await octokit.request("POST /repos/jannkobee/pdfeditor/git/blobs", {
  //   owner: "jannkobee",
  //   repo: "pdfeditor",
  //   content: JSON.stringify(payeesjson),
  //   encoding: "utf-8",
  // });
  // var blob = new Blob([JSON.stringify(payeesjson)], {
  //   type: "text/plain;charset=utf-8",
  // });
  // saveAs(blob, "assets/listofpayees.json");
  // localStorage.setItem("myJavaScriptObject", JSON.stringify(payeesjson));
  // var obj = JSON.parse(localStorage.getItem("myJavaScriptObject"));
  // console.log(obj);
}

$(document).ready(function () {
  const pdf = "assets/pdf.pdf";
  const json = "assets/listofpayees.json";
  $(".display-pdf").attr("src", pdf);
  // getPdf(pdf);
  getPayees(json);
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

$(".editpdf").click(function () {
  const name = $(".filename-input").val();
  savepdf(name);
});

$(`.newfilebutton`).click(function () {
  $("backdrop").addClass("active");
  $("modal.newfile").addClass("active");
  $("modal .body .dropdown-container .payees-dropdown").change(function () {
    for (i = 0; i < payeesjson.length; i++) {
      if ($(this).val() == payeesjson[i]["name"]) {
        $(
          "modal .body .auto-complete-form-container .inner-container .tin"
        ).val(payeesjson[i]["tin"]);
        $(
          "modal .body .auto-complete-form-container .inner-container .name"
        ).val(payeesjson[i]["name"]);
        $(
          "modal .body .auto-complete-form-container .inner-container .address"
        ).val(payeesjson[i]["address"]);
        $(
          "modal .body .auto-complete-form-container .inner-container .faddress"
        ).val(payeesjson[i]["faddress"]);
      }
    }
  });
});

$(`.addpayeebutton`).click(function () {
  $("backdrop").addClass("active");
  $("modal.addpayee").addClass("active");
  $("modal.addpayee .body .form-container .inner-container");
  $("modal.addpayee .footer button").click(function () {
    const tin = $(
      "modal.addpayee .body .form-container .inner-container .tin"
    ).val();
    const name = $(
      "modal.addpayee .body .form-container .inner-container .name"
    ).val();
    const address = $(
      "modal.addpayee .body .form-container .inner-container .address"
    ).val();
    const faddress = $(
      "modal.addpayee .body .form-container .inner-container .faddress"
    ).val();
    const zip = $(
      "modal.addpayee .body .form-container .inner-container .zip"
    ).val();
    payeesjson.push({
      tin: tin,
      name: name,
      address: address,
      faddress: faddress,
      zip: zip,
    });
    saveJson();
  });
});

$(`.closemodal`).click(function () {
  $("backdrop").removeClass("active");
  $("modal").removeClass("active");
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
