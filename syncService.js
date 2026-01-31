
async function fetchPartners() {
    try {
        const response = await fetch('https://dolbomconnect.vercel.app/api/partners/list');
        const data = await response.json();
        if (data.partners) {
            const datalist = document.getElementById('recommenderList');
            datalist.innerHTML = '';
            data.partners.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                datalist.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to fetch partners:', error);
    }
}

async function syncToIncentiveSheet(reportData) {
    try {
        const response = await fetch('https://dolbomconnect.vercel.app/api/sync/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recommender: reportData.추천인,
                saleAmount: reportData.판매비용
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
