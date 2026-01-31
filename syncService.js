
async function fetchPartners() {
    try {
        // 백엔드 주소 (Vercel 환경 변수가 없으므로 하드코딩 또는 현재 도메인 기반 처리 필요)
        const backendUrl = "https://dolbomconnect.vercel.app";
        const response = await fetch(`${backendUrl}/api/leads?type=partners`);
        if (!response.ok) throw new Error('명단을 가져오지 못했습니다.');
        const data = await response.json();
        if (data.partners && data.partners.length > 0) {
            const datalist = document.getElementById('recommenderList');
            datalist.innerHTML = '';
            data.partners.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                datalist.appendChild(option);
            });
            console.log('추천인 명단 로드 완료:', data.partners.length, '명');
        } else {
            console.warn('추천인 명단이 비어 있습니다.');
        }
    } catch (error) {
        console.error('Failed to fetch partners:', error);
        alert(`알림: 추천인 명단을 불러오지 못했습니다.\n연결 시도: https://dolbomconnect.vercel.app/api/leads?type=partners\n오류: ${error.message}`);
    }
}

async function syncToIncentiveSheet(reportData) {
    try {
        const backendUrl = "https://dolbomconnect.vercel.app";
        const response = await fetch(`${backendUrl}/api/sync/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recommender: reportData.추천인,
                saleAmount: reportData.판매비용,
                aptName: reportData.아파트명
            })
        });
        const result = await response.json();
        console.log('Sync result:', result);
        return result;
    } catch (error) {
        console.error('Failed to sync to incentive sheet:', error);
        return { error: error.message };
    }
}

// Export functions if needed, or just make them global for script.js
window.syncService = {
    fetchPartners,
    syncToIncentiveSheet
};
