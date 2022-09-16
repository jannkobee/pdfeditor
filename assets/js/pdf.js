const {
  degrees,
  PDFDocument,
  rgb,
  StandardFonts,
  setFontSize,
  PDFFont,
  setFontAndSize,
} = PDFLib;
const fontkit = window.fontkit;
let atcmoney1;
let incomeDetails;
let moneyDetails;
let mainpdf;

$(document).ready(function () {
  const pdf = "assets/pdf.pdf";
  getpdf(pdf);
});

async function getpdf(pdf) {
  const data = await fetch(pdf).then((res) => res.arrayBuffer());
  mainpdf = data;
  const pdfDoc = await PDFDocument.load(mainpdf);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  fields.forEach((field) => {
    console.log(field.getName());
  });
}

async function savepdf(pdfname) {
  const pdfDoc = await PDFDocument.load(mainpdf);
  const form = pdfDoc.getForm();

  let atcincome = $(
    ".dynamic-form-inner-container.income .table .select-atc option:selected"
  ).text();
  let atcmoney = $(
    ".dynamic-form-inner-container.money .table .select-atc option:selected"
  ).text();
  const datefrom = $(
    "modal.newfile .body .date-container .date-inner-container .date-from"
  ).val();
  const datefromarr = datefrom.split("-");
  const dateto = $(
    "modal.newfile .body .date-container .date-inner-container .date-to"
  ).val();
  const datetoarr = dateto.split("-");
  const payeename = $(
    "modal.newfile .body .dropdown-container .payees-dropdown"
  ).val();
  const payeetin = $(
    "modal.newfile .body .auto-complete-form-container .inner-container .tin"
  ).val();
  const payeetinarr = payeetin.split(" ");
  const payeezip = $(
    "modal.newfile .body .auto-complete-form-container .inner-container .zip"
  ).val();
  const payeeaddress = $(
    "modal.newfile .body .auto-complete-form-container .inner-container .address"
  ).val();
  const payeefaddress = $(
    "modal.newfile .body .auto-complete-form-container .inner-container .faddress"
  ).val();
  let income1st = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.income .table.income .1stmonth"
  ).val();
  if (income1st == 0) {
    income1st = "";
  } else {
    income1st = parseFloat(income1st).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }
  let income2nd = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.income .table.income .2ndmonth"
  ).val();
  if (income2nd == 0) {
    income2nd = "";
  } else {
    income2nd = parseFloat(income2nd).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }
  let income3rd = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.income .table.income .3rdmonth"
  ).val();
  if (income3rd == 0) {
    income3rd = "";
  } else {
    income3rd = parseFloat(income3rd).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }
  let incometotal = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.income .table.income .total"
  ).val();
  incometotal = parseFloat(incometotal).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  let incometax = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.income .table.income .tax"
  ).val();
  incometax = parseFloat(incometax).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  let money1st = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.money .table.money .1stmonth"
  ).val();
  if (money1st == 0) {
    money1st = "";
  } else {
    money1st = parseFloat(money1st).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }
  let money2nd = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.money .table.money .2ndmonth"
  ).val();
  if (money2nd == 0) {
    money2nd = "";
  } else {
    money2nd = parseFloat(money2nd).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }
  let money3rd = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.money .table.money .3rdmonth"
  ).val();
  if (money3rd == 0) {
    money3rd = "";
  } else {
    money3rd = parseFloat(money3rd).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }
  let moneytotal = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.money .table.money .total"
  ).val();
  moneytotal = parseFloat(moneytotal).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  let moneytax = $(
    "modal.newfile .body .dynamic-form-container .dynamic-form-inner-container.money .table.money .tax"
  ).val();
  moneytax = parseFloat(moneytax).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  if (atcincome == "WC640") {
    incomeDetails =
      "\n Income payments made by the government and government owned and controlled corporation (GOCCs) to its local/resident suppliers of goods other than those covered by other rates of withholding tax.";
  } else if (atcincome == "WC157") {
    incomeDetails =
      "\n Income payments made by the government and government owned and controlled corporation (GOCCs) to its local/resident suppliers of services other than those covered by other rates of withholding tax.";
  } else if (atcincome == "WC100") {
    incomeDetails =
      "\n Rental: On gross rental or lease for the continued use or possession of personal property in excess of Ten thousand pesos (P 10,000.00) anually and real property used in business which payor or obligor has not taken title or is not taking title, or in which has no equity: poles satellites, transmission facilities and billboards.";
  }
  if (atcmoney == "WV010") {
    moneyDetails = "\n VAT Withholding on Purchase of Goods";
  } else if (atcmoney == "WV020") {
    moneyDetails = "\n VAT Withholding on Purchase of Services";
  } else if (atcmoney == "WB080") {
    moneyDetails =
      "\n Persons Exempt from VAT under Sec. 109BB (creditable)-Government Withholding Agent";
  } else {
    atcmoney = "";
    moneyDetails = "";
    moneytotal = "";
    moneytax = "";
  }
  const userName = $(
    "modal .body .dynamic-form-container .user-container .userName"
  ).val();
  const userRole = $(
    "modal .body .dynamic-form-container .user-container .userRole"
  ).val();

  const datefromMonthfield = form.getTextField("fromMonth");
  const datefromDayfield = form.getTextField("fromDay");
  const datefromYearfield = form.getTextField("fromYear");
  const datetoMonthfield = form.getTextField("toMonth");
  const datetoDayfield = form.getTextField("toDay");
  const datetoYearfield = form.getTextField("toYear");
  const payeetin1field = form.getTextField("payeeTIN1");
  const payeetin2field = form.getTextField("payeeTIN2");
  const payeetin3field = form.getTextField("payeeTIN3");
  const payeetin4field = form.getTextField("payeeTIN4");
  const payeenamefield = form.getTextField("payeeName");
  const payeeaddressfield = form.getTextField("payeeAddress");
  const payeefaddressfield = form.getTextField("payeeFaddress");
  const payeezipfield = form.getTextField("payeeZip");
  const incomeDetailsfield = form.getTextField("incomeDetails");
  const incomeATCfield = form.getTextField("incomeATC");
  const income1stfield = form.getTextField("income1st");
  const income2ndfield = form.getTextField("income2nd");
  const income3rdfield = form.getTextField("income3rd");
  const incometotalfield = form.getTextField("incomeTotal");
  const incometaxfield = form.getTextField("incomeTax");
  const incometotal1stfield = form.getTextField("incometotal1st");
  const incometotal2ndfield = form.getTextField("incometotal2nd");
  const incometotal3rdfield = form.getTextField("incometotal3rd");
  const incometotaltotalfield = form.getTextField("incometotalTotal");
  const incometotaltaxfield = form.getTextField("incometotalTax");
  const moneyDetailsfield = form.getTextField("moneyDetails");
  const moneyATCfield = form.getTextField("moneyATC");
  const money1stfield = form.getTextField("money1st");
  const money2ndfield = form.getTextField("money2nd");
  const money3rdfield = form.getTextField("money3rd");
  const moneytotalfield = form.getTextField("moneyTotal");
  const moneytaxfield = form.getTextField("moneyTax");
  const moneytotal1stfield = form.getTextField("moneytotal1st");
  const moneytotal2ndfield = form.getTextField("moneytotal2nd");
  const moneytotal3rdfield = form.getTextField("moneytotal3rd");
  const moneytotaltotalfield = form.getTextField("moneytotalTotal");
  const moneytotaltaxfield = form.getTextField("moneytotalTax");
  const userNamefield = form.getTextField("userName");
  const userRolefield = form.getTextField("userRole");

  datefromMonthfield.setText(datefromarr[1]);
  datefromDayfield.setText(datefromarr[2]);
  datefromYearfield.setText(datefromarr[0]);
  datetoMonthfield.setText(datetoarr[1]);
  datetoDayfield.setText(datetoarr[2]);
  datetoYearfield.setText(datetoarr[0]);
  payeetin1field.setText(payeetinarr[0]);
  payeetin2field.setText(payeetinarr[1]);
  payeetin3field.setText(payeetinarr[2]);
  payeetin4field.setText(payeetinarr[3]);
  payeenamefield.setText(payeename);
  payeeaddressfield.setText(payeeaddress);
  payeefaddressfield.setText(payeefaddress);
  payeezipfield.setText(payeezip);
  incomeDetailsfield.setText(incomeDetails);
  incomeATCfield.setText(atcincome);
  income1stfield.setText(income1st);
  income2ndfield.setText(income2nd);
  income3rdfield.setText(income3rd);
  incometotalfield.setText(incometotal);
  incometaxfield.setText(incometax);
  incometotal1stfield.setText(income1st);
  incometotal2ndfield.setText(income2nd);
  incometotal3rdfield.setText(income3rd);
  incometotaltotalfield.setText(incometotal);
  incometotaltaxfield.setText(incometax);
  moneyDetailsfield.setText(moneyDetails);
  moneyATCfield.setText(atcmoney);
  money1stfield.setText(money1st);
  money2ndfield.setText(money2nd);
  money3rdfield.setText(money3rd);
  moneytotalfield.setText(moneytotal);
  moneytaxfield.setText(moneytax);
  moneytotal1stfield.setText(money1st);
  moneytotal2ndfield.setText(money2nd);
  moneytotal3rdfield.setText(money3rd);
  moneytotaltotalfield.setText(moneytotal);
  moneytotaltaxfield.setText(moneytax);
  userNamefield.setText(userName);
  userRolefield.setText(userRole);

  form.flatten();

  const pdfBytes = await pdfDoc.save();

  await download(pdfBytes, `${pdfname}.pdf`, "application/pdf");

  $(".resetpdf").click();
}

$(".generate-excel input").change(function () {
  $(".generateexcelreport").removeAttr("disabled");
});

$(".newpdffile").click(function () {
  const name = $(".filename-input").val();
  savepdf(name);
});

$(".resetpdf").click(function () {
  $("#myform")[0].reset();
  $("#myform .date-inner-container input").attr("disabled", true);
  $(".dropdown-container select").attr("disabled", true);
  $(
    ".dynamic-form-container .dynamic-form-inner-container.income .table select"
  ).attr("disabled", true);
  $(
    ".dynamic-form-container .dynamic-form-inner-container.income .table.income input"
  ).attr("disabled", true);
  $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table select"
  ).attr("disabled", true);
  $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table.money input"
  ).attr("disabled", true);
  $(".dynamic-form-container .user-container input").attr("disabled", true);
  $(".newpdffile").attr("disabled", true);
});
