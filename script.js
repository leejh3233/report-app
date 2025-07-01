
function generateReport() {
  const form = document.getElementById("reportForm");
  const data = new FormData(form);
  const labels = [
    "시공일자", "시공팀원", "지역", "아파트명", "동호수", "연락처",
    "평수", "시공범위", "신축여부", "결제방법", "색상",
    "판매갯수", "판매비용", "미결제금액", "예약금현금영수증", "특이사항"
  ];
  let text = "📋 시공보고서\n";
  labels.forEach((label, i) => {
    text += `${i + 1}. ${label} : ${data.get(label)}\n`;
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
  for (let [key, value] of data.entries()) {
    obj[key] = value;
  }

  fetch("https://script.google.com/macros/s/AKfycbzITllVlYaPqmfoT7eVPd1nSDl31uiaQFO9VFILQeBo_swAUNScMOKM_F_c9iz7TbKI/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  });
  alert("엑셀 시트로 전송되었습니다.");
}
