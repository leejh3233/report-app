"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [partners, setPartners] = useState<string[]>([]);
  const [form, setForm] = useState({
    시공일자: new Date().toISOString().slice(0, 10),
    추천인: "",
    시공팀원: "",
    지역: "",
    아파트명: "",
    동호수: "",
    연락처: "",
    평수: "",
    신축여부: "",
    결제방법: "",
    색상: "모던",
    판매갯수: "",
    판매비용: "",
    미결제금액: "",
    예약금현금영수증: "",
    특이사항: "",
  });

  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const scopes = ["거실", "복도", "주방", "아일랜드", "아이방", "안방", "알파룸", "방1", "방2", "집전체", "기타"];

  useEffect(() => {
    // 파트너 목록 가져오기
    fetch("https://dolbomconnect.vercel.app/api/partners/list")
      .then(res => res.json())
      .then(data => {
        if (data.partners) setPartners(data.partners);
      })
      .catch(err => console.error("명단 로드 실패:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleScopeChange = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const generateResult = () => {
    const scopeString = selectedScopes.join(", ");
    return `📋 시공보고서
1. 시공일자 : ${form.시공일자}
2. 추천인 : ${form.추천인}
3. 시공팀원 : ${form.시공팀원}
4. 지역 : ${form.지역}
5. 아파트명 : ${form.아파트명}
6. 동호수 : ${form.동호수}
7. 연락처 : ${form.연락처}
8. 평수 : ${form.평수}
9. 시공범위 : ${scopeString}
10. 신축여부 : ${form.신축여부}
11. 결제방법 : ${form.결제방법}
12. 색상 : ${form.색상}
13. 판매갯수 : ${form.판매갯수}
14. 판매비용 : ${form.판매비용}
15. 미결제금액 : ${form.미결제금액}
16. 예약금 현금영수증 : ${form.예약금현금영수증}
17. 특이사항 : ${form.특이사항}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateResult());
    alert("복사 완료!");
  };

  const handleSend = async () => {
    // 추천인 유효성 체크
    if (form.추천인 && partners.length > 0 && !partners.includes(form.추천인)) {
      if (!confirm("알림: 추천인 이름이 명단에 없습니다. 오타일 경우 인센티브 정산이 누락될 수 있습니다. 그래도 전송하시겠습니까?")) {
        return;
      }
    }

    const finalData = {
      ...form,
      시공범위: selectedScopes.join(", ")
    };

    // 1. 엑셀 시트 전송 (Apps Script) - 사용자님께서 주신 최신 주소로 업데이트
    const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzITllVlYaPqmfoT7eVPd1nSDl31uiaQFO9VFILQeBo_swAUNScMOKM_F_c9iz7TbKI/exec";

    try {
      // mode: 'no-cors' for Apps Script
      fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(finalData),
        headers: { "Content-Type": "application/json" },
      });

      // 2. 인센티브 시트 연동 (dolbomconnect)
      let syncMsg = "";
      if (form.추천인) {
        try {
          // 판매비용에서 콤마(,) 제거 (숫자만 추출)
          const cleanSaleAmount = form.판매비용.toString().replace(/,/g, '');

          const syncRes = await fetch("https://dolbomconnect.vercel.app/api/sync/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recommender: form.추천인,
              saleAmount: cleanSaleAmount
            })
          });
          const syncData = await syncRes.json();
          if (syncData.success) {
            syncMsg = "\n✅ 인센티브 시트 연동 성공! (정산 목록 업데이트 완료)";
          } else {
            syncMsg = "\n⚠️ 인센티브 연동 실패: " + (syncData.error === "No matching recommender found in Leads sheet" ? "해당 추천인의 상담 내역을 찾을 수 없습니다." : syncData.error);
          }
        } catch (e) {
          syncMsg = "\n⚠️ 인센티브 연동 서버 오류 (주소 설정을 확인해주세요)";
        }
      }

      alert("시공보고서 전송이 완료되었습니다!" + syncMsg);
    } catch (e) {
      alert("전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto bg-white shadow-lg rounded-xl my-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">시공보고서 작성</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">1. 시공일자</label>
          <input type="date" name="시공일자" value={form.시공일자} onChange={handleChange} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition-all" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">2. 추천인 (검색)</label>
          <input type="text" name="추천인" value={form.추천인} onChange={handleChange} list="partner-list" placeholder="추천인 이름을 입력하세요" className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition-all" />
          <datalist id="partner-list">
            {partners.map(p => <option key={p} value={p} />)}
          </datalist>
        </div>

        {[
          { label: "3. 시공팀원", name: "시공팀원" },
          { label: "4. 지역", name: "지역" },
          { label: "5. 아파트명", name: "아파트명" },
          { label: "6. 동호수", name: "동호수" },
          { label: "7. 연락처", name: "연락처" },
          { label: "8. 평수", name: "평수" }
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
            <input type="text" name={field.name} value={(form as any)[field.name]} onChange={handleChange} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition-all" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">9. 시공범위 (다중 선택)</label>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            {scopes.map(scope => (
              <button
                key={scope}
                onClick={() => handleScopeChange(scope)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedScopes.includes(scope)
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {[
          { label: "10. 신축여부", name: "신축여부" },
          { label: "11. 결제방법", name: "결제방법" }
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
            <input type="text" name={field.name} value={(form as any)[field.name]} onChange={handleChange} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition-all" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">12. 색상</label>
          <select name="색상" value={form.색상} onChange={handleChange} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition-all bg-white">
            <option value="모던">모던</option>
            <option value="마블">마블</option>
            <option value="코튼베이지">코튼베이지</option>
            <option value="우드">우드</option>
          </select>
        </div>

        {[
          { label: "13. 판매갯수", name: "판매갯수" },
          { label: "14. 판매비용", name: "판매비용" },
          { label: "15. 미결제금액", name: "미결제금액" },
          { label: "16. 예약금 현금영수증", name: "예약금현금영수증" },
          { label: "17. 특이사항", name: "특이사항" }
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
            <input type="text" name={field.name} value={(form as any)[field.name]} onChange={handleChange} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition-all" />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={handleCopy} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-700 transition-colors shadow-lg active:scale-95">결과 복사하기</button>
        <button onClick={handleSend} className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg active:scale-95">엑셀 시트 전송</button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
        <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">미리보기</h2>
        <div className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">
          {generateResult()}
        </div>
      </div>
    </main>
  );
}
