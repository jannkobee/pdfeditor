let atcincome = $(
  ".dynamic-form-inner-container.income .table .select-atc"
).val();
let atcmoney = $(
  ".dynamic-form-inner-container.money .table .select-atc"
).val();

$(document).ready(function () {
  const excel = "assets/excel.xlsx";
  getexcel(excel);
});

async function getexcel(excel) {
  const data = await fetch(excel).then((res) => res.arrayBuffer());
  saveexcel(data);
}

async function saveexcel(data) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(data);
  const worksheet = workbook.getWorksheet("Page1");
  worksheet.mergeCells("A38:K40");
  // if (atcincome == 0.01) {
  //   ws.getCell("A38").value =
  //     "Income payments made by the government and government owned and controlled corporation (GOCCs) to its local/resident suppliers of goods other than those covered by other rates of withholding tax.";
  //   ws.getCell("A38").alignment = { horizontal: "center" };
  // } else if (atcincome == 0.02) {
  //   ws.getCell("A38").value =
  //     "Income payments made by the government and government owned and controlled corporation (GOCCs) to its local/resident suppliers of services other than those covered by other rates of withholding tax.";
  //   ws.getCell("A38").alignment = { horizontal: "center" };
  // } else if (atcincome == 0.05) {
  //   ws.getCell("A38").value =
  //     "Rental: On gross rental or lease for the continued use or possession of personal property in excess of Ten thousand pesos (P 10,000.00) anually and real property used in business which payor or obligor has not taken title or is not taking title, or in which has no equity: poles satellites, transmission facilities and billboards.";
  //   ws.getCell("A38").alignment = { horizontal: "center" };
  // }
  // if(atcmoney == 0.05){

  // }
  $(".newpdffile").click(function () {
    download(workbook, "sir.xlsx", "application/xlsx");
    // const buffer = workbook.xlsx.writeBuffer().then((data) => {
    //   const blob = new Blob([data], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    //   });
    //   download(blob, "sir.xlsx", "application/xlsx");
    //   // saveAs(blob, "test.xlsx");
    // });
  });
}
