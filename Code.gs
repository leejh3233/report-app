
function doPost(e) {
  var sheet = SpreadsheetApp.openById("1RRC65QOLxH68NO9kv3tFyLq4YP01M0v9pPIkOKxrCto").getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data["시공팀원"], data["시공일"], data["작업시간"], data["지역"], data["아파트명"],
    data["평수"], data["신축여부"], data["결제방법"], data["색상"], data["판매갯수"],
    data["판매비용"], data["미결제금액"], data["시공범위"], data["예약금현금영수증"], data["기타"]
  ]);
}
