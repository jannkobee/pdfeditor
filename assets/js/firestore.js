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
          $(".dynamic-form-inner-container.income .table.income .1stmonth").val(
            first.toFixed(2)
          );
        } else if (second > 0) {
          second = parseFloat(second) / parseFloat(1.12);
          $(".dynamic-form-inner-container.income .table.income .2ndmonth").val(
            second.toFixed(2)
          );
        } else if (third > 0) {
          third = parseFloat(third) / parseFloat(1.12);
          $(".dynamic-form-inner-container.income .table.income .3rdmonth").val(
            third.toFixed(2)
          );
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

$("modal .body .dynamic-form-container .user-container .userRole").change(
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
    const atc = $(
      ".dynamic-form-inner-container.money .table .select-atc"
    ).val();
    if (atc > 0) {
      const first = $(
        ".dynamic-form-inner-container.money .table.money .1stmonth"
      ).val();
      const second = $(
        ".dynamic-form-inner-container.money .table.money .2ndmonth"
      ).val();
      const third = $(
        ".dynamic-form-inner-container.money .table.money .3rdmonth"
      ).val();
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
  const atc = $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table .select-atc option:selected"
  ).text();
  let rate = "";
  const base = $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table.money .total"
  ).val();
  const withheld = $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table.money .tax"
  ).val();
  $(
    ".dynamic-form-container .dynamic-form-inner-container.money .table .select-atc option:selected"
  ).each(function () {
    rate = $(this).attr("rate");
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
      addDoc(colRef1, {
        month: month,
        year: year,
        name: name,
        tin: tin,
        atc: atc,
        rate: rate,
        base: base,
        withheld: withheld,
      });
    } catch (error) {
      alert(error);
    }
  }
});

async function getWhereDocs(month, year) {
  const q = query(collection(db, "pdfsummary"), where("month", "==", month));
  await getDocs(q)
    .then((snapshot) => {
      let data = [];
      let data1 = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      for (let i = 0; i < data.length; i++) {
        if (data[i]["year"] == year) {
          data1.push(data[i]);
        }
      }
      console.log(data1);
      if (data1.length > 0) {
        exportJS(data1);
      } else {
        alert("No data");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}

async function exportJS(data) {
  let number = data.length;
  let totalbase = 0;
  let totalwithheld = 0;

  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("My Sheet");

  //   worksheet.pageSetup.printArea = "A1:F20";

  worksheet.getColumn("A").width = 22;
  worksheet.getColumn("B").width = 18;
  worksheet.getColumn("C").width = 10;
  worksheet.getColumn("D").width = 10;
  worksheet.getColumn("E").width = 15;
  worksheet.getColumn("F").width = 15;

  worksheet.getRow("6").height = 36;
  worksheet.getRow("6").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getRow("6").font = { bold: true, size: 12 };

  worksheet.mergeCells("A1:F1");
  worksheet.mergeCells("A2:F2");
  worksheet.mergeCells("A3:F3");
  worksheet.mergeCells("A4:F4");

  worksheet.getCell("A1").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell("A2").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell("A3").alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell("A4").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.mergeCells(`A${number + 7}:D${number + 7}`);
  worksheet.getRow(`${number + 7}`).height = 35;
  worksheet.getCell(`A${number + 7}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`E${number + 7}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`F${number + 7}`).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(`E${number + 7}`).alignment = {
    horizontal: "right",
    vertical: "middle",
  };
  worksheet.getCell(`F${number + 7}`).alignment = {
    vertical: "middle",
    horizontal: "right",
  };

  worksheet.getCell("A4").font = { bold: true };

  worksheet.getCell("A1").value =
    "Office of the Presidential Adviser on Peace, Reconciliation, and Unity";
  worksheet.getCell("A2").value =
    "Agustin I Bldg F. Ortigas Jr. Rd. Ortigas Center Pasig City";
  worksheet.getCell("A3").value = "003-826-398-000";
  worksheet.getCell(
    "A4"
  ).value = `For this Month of ${data[0]["month"]} ${data[0]["year"]}`;

  worksheet.getCell("A3").value = "003-826-398-000";

  worksheet.getCell("A6").value = "Payee Name";
  worksheet.getCell("B6").value = "TIN Number";
  worksheet.getCell("C6").value = "ATC";
  worksheet.getCell("D6").value = "Tax Rate";
  worksheet.getCell("E6").value = "Tax Base";
  worksheet.getCell("F6").value = "Tax Withheld";

  //   worksheet.getCell("A6:F6")

  worksheet.getCell("A6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("B6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("C6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("D6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("E6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("F6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  for (let a = 0; a < data.length; a++) {
    let b = 7 + a;
    totalbase = parseFloat(totalbase) + parseFloat(data[a]["base"]);
    totalwithheld = parseFloat(totalwithheld) + parseFloat(data[a]["withheld"]);

    worksheet.getCell(`A${b}`).value = data[a]["name"];
    worksheet.getCell(`B${b}`).value = data[a]["tin"];
    worksheet.getCell(`C${b}`).value = data[a]["atc"];
    worksheet.getCell(`D${b}`).value = data[a]["rate"];
    worksheet.getCell(`E${b}`).value = parseFloat(data[a]["base"]);
    worksheet.getCell(`F${b}`).value = parseFloat(data[a]["withheld"]);

    worksheet.getCell(`A${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`B${b}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`C${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`D${b}`).alignment = {
      horizontal: "center",
    };
    worksheet.getCell(`E${b}`).alignment = {
      horizontal: "right",
    };
    worksheet.getCell(`F${b}`).alignment = {
      horizontal: "right",
    };

    worksheet.getCell(`E${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";
    worksheet.getCell(`F${b}`).numFmt = "#,##0.00;[Red]-#,##0.00";

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
  }

  worksheet.getCell(`E${number + 7}`).value = totalbase;
  worksheet.getCell(`F${number + 7}`).value = totalwithheld;
  worksheet.getCell(`E${number + 7}`).numFmt = "#,##0.00;[Red]-#,##0.00";
  worksheet.getCell(`F${number + 7}`).numFmt = "#,##0.00;[Red]-#,##0.00";

  worksheet.getCell(`A${number + 10}`).value = "Prepared by";

  totalbase = 0;
  totalwithheld = 0;

  await workbook.xlsx.writeBuffer().then(function (datas) {
    var blob = new Blob([datas], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${data[0]["month"]} ${data[0]["year"]} Report.xlsx`);
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
