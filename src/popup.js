chrome.storage.local.get({ metrics: [] }, function (result) {
    const metrics = result.metrics;

    const metricsByDay = {};
    const adSkipErrorByDay = {};
    const elementRemoveErrorByDay = {};
    const elementRemovedByDay = {}; // Adicionar nova estrutura para elementRemoved

    metrics.forEach(metricObj => {
        const date = new Date(metricObj.timestamp).toLocaleDateString();
        if (metricObj.metric === 'adSkipped') {
            if (!metricsByDay[date]) {
                metricsByDay[date] = 0;
            }
            metricsByDay[date]++;
        } else if (metricObj.metric === 'adSkipError') {
            if (!adSkipErrorByDay[date]) {
                adSkipErrorByDay[date] = 0;
            }
            adSkipErrorByDay[date]++;
        } else if (metricObj.metric === 'elementRemoveError') {
            if (!elementRemoveErrorByDay[date]) {
                elementRemoveErrorByDay[date] = 0;
            }
            elementRemoveErrorByDay[date]++;
        } else if (metricObj.metric === 'elementRemoved') {
            if (!elementRemovedByDay[date]) {
                elementRemovedByDay[date] = 0;
            }
            elementRemovedByDay[date]++;
        }
    });

    const ctx = document.getElementById('metricChart').getContext('2d');

    const chartData = {
        labels: Object.keys(metricsByDay),
        datasets: [
            {
                label: 'Skip ADs',
                data: Object.values(metricsByDay),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Skip Errors',
                data: Object.values(adSkipErrorByDay),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Remove Element Errors',
                data: Object.values(elementRemoveErrorByDay),
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 1
            },
            {
                label: 'Elements Removed',
                data: Object.values(elementRemovedByDay),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
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
