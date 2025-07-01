
function doPost(e) {
  var sheet = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID").getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data["시공일자"], data["시공팀원"], data["지역"], data["아파트명"],
    data["동호수"], data["연락처"], data["평수"], data["시공범위"],
    data["신축여부"], data["결제방법"], data["색상"], data["판매갯수"],
    data["판매비용"], data["미결제금액"], data["예약금현금영수증"],
    data["특이사항"]
  ]);
  return ContentService.createTextOutput("Success");
}
