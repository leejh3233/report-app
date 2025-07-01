
function showResult() {
    const form = document.getElementById('reportForm');
    const data = new FormData(form);
    let result = '📋 시공보고서\n';
    let i = 1;
    for (let [key, value] of data.entries()) {
        if (value.trim() !== '') {
            result += i + '. ' + form[key].previousSibling.textContent.trim() + ' : ' + value + '\n';
        }
        i++;
    }
    document.getElementById('resultBox').innerText = result.trim();
}

function copyResult() {
    const text = document.getElementById('resultBox').innerText;
    navigator.clipboard.writeText(text).then(() => alert('복사되었습니다.'));
}

function sendToSheet() {
    const text = document.getElementById('resultBox').innerText;
    fetch("YOUR_DEPLOYED_URL", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "text=" + encodeURIComponent(text)
    })
    .then(res => res.text())
    .then(data => alert("엑셀시트 전송 완료"))
    .catch(err => alert("전송 실패: " + err));
}
