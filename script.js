
const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

function showResult() {
  const input = document.getElementById("inputFields").value;
  document.getElementById("resultContainer").innerText = input;
}

function copyToClipboard() {
  const result = document.getElementById("resultContainer").innerText;
  navigator.clipboard.writeText(result).then(() => {
    alert("복사 완료!");
  });
}

function sendToSheet() {
  const lines = document.getElementById("inputFields").value.split("\n");
  const data = {
    시공팀원: lines[0]?.split(". ")[1] || "",
    지역: lines[1]?.split(". ")[1] || "",
    아파트명: lines[2]?.split(". ")[1] || "",
    동호수: lines[3]?.split(". ")[1] || "",
    연락처: lines[4]?.split(". ")[1] || "",
    평수: lines[5]?.split(". ")[1] || "",
    시공범위: lines[6]?.split(". ")[1] || "",
    신축여부: lines[7]?.split(". ")[1] || "",
    결제방법: lines[8]?.split(". ")[1] || "",
    색상: lines[9]?.split(". ")[1] || "",
    판매갯수: lines[10]?.split(". ")[1] || "",
    판매비용: lines[11]?.split(". ")[1] || "",
    미결제금액: lines[12]?.split(". ")[1] || "",
    예약금현금영수증: lines[13]?.split(". ")[1] || "",
    특이사항: lines[14]?.split(". ")[1] || ""
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
  .then(res => res.json())
  .then(response => alert("전송 완료!"))
  .catch(error => alert("전송 실패: " + error.message));
}
