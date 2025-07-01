
"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    시공팀원: "",
    지역: "",
    아파트명: "",
    동호수: "",
    연락처: "",
    평수: "",
    시공범위: "",
    신축여부: "",
    결제방법: "",
    색상: "모던",
    판매갯수: "",
    판매비용: "",
    미결제금액: "",
    예약금현금영수증: "",
    특이사항: "",
  });

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const generateResult = () => {
    return `📋 시공보고서
1. 시공일자 : ${today}
2. 시공팀원 : ${form.시공팀원}
3. 지역 : ${form.지역}
4. 아파트명 : ${form.아파트명}
5. 동 호수 : ${form.동호수}
6. 연락처 : ${form.연락처}
7. 평수 : ${form.평수}
8. 시공범위 : ${form.시공범위}
9. 신축여부 : ${form.신축여부}
10. 결제방법 : ${form.결제방법}
11. 색상 : ${form.색상}
12. 판매갯수 : ${form.판매갯수}
13. 판매비용 : ${form.판매비용}
14. 미결제금액 : ${form.미결제금액}
15. 예약금 현금영수증 : ${form.예약금현금영수증}
16. 특이사항 : ${form.특이사항}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateResult());
    alert("복사 완료!");
  };

  const handleSend = async () => {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxtxy3sgN6uoe5d3bckcmkq41oBryjoXul9MvvaBU6NI_hOfZdGReWtmaArDSCQS8Ba/exec", {
      method: "POST",
      body: JSON.stringify({ ...form, 날짜: today }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      alert("시트 전송 완료!");
    } else {
      alert("전송 실패!");
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">시공보고서 작성</h1>
      {Object.entries(form).map(([key, value]) => (
        <div key={key} className="mb-2">
          <label className="block text-sm font-medium mb-1">{key}</label>
          {key === "색상" ? (
            <select name={key} value={value} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="모던">모던</option>
              <option value="마블">마블</option>
              <option value="우드">우드</option>
            </select>
          ) : (
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          )}
        </div>
      ))}
      <div className="flex gap-2 mt-4">
        <button onClick={handleCopy} className="bg-blue-500 text-white px-4 py-2 rounded">복사하기</button>
        <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded">엑셀 시트 전송</button>
      </div>
      <div className="mt-4 whitespace-pre-wrap border p-3 bg-gray-50 rounded">
        {generateResult()}
      </div>
    </main>
  );
}
