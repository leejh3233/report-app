
function showResult() {
  const form = document.forms["reportForm"];
  const labels = [
    "시공팀원", "지역", "아파트명", "동 호수", "연락처", "평수", "시공범위", "신축여부",
    "결제방법", "색상", "판매갯수", "판매비용", "미결제금액", "예약금 현금영수증", "특이사항"
  ];
  const output = labels.map((label, i) => `${i + 1}. ${label}: ${form[i].value}`).join("\n");
  document.getElementById("output").textContent = output;
}

function copyResult() {
  const result = document.getElementById("output").textContent;
  navigator.clipboard.writeText(result).then(() => alert("복사 완료!"));
}

function sendToSheet() {
  const result = document.getElementById("output").textContent;
  fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_URL/exec", {
    method: "POST",
    body: new URLSearchParams({ text: result }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
  .then(res => res.text())
  .then(data => alert("엑셀시트 전송 완료!"))
  .catch(err => alert("전송 실패: " + err));
}
