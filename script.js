
const fields = [
    "시공팀원", "지역", "아파트명", "동 호수", "연락처", "평수", "시공범위",
    "신축여부", "결제방법", "색상", "판매갯수", "판매비용", "미결제금액", "예약금 현금영수증", "특이사항"
];

window.onload = () => {
    const container = document.getElementById("inputFields");
    fields.forEach((label, i) => {
        const input = document.createElement("input");
        input.placeholder = (i+1) + ". " + label;
        input.id = "field" + i;
        container.appendChild(input);
    });
};

function submitForm() {
    const values = fields.map((_, i) => document.getElementById("field" + i).value);
    fetch("https://script.google.com/macros/s/AKfycbxtxy3sgN6uoe5d3bckcmkq41oBryjoXul9MvvaBU6NI_hOfZdGReWtmaArDSCQS8Ba/exec", {
        method: "POST",
        body: JSON.stringify({ data: values }),
        headers: { "Content-Type": "application/json" }
    }).then(() => alert("전송 완료"));
}

function copyReport() {
    const result = fields.map((label, i) => (i+1) + ". " + label + " : " + document.getElementById("field" + i).value).join("\n");
    navigator.clipboard.writeText(result);
    document.getElementById("resultText").textContent = result;
}
