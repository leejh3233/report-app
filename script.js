
function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0].replace(/-/g, '');
}

function generateReport() {
  const form = document.getElementById("reportForm");
  const data = new FormData(form);
  const labels = [
    "시공일자", "시공팀원", "지역", "아파트명", "동 호수", "연락처",
    "평수", "시공범위", "신축여부", "결제방법", "색상",
    "판매갯수", "판매비용", "미결제금액", "예약금 현금영수증", "특이사항"
  ];
  let text = "📋 시공보고서\n";
  text += `1. 시공일자 : ${getToday()}\n`;
  labels.slice(1).forEach((label, i) => {
    text += `${i + 2}. ${label} : ${data.get(label)}\n`;
  });
  document.getElementById("result").innerText = text;
}

function copyResult() {
  const result = document.getElementById("result").innerText;
  navigator.clipboard.writeText(result).then(() => alert("복사되었습니다."));
}

function sendToSheet() {
  const form = document.getElementById("reportForm");
  const data = new FormData(form);
  const obj = {};
  obj["시공일자"] = getToday();
  for (let [key, value] of data.entries()) {
    obj[key] = value;
  }

  fetch("YOUR_SCRIPT_WEBAPP_URL", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  });
  alert("엑셀 시트로 전송되었습니다.");
}
