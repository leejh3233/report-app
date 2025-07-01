
const fields = [
    "1. 시공팀원", "2. 지역", "3. 아파트명", "4. 동 호수", "5. 연락처", "6. 평수",
    "7. 시공범위", "8. 신축여부", "9. 결제방법", "10. 색상", "11. 판매갯수",
    "12. 판매비용", "13. 미결제금액", "14. 예약금 현금영수증", "15. 특이사항"
];

window.onload = () => {
    const container = document.getElementById("form-container");
    fields.forEach((label, idx) => {
        const input = document.createElement("input");
        input.type = "text";
        input.id = `field${idx}`;
        input.placeholder = label;
        container.appendChild(input);
    });
};

function generateReport() {
    let result = "📋 시공보고서\n";
    fields.forEach((label, idx) => {
        const value = document.getElementById(`field${idx}`).value;
        result += `${label} : ${value}\n`;
    });
    document.getElementById("result").innerText = result;
}

function copyResult() {
    const resultText = document.getElementById("result").innerText;
    navigator.clipboard.writeText(resultText).then(() => alert("복사되었습니다!"));
}

function sendToSheet() {
    const resultText = document.getElementById("result").innerText;
    fetch("YOUR_DEPLOYED_URL", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "text=" + encodeURIComponent(resultText)
    }).then(res => res.text())
      .then(data => alert("엑셀 시트로 전송 완료!"))
      .catch(err => alert("전송 실패: " + err));
}
