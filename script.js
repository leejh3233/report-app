
function showResult() {
  const input = document.getElementById("input").value.split("\n");
  const formatted = input.map((line, i) => `${i + 1}. ${line}`).join("\n");
  document.getElementById("output").textContent = formatted;
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
