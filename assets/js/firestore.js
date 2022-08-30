// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
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

  try {
    addDoc(colRef, {
      tin: tin,
      name: name,
      address: address,
      faddress: faddress,
      zip: zip,
    });
    $(".toast-success").toast("show");
    getData();
  } catch (error) {
    alert(error);
  }
});

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
          "modal .body .auto-complete-form-container .inner-container .name"
        ).val(data.name);
        $(
          "modal .body .auto-complete-form-container .inner-container .address"
        ).val(data.address);
        $(
          "modal .body .auto-complete-form-container .inner-container .faddress"
        ).val(data.faddress);
      }
    });
  });
});

$(".editpdf").click(function () {
  const name = $(".filename-input").val();
  savepdf(name);
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
