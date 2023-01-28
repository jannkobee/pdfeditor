// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
let json = [];
var downed = 0;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjIhm7uJDu4rqIYwEzLxLzyqhcwTav5Rg",
  authDomain: "pdfeditor-7648b.firebaseapp.com",
  projectId: "pdfeditor-7648b",
  storageBucket: "pdfeditor-7648b.appspot.com",
  messagingSenderId: "355023462354",
  appId: "1:355023462354:web:a9a124186a0238e724b20b",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, "pdfeditor");
const colRef1 = collection(db, "pdfsummary");
const colRef2 = collection(db, "pdfsummary1");
const colRef3 = collection(db, "pdfsummary2");

$(document).ready(function () {
  getData();
});

function getData() {
  $(".payees-dropdown").empty();
  getDocs(colRef)
    .then((snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      json = data;
      console.log(json);
      $(".payees-dropdown").append(`
         <option disabled selected>Select Payee</option>
      `);
      json.forEach(function (data) {
        $(".payees-dropdown").append(`
            <option value="${data.name}">${data.name}</option>
        `);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function space(el, after) {
  // defaults to a space after 4 characters:
  after = after || 4;

  /* removes all characters in the value that aren't a number,
       or in the range from A to Z (uppercase): */
  var v = el.value.replace(/[^\dA-Z]/g, ""),
    /* creating the regular expression, to allow for the 'after' variable
       to be used/changed: */
    reg = new RegExp(".{" + after + "}", "g");
  el.value = v.replace(reg, function (a, b, c) {
    return a + " ";
  });
}

$("modal.addpayee .body .form-container .inner-container .tin").keydown(
  function () {
    let numbers = $(this).val();
    if (numbers.length < 13) {
      space(this, 3);
    }
  }
);

// $("modal.addpayee .body .form-container .inner-container .zip").keydown(
//   function () {
//     let numbers = $(this).val();
//     if (numbers.length > 3) {
//       if (event.keyCode != 8) {
//         return false;
//       }
//     }
//   }
// );

$("modal.addpayee .footer button").click(function (e) {
  e.preventDefault();
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
  const vat = $(
    "modal.addpayee .body .form-container .inner-container .reg-vat"
  ).val();

  try {
    addDoc(colRef, {
      tin: tin,
      name: name,
      address: address,
      faddress: faddress,
      zip: zip,
      vat: vat,
    });
    $(".toast-success").toast("show");
    $("modal.addpayee .body .form-container .inner-container input").val("");
    getData();
  } catch (error) {
    alert(error);
  }
});

$(".summaryornot").change(function () {
  $(".date-container .date-inner-container .date-from").removeAttr("disabled");
});

$(".body .dropdown-container .payees-dropdown").change(function () {
  $(".dynamic-form-inner-container.income .table select").removeAttr(
    "disabled"
  );
  $(".dynamic-form-inner-container.money .table select").removeAttr("disabled");
});

$(".dynamic-form-inner-container.income .table .select-atc").change(
  function () {
    $(".dynamic-form-inner-container.income .table.income input").removeAttr(
      "disabled"
    );
    $(".dynamic-form-inner-container.income .table.income input").val("0");
    $(".newpdffile").attr("disabled", true);
  }
);

$(".date-container .date-inner-container .date-from").change(function () {
  $(".date-container .date-inner-container .date-to").removeAttr("disabled");
});

$(".date-container .date-inner-container .date-to").change(function () {
  $(".dropdown-container .payees-dropdown").removeAttr("disabled");
});

$(".dynamic-form-inner-container.income .table.income input").focusout(
  function () {
    const total = $(
      ".dynamic-form-inner-container.income .table.income .total"
    ).val();
    if ($(this).val() == "") {
      $(this).val(0);
    }
  }
);

$(".dynamic-form-inner-container.income .table.income .1stmonth").on(
  "focusin",
  function () {
    $(".dynamic-form-inner-container.income .table.income .1stmonth").val("");
    $(
      ".dynamic-form-inner-container.income .table.income .ifvatregincome1st"
    ).html("");
  }
);

$(".dynamic-form-inner-container.income .table.income .2ndmonth").on(
  "focusin",
  function () {
    $(".dynamic-form-inner-container.income .table.income .2ndmonth").val("");
    $(
      ".dynamic-form-inner-container.income .table.income .ifvatregincome2nd"
    ).html("");
  }
);

$(".dynamic-form-inner-container.income .table.income .3rdmonth").on(
  "focusin",
  function () {
    $(".dynamic-form-inner-container.income .table.income .3rdmonth").val("");
    $(
      ".dynamic-form-inner-container.income .table.income .ifvatregincome3rd"
    ).html("");
  }
);

$(".dynamic-form-inner-container.money .table.money .1stmonth").on(
  "focusin",
  function () {
    $(".dynamic-form-inner-container.money .table.money .1stmonth").val("");
    $(
      ".dynamic-form-inner-container.money .table.money .ifvatregmoney1st"
    ).html("");
  }
);

$(".dynamic-form-inner-container.money .table.money .2ndmonth").on(
  "focusin",
  function () {
    $(".dynamic-form-inner-container.money .table.money .2ndmonth").val("");
    $(
      ".dynamic-form-inner-container.money .table.money .ifvatregmoney2nd"
    ).html("");
  }
);

$(".dynamic-form-inner-container.money .table.money .3rdmonth").on(
  "focusin",
  function () {
    $(".dynamic-form-inner-container.money .table.money .3rdmonth").val("");
    $(
      ".dynamic-form-inner-container.money .table.money .ifvatregmoney3rd"
    ).html("");
  }
);

$(".dynamic-form-inner-container.income .table.income input").on(
  "focusout",
  function () {
    const vatreg = $(
      "modal .body .auto-complete-form-container .inner-container .vat"
    ).val();
    // console.log(vatreg);
    const atc = $(
      ".dynamic-form-inner-container.income .table .select-atc"
    ).val();
    if (atc > 0) {
      var first = $(
        ".dynamic-form-inner-container.income .table.income .1stmonth"
      ).val();
      var second = $(
        ".dynamic-form-inner-container.income .table.income .2ndmonth"
      ).val();
      var third = $(
        ".dynamic-form-inner-container.income .table.income .3rdmonth"
      ).val();
      if (vatreg == "vat") {
        if (first > 0) {
          first = parseFloat(first) / parseFloat(1.12);
          $(
            ".dynamic-form-inner-container.income .table.income .ifvatregincome1st"
          ).html(first.toFixed(2));
        }
        if (second > 0) {
          second = parseFloat(second) / parseFloat(1.12);
          $(
            ".dynamic-form-inner-container.income .table.income .ifvatregincome2nd"
          ).html(second.toFixed(2));
        }
        if (third > 0) {
          third = parseFloat(third) / parseFloat(1.12);
          $(
            ".dynamic-form-inner-container.income .table.income .ifvatregincome3rd"
          ).html(third.toFixed(2));
        }
      }
      $(".dynamic-form-inner-container.income .table.income .total").val(
        add(first, second, third)
      );

      function add(a, b, c) {
        var sum = 0;
        sum = parseFloat(a) + parseFloat(b) + parseFloat(c);
        console.log("Sum:" + sum);
        if (sum <= 0) {
          $(
            "modal .body .dynamic-form-container .user-container .userName"
          ).attr("disabled", true);
          $(
            "modal .body .dynamic-form-container .user-container .userRole"
          ).attr("disabled", true);
        } else {
          $(
            "modal .body .dynamic-form-container .user-container .userName"
          ).removeAttr("disabled");
          $(
            "modal .body .dynamic-form-container .user-container .userRole"
          ).removeAttr("disabled");
        }
        var tax = mult(sum);
        $(".dynamic-form-inner-container.income .table.income .tax").val(tax);
        return sum.toFixed(2);
      }

      function mult(a) {
        var tax = 0;
        tax = parseFloat(a) * parseFloat(atc);
        return tax.toFixed(2);
      }
    }
  }
);

$(".dynamic-form-inner-container.money .table .select-atc").change(function () {
  $(".dynamic-form-inner-container.money .table.money input").val("0");
  $(".dynamic-form-inner-container.money .table.money input").removeAttr(
    "disabled"
  );
});

$("modal .body .dynamic-form-container .user-container .userName").change(
  function () {
    $(".newpdffile").removeAttr("disabled");
  }
);

$(".dynamic-form-inner-container.money .table.money input").focusout(
  function () {
    if ($(this).val() == "") {
      $(this).val(0);
    }
  }
);

$(".dynamic-form-inner-container.money .table.money input").on(
  "focusout",
  function () {
    const vatreg = $(
      "modal .body .auto-complete-form-container .inner-container .vat"
    ).val();
    const atc = $(
      ".dynamic-form-inner-container.money .table .select-atc"
    ).val();
    if (atc > 0) {
      var first = $(
        ".dynamic-form-inner-container.money .table.money .1stmonth"
      ).val();
      var second = $(
        ".dynamic-form-inner-container.money .table.money .2ndmonth"
      ).val();
      var third = $(
        ".dynamic-form-inner-container.money .table.money .3rdmonth"
      ).val();
      if (vatreg == "vat") {
        if (first > 0) {
          first = parseFloat(first) / parseFloat(1.12);
          $(
            ".dynamic-form-inner-container.money .table.money .ifvatregmoney1st"
          ).html(first.toFixed(2));
        }
        if (second > 0) {
          second = parseFloat(second) / parseFloat(1.12);
          $(
            ".dynamic-form-inner-container.money .table.money .ifvatregmoney2nd"
          ).html(second.toFixed(2));
        }
        if (third > 0) {
          third = parseFloat(third) / parseFloat(1.12);
          $(
            ".dynamic-form-inner-container.money .table.money .ifvatregmoney3rd"
          ).html(third.toFixed(2));
        }
      }
      $(".dynamic-form-inner-container.money .table.money .total").val(
        add(first, second, third)
      );

      function add(a, b, c) {
        var sum = 0;
        sum = parseFloat(a) + parseFloat(b) + parseFloat(c);
        var tax = mult(sum);
        $(".dynamic-form-inner-container.money .table.money .tax").val(tax);
        return sum.toFixed(2);
      }

      function mult(a) {
        var tax = 0;
        tax = parseFloat(a) * parseFloat(atc);
        return tax.toFixed(2);
      }
    }
  }
);

$(`.newfilebutton`).click(function () {
  $("backdrop").addClass("active");
  $("modal.newfile").addClass("active");
  $("modal .body .dropdown-container .payees-dropdown").change(function () {
    json.forEach(function (data) {
      if (
        $("modal .body .dropdown-container .payees-dropdown").val() == data.name
      ) {
        $(
          "modal .body .auto-complete-form-container .inner-container .tin"
        ).val(data.tin);
        $(
          "modal .body .auto-complete-form-container .inner-container .zip"
        ).val(data.zip);
        $(
          "modal .body .auto-complete-form-container .inner-container .address"
        ).val(data.address);
        $(
          "modal .body .auto-complete-form-container .inner-container .faddress"
        ).val(data.faddress);
        $(
          "modal .body .auto-complete-form-container .inner-container .vat"
        ).val(data.vat);
      }
    });
  });
});

$(".generatereportbutton").click(function () {
  $("backdrop").addClass("active");
  $("modal.generateexcel").addClass("active");
});

$(".newpdffile").click(function () {
  const summaryornot = $(".summaryornot:checked").val();
  const date = $(".date-container .date-inner-container .date-from").val();
  const name = $(".dropdown-container .payees-dropdown").val();
  const tin = $(".auto-complete-form-container .inner-container .tin").val();
  const atcIncome = $(
    ".dynamic-form-container .dynamic-form-inner-container.income .table .select-atc option:selected"
  ).text();
  let rateIncome = "";
  const baseIncome = $(
    ".dynamic-form-container .dynamic-form-inner-container.income .table.income .total"
  ).val();
  const withheldIncome = $(
    ".dynamic-form-container .dynamic-form-inner-container.income .table.income .tax"
  ).val();
  $(
    ".dynamic-form-container .dynamic-form-inner-container.income .table .select-atc option:selected"
  ).each(function () {
    rateIncome = $(this).attr("rate");
  });

  const atcMoney = $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table .select-atc option:selected"
  ).text();
  let rateMoney = "";
  const baseMoney = $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table.money .total"
  ).val();
  const withheldMoney = $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table.money .tax"
  ).val();
  $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table .select-atc option:selected"
  ).each(function () {
    rateMoney = $(this).attr("rate");
  });
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var d = new Date(date);
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  console.log(summaryornot);
  if (summaryornot == "Cash") {
    try {
      if (atcIncome != "Select an ATC") {
        addDoc(colRef1, {
          month: month,
          year: year,
          name: name,
          tin: tin,
          atc: atcIncome,
          rate: rateIncome,
          base: baseIncome,
          withheld: withheldIncome,
        });
      }
      if (atcMoney != "Select an ATC") {
        if (atcMoney == "WB080") {
          addDoc(colRef3, {
            month: month,
            year: year,
            name: name,
            tin: tin,
            atc: atcMoney,
            rate: rateMoney,
            base: baseMoney,
            withheld: withheldMoney,
          });
        } else {
          addDoc(colRef2, {
            month: month,
            year: year,
            name: name,
            tin: tin,
            atc: atcMoney,
            rate: rateMoney,
            base: baseMoney,
            withheld: withheldMoney,
          });
        }
      }
    } catch (error) {
      alert(error);
    }
  }
});

async function getWhereDocs(month, year) {
  const data = [];
  const q = query(collection(db, "pdfsummary"), where("month", "==", month));
  const q1 = query(collection(db, "pdfsummary1"), where("month", "==", month));
  const q2 = query(collection(db, "pdfsummary2"), where("month", "==", month));
  await getDocs(q)
    .then((snapshot) => {
      let incomeData = [];
      snapshot.docs.forEach((doc) => {
        incomeData.push({ ...doc.data(), id: doc.id });
      });
      console.log(incomeData);
      if (incomeData.length > 0) {
        // exportJS(incomeData);
        data.push(incomeData);
      } else {
        data.push([]);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  await getDocs(q1)
    .then((snapshot) => {
      let moneyData = [];
      snapshot.docs.forEach((doc) => {
        moneyData.push({ ...doc.data(), id: doc.id });
      });
      console.log(moneyData);
      if (moneyData.length > 0) {
        data.push(moneyData);
        // exportJS(income);
      } else {
        data.push([]);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  await getDocs(q2)
    .then((snapshot) => {
      let money2Data = [];
      snapshot.docs.forEach((doc) => {
        money2Data.push({ ...doc.data(), id: doc.id });
      });
      console.log(money2Data);
      if (money2Data.length > 0) {
        data.push(money2Data);
        // exportJS(income);
      } else {
        data.push([]);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  console.log(data);
  exportJS(data, month, year);
}
async function exportJS(data, month, year) {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Sheet 1");

  let cellNumber = 8;
  let totalBase = 0;
  let totalWithheld = 0;
  let dataIncome = data[0].length;
  let dataMoney = data[1].length;
  let dataMoney1 = data[2].length;

  if (dataIncome === 0 && dataMoney === 0 && dataMoney1 === 0) {
    alert("No data on " + month + " " + year);
  }

  //   worksheet.pageSetup.printArea = "A1:F20";

  worksheet.getColumn("A").width = 5;
  worksheet.getColumn("B").width = 15;
  worksheet.getColumn("C").width = 18;
  worksheet.getColumn("D").width = 10;
  worksheet.getColumn("E").width = 10;
  worksheet.getColumn("F").width = 15;
  worksheet.getColumn("G").width = 15;

  worksheet.getCell("G2").value = "0619E";
  worksheet.getRow("2").font = { bold: true, size: 11 };
  worksheet.getCell("G2").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getRow("7").height = 36;
  worksheet.getRow("7").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getRow("7").font = { bold: true, size: 12 };

  worksheet.mergeCells("A3:G3");
  worksheet.mergeCells("A4:G4");
  worksheet.mergeCells("A5:G5");
  worksheet.mergeCells("A6:G6");

  worksheet.getCell("A3").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell("A4").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell("A5").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell("A6").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell("A6").font = { bold: true };

  worksheet.getCell("A3").value =
    "Office of the Presidential Adviser on Peace, Reconciliation, and Unity";
  worksheet.getCell("A4").value =
    "Agustin I Bldg F. Ortigas Jr. Rd. Ortigas Center Pasig City";
  worksheet.getCell("A5").value = "003-826-398-000";
  worksheet.getCell(
    "A6"
  ).value = `For this Month of ${data[0][0]["month"]} ${data[0][0]["year"]}`;

  worksheet.getCell("A7").value = "No";
  worksheet.getCell("B7").value = "Payee Name";
  worksheet.getCell("C7").value = "TIN Number";
  worksheet.getCell("D7").value = "ATC";
  worksheet.getCell("E7").value = "Tax Rate";
  worksheet.getCell("F7").value = "Tax Base";
  worksheet.getCell("G7").value = "Tax Withheld";

  //   worksheet.getCell("A6:F6")
  worksheet.getCell("A7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("B7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("C7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("D7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("E7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("F7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("G7").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  for (let a = 0; a < data[0].length; a++) {
    let b = 8 + a;
    cellNumber = b + 1;
    totalBase = parseFloat(totalBase) + parseFloat(data[0][a]["base"]);
    totalWithheld =
      parseFloat(totalWithheld) + parseFloat(data[0][a]["withheld"]);

    worksheet.getCell(`A${b}`).value = parseFloat(a) + parseFloat(1);
    worksheet.getCell(`B${b}`).value = data[0][a]["name"];
    worksheet.getCell(`C${b}`).value = data[0][a]["tin"];
    worksheet.getCell(`D${b}`).value = data[0][a]["atc"];
    worksheet.getCell(`E${b}`).value = data[0][a]["rate"];
    worksheet.getCell(`F${b}`).value = parseFloat(data[0][a]["base"]);
    worksheet.getCell(`G${b}`).value = parseFloat(data[0][a]["withheld"]);

    worksheet.getCell(`A${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`B${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`C${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`D${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`E${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`F${b}`).alignment = {
      horizontal: "right",
    };
    worksheet.getCell(`G${b}`).alignment = {
      horizontal: "right",
    };

    worksheet.getCell(`F${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";
    worksheet.getCell(`G${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";

    worksheet.getCell(`A${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`B${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`C${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`D${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`E${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`F${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`G${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }

  worksheet.mergeCells(`A${cellNumber}:E${cellNumber}`);
  // worksheet.getRow(`${cellNumber}`).height = 35;
  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(`A${cellNumber}`).value = "Total";
  worksheet.getCell(`A${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`G${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).alignment = {
    horizontal: "right",
    vertical: "middle",
  };
  worksheet.getCell(`G${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "right",
  };

  worksheet.getCell(`F${cellNumber}`).value = totalBase;
  worksheet.getCell(`G${cellNumber}`).value = totalWithheld;
  worksheet.getCell(`F${cellNumber}`).numFmt = "#,##0.00;[Red]-#,##0.00";
  worksheet.getCell(`G${cellNumber}`).numFmt = "#,##0.00;[Red]-#,##0.00";

  // worksheet.getCell(`A${incomeNumber + 10}`).value = "Prepared by";
  // worksheet.getCell(`G${incomeNumber + 10}`).value = $(
  //   ".generate-excel select"
  // ).val();

  totalBase = 0;
  totalWithheld = 0;

  cellNumber = cellNumber + 2;
  worksheet.getCell(`G${cellNumber}`).value = "1600VT";
  worksheet.getRow(`${cellNumber}`).font = { bold: true, size: 11 };
  worksheet.getCell(`G${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).value =
    "Office of the Presidential Adviser on Peace, Reconciliation, and Unity";

  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).value =
    "Agustin I Bldg F. Ortigas Jr. Rd. Ortigas Center Pasig City";

  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).value = "003-826-398-000";

  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).font = { bold: true };

  worksheet.getCell(
    `A${cellNumber}`
  ).value = `For this Month of ${data[0][0]["month"]} ${data[0][0]["year"]}`;

  cellNumber = cellNumber + 1;

  worksheet.getRow(`${cellNumber}`).height = 36;
  worksheet.getRow(`${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getRow(`${cellNumber}`).font = { bold: true, size: 12 };

  worksheet.getCell(`A${cellNumber}`).value = "No";
  worksheet.getCell(`B${cellNumber}`).value = "Payee Name";
  worksheet.getCell(`C${cellNumber}`).value = "TIN Number";
  worksheet.getCell(`D${cellNumber}`).value = "ATC";
  worksheet.getCell(`E${cellNumber}`).value = "Tax Rate";
  worksheet.getCell(`F${cellNumber}`).value = "Tax Base";
  worksheet.getCell(`G${cellNumber}`).value = "Tax Withheld";

  //   worksheet.getCell("A6:F6")
  worksheet.getCell(`A${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`B${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`C${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`D${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`E${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`G${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  for (let a = 0; a < data[1].length; a++) {
    cellNumber = cellNumber + 1;
    let b = cellNumber;
    totalBase = parseFloat(totalBase) + parseFloat(data[1][a]["base"]);
    totalWithheld =
      parseFloat(totalWithheld) + parseFloat(data[1][a]["withheld"]);

    worksheet.getCell(`A${b}`).value = parseFloat(a) + parseFloat(1);
    worksheet.getCell(`B${b}`).value = data[1][a]["name"];
    worksheet.getCell(`C${b}`).value = data[1][a]["tin"];
    worksheet.getCell(`D${b}`).value = data[1][a]["atc"];
    worksheet.getCell(`E${b}`).value = data[1][a]["rate"];
    worksheet.getCell(`F${b}`).value = parseFloat(data[1][a]["base"]);
    worksheet.getCell(`G${b}`).value = parseFloat(data[1][a]["withheld"]);

    worksheet.getCell(`A${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`B${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`C${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`D${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`E${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`F${b}`).alignment = {
      horizontal: "right",
    };
    worksheet.getCell(`G${b}`).alignment = {
      horizontal: "right",
    };

    worksheet.getCell(`F${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";
    worksheet.getCell(`G${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";

    worksheet.getCell(`A${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`B${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`C${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`D${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`E${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`F${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`G${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }
  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:E${cellNumber}`);
  // worksheet.getRow(`${cellNumber}`).height = 35;
  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(`A${cellNumber}`).value = "Total";
  worksheet.getCell(`A${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`G${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).alignment = {
    horizontal: "right",
    vertical: "middle",
  };
  worksheet.getCell(`G${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "right",
  };

  worksheet.getCell(`F${cellNumber}`).value = totalBase;
  worksheet.getCell(`G${cellNumber}`).value = totalWithheld;
  worksheet.getCell(`F${cellNumber}`).numFmt = "#,##0.00;[Red]-#,##0.00";
  worksheet.getCell(`G${cellNumber}`).numFmt = "#,##0.00;[Red]-#,##0.00";

  // worksheet.getCell(`A${incomeNumber + 10}`).value = "Prepared by";
  // worksheet.getCell(`G${incomeNumber + 10}`).value = $(
  //   ".generate-excel select"
  // ).val();

  totalBase = 0;
  totalWithheld = 0;

  cellNumber = cellNumber + 2;
  worksheet.getCell(`G${cellNumber}`).value = "1600PT";
  worksheet.getRow(`${cellNumber}`).font = { bold: true, size: 11 };
  worksheet.getCell(`G${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).value =
    "Office of the Presidential Adviser on Peace, Reconciliation, and Unity";

  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).value =
    "Agustin I Bldg F. Ortigas Jr. Rd. Ortigas Center Pasig City";

  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).value = "003-826-398-000";

  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:G${cellNumber}`);

  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(`A${cellNumber}`).font = { bold: true };

  worksheet.getCell(
    `A${cellNumber}`
  ).value = `For this Month of ${data[0][0]["month"]} ${data[0][0]["year"]}`;

  cellNumber = cellNumber + 1;

  worksheet.getRow(`${cellNumber}`).height = 36;
  worksheet.getRow(`${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getRow(`${cellNumber}`).font = { bold: true, size: 12 };

  worksheet.getCell(`A${cellNumber}`).value = "No";
  worksheet.getCell(`B${cellNumber}`).value = "Payee Name";
  worksheet.getCell(`C${cellNumber}`).value = "TIN Number";
  worksheet.getCell(`D${cellNumber}`).value = "ATC";
  worksheet.getCell(`E${cellNumber}`).value = "Tax Rate";
  worksheet.getCell(`F${cellNumber}`).value = "Tax Base";
  worksheet.getCell(`G${cellNumber}`).value = "Tax Withheld";

  //   worksheet.getCell("A6:F6")
  worksheet.getCell(`A${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`B${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`C${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`D${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`E${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`G${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  for (let a = 0; a < data[2].length; a++) {
    cellNumber = cellNumber + 1;
    let b = cellNumber;
    totalBase = parseFloat(totalBase) + parseFloat(data[2][a]["base"]);
    totalWithheld =
      parseFloat(totalWithheld) + parseFloat(data[2][a]["withheld"]);

    worksheet.getCell(`A${b}`).value = parseFloat(a) + parseFloat(1);
    worksheet.getCell(`B${b}`).value = data[2][a]["name"];
    worksheet.getCell(`C${b}`).value = data[2][a]["tin"];
    worksheet.getCell(`D${b}`).value = data[2][a]["atc"];
    worksheet.getCell(`E${b}`).value = data[2][a]["rate"];
    worksheet.getCell(`F${b}`).value = parseFloat(data[2][a]["base"]);
    worksheet.getCell(`G${b}`).value = parseFloat(data[2][a]["withheld"]);

    worksheet.getCell(`A${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`B${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`C${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`D${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`E${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`F${b}`).alignment = {
      horizontal: "right",
    };
    worksheet.getCell(`G${b}`).alignment = {
      horizontal: "right",
    };

    worksheet.getCell(`F${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";
    worksheet.getCell(`G${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";

    worksheet.getCell(`A${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`B${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`C${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`D${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`E${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`F${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`G${b}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }
  cellNumber = cellNumber + 1;

  worksheet.mergeCells(`A${cellNumber}:E${cellNumber}`);
  // worksheet.getRow(`${cellNumber}`).height = 35;
  worksheet.getCell(`A${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(`A${cellNumber}`).value = "Total";
  worksheet.getCell(`A${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`G${cellNumber}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${cellNumber}`).alignment = {
    horizontal: "right",
    vertical: "middle",
  };
  worksheet.getCell(`G${cellNumber}`).alignment = {
    vertical: "middle",
    horizontal: "right",
  };

  worksheet.getCell(`F${cellNumber}`).value = totalBase;
  worksheet.getCell(`G${cellNumber}`).value = totalWithheld;
  worksheet.getCell(`F${cellNumber}`).numFmt = "#,##0.00;[Red]-#,##0.00";
  worksheet.getCell(`G${cellNumber}`).numFmt = "#,##0.00;[Red]-#,##0.00";

  // worksheet.getCell(`A${incomeNumber + 10}`).value = "Prepared by";
  // worksheet.getCell(`G${incomeNumber + 10}`).value = $(
  //   ".generate-excel select"
  // ).val();

  totalBase = 0;
  totalWithheld = 0;

  await workbook.xlsx.writeBuffer().then(function (datas) {
    var blob = new Blob([datas], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${data[0][0]["month"]} ${data[0][0]["year"]} Report.xlsx`);
  });
}

$(".generateexcelreport").click(function () {
  const monthyear = $(".generate-excel input").val();
  const array = monthyear.split("-");
  let month = array[1];
  if (month == "01") {
    month = "January";
  } else if (month == "02") {
    month = "February";
  } else if (month == "03") {
    month = "March";
  } else if (month == "04") {
    month = "April";
  } else if (month == "05") {
    month = "May";
  } else if (month == "06") {
    month = "June";
  } else if (month == "07") {
    month = "July";
  } else if (month == "08") {
    month = "August";
  } else if (month == "09") {
    month = "September";
  } else if (month == "10") {
    month = "October";
  } else if (month == "11") {
    month = "November";
  } else if (month == "12") {
    month = "December";
  }
  const year = array[0];
  getWhereDocs(month, year);
});

$(`.addpayeebutton`).click(function () {
  $("backdrop").addClass("active");
  $("modal.addpayee").addClass("active");
  $("modal.addpayee .body .form-container .inner-container");
});

$(`.closemodal`).click(function () {
  $("backdrop").removeClass("active");
  $("modal").removeClass("active");
});
