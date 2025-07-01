
function generateResult() {
  const form = document.getElementById('report-form');
  let result = "📋 시공보고서\n";
  let count = 1;
  Array.from(form.elements).forEach((el) => {
    if (el.name && el.value) {
      result += `${count}. ${el.name} : ${el.value}\n`;
      count++;
    }
  });
  document.getElementById('result').textContent = result.trim();
}

function copyResult() {
  const resultText = document.getElementById('result').textContent;
  navigator.clipboard.writeText(resultText).then(() => {
    alert("복사 완료!");
  });
}

function sendToSheet() {
  const resultText = document.getElementById('result').textContent;
  fetch("YOUR_DEPLOYED_URL", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "text=" + encodeURIComponent(resultText)
  })
  .then(res => res.text())
  .then(res => {
    alert("엑셀시트 전송 완료!");
  });
}
