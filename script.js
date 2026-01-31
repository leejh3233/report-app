
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

  // 추천인 유효성 검사 (목록이 로드된 경우에만 목록 내 이름인지 확인)
  const datalist = document.getElementById('recommenderList');
  const validOptions = Array.from(datalist.options).map(opt => opt.value);
  if (obj.추천인 && validOptions.length > 0 && !validOptions.includes(obj.추천인)) {
    alert("알림: 추천인 이름이 정확하지 않습니다. 목록에서 선택해 주세요.");
    return;
  }

  // 1. 기존 데이터 구조 (B~P) 유지 + Q열에 추천인 저장
  // 이 부분은 Apps Script backend (Code.gs)에서 처리해야 함. 
  // 프론트엔드에서는 전체 obj를 보냄.
  const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzITllVlYaPqmfoT7eVPd1nSDl31uiaQFO9VFILQeBo_swAUNScMOKM_F_c9iz7TbKI/exec";

  try {
    fetch(appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    });

    // 2. 인센티브 시트(dolbomconnect) 업데이트 (추천인이 있는 경우에만 실행)
    if (obj.추천인 && window.syncService && window.syncService.syncToIncentiveSheet) {
      const syncResult = await window.syncService.syncToIncentiveSheet(obj);
      if (syncResult && syncResult.error) {
        console.warn("인센티브 시트 업데이트 실패:", syncResult.error);
        alert("알림: 시공 보고서는 전송되었으나, 인센티브 시트 업데이트에 실패했습니다. (추천인 정보 불일치 등)");
        return; // 앱 시트 전송은 이미 되었으므로 여기서 멈춤
      }
    }

    alert("엑셀 시트로 전송 및 인센티브 업데이트가 완료되었습니다.");
  } catch (error) {
    console.error("전송 오류:", error);
    alert("전송 중 오류가 발생했습니다.");
  }
}
