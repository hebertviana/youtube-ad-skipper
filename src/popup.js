document.addEventListener('DOMContentLoaded', function () {
    const skipTimeInput = document.getElementById('skipTime');
    const saveButton = document.getElementById('saveButton');

    const metricsList = document.getElementById('metricsList');
    const metricChart = document.getElementById('metricChart');
    const ctx = metricChart.getContext('2d');

    saveButton.addEventListener('click', function () {
        const skipTime = parseInt(skipTimeInput.value);
        chrome.storage.sync.set({ skipTime }, function () {
            alert('Settings saved.');
        });
    });

    chrome.storage.local.get({ metrics: [] }, function (result) {
        const metrics = result.metrics;

        const metricsByDay = {};

        metrics.forEach(metricObj => {
            const date = new Date(metricObj.timestamp).toLocaleDateString();
            if (!metricsByDay[date]) {
                metricsByDay[date] = 0;
            }
            metricsByDay[date]++;
        });

        const chartData = {
            labels: Object.keys(metricsByDay),
            datasets: [{
                label: 'Metricas por Dia',
                data: Object.values(metricsByDay),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const chartConfig = {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            }
        };

        new Chart(ctx, chartConfig);
    });
});
