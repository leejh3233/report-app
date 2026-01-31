
document.addEventListener('DOMContentLoaded', () => {
  // 1. 항목 1 (날짜): 자동으로 오늘 날짜 설정
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('施工日');
  if (dateInput) {
    dateInput.value = today;
  }

  // 추천인 목록 로드
  if (window.syncService && window.syncService.fetchPartners) {
    window.syncService.fetchPartners();
  }
});

function getFormData() {
  const form = document.getElementById("reportForm");
  const formData = new FormData(form);
  const obj = {};

  // 폼 항목 정의 (순서 및 레이블)
  const labels = [
    "시공일자", "추천인", "시공팀원", "지역", "아파트명", "동호수", "연락처",
    "평수", "시공범위", "신축여부", "결제방법", "색상",
    "판매갯수", "판매비용", "미결제금액", "예약금현금영수증", "특이사항"
  ];

  labels.forEach(label => {
    if (label === "시공범위") {
      // 항목 3 (시공범위): 다중 선택 값을 쉼표로 구분한 문자열로 변환
      const checkedScopes = Array.from(document.querySelectorAll('input[name="시공범위"]:checked'))
        .map(cb => cb.value);
      obj[label] = checkedScopes.join(", ");
    } else {
      obj[label] = formData.get(label) || "";
    }
  });

  return { obj, labels };
}

function generateReport() {
  const { obj, labels } = getFormData();
  let text = "📋 시공보고서\n";
  labels.forEach((label, i) => {
    text += `${i + 1}. ${label} : ${obj[label]}\n`;
  });
  document.getElementById("result").innerText = text;
}

function copyResult() {
  const result = document.getElementById("result").innerText;
  if (!result) {
    alert("먼저 '결과 보기' 버튼을 눌러주세요.");
    return;
  }
  navigator.clipboard.writeText(result).then(() => alert("복사되었습니다."));
}

async function sendToSheet() {
  const { obj } = getFormData();

  // 1. 추천인 유효성 체크 (로드가 된 경우에만 명단 확인, 틀려도 전송은 가능하게 안내)
  const datalist = document.getElementById('recommenderList');
  const validOptions = Array.from(datalist.options).map(opt => opt.value);
  if (obj.추천인 && validOptions.length > 0 && !validOptions.includes(obj.추천인)) {
    if (!confirm("알림: 추천인 이름이 명단에 없습니다. 오타일 경우 인센티브 정산이 누락될 수 있습니다. 그래도 전송하시겠습니까?")) {
      return;
    }
  }

  // 2. [필환] 시공 보고서 엑셀 전송 (이것은 항상 실행됨)
  const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzITllVlYaPqmfoT7eVPd1nSDl31uiaQFO9VFILQeBo_swAUNScMOKM_F_c9iz7TbKI/exec";

  try {
    // 엑셀 시트 전송 시도
    fetch(appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    });

    // 3. [선택] 인센티브 시트(dolbomconnect) 업데이트
    let syncStatusMsg = "";
    if (obj.추천인 && window.syncService && window.syncService.syncToIncentiveSheet) {
      const syncResult = await window.syncService.syncToIncentiveSheet(obj);
      if (syncResult && syncResult.error) {
        console.warn("인센티브 동기화 실패:", syncResult.error);
        syncStatusMsg = "\n\n⚠️ 인센티브 시트 연동 실패: " + (syncResult.error === "Recommender name is required" ? "추천인을 입력해주세요." : "명단에 없는 추천인이거나 일치하는 데이터가 없습니다.");
      } else {
        syncStatusMsg = "\n\n✅ 인센티브 시트 연동 성공!";
      }
    }

    alert("보고서 전송이 완료되었습니다." + syncStatusMsg);
  } catch (error) {
    console.error("전송 오류:", error);
    alert("전송 중 오류가 발생했습니다. (엑셀 시트 확인 필요)");
  }
}
