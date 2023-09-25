chrome.storage.local.get({ metrics: [] }, function (result) {
    const metrics = result.metrics;

    const metricsByDay = {};
    const adSkipErrorByDay = {};
    const elementRemoveErrorByDay = {};
    const elementRemovedByDay = {};

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

    const uniqueDates = new Set([
        ...Object.keys(metricsByDay),
        ...Object.keys(adSkipErrorByDay),
        ...Object.keys(elementRemoveErrorByDay),
        ...Object.keys(elementRemovedByDay)
    ]);

    const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b));

    const sortedMetricsByDay = {};
    const sortedAdSkipErrorByDay = {};
    const sortedElementRemoveErrorByDay = {};
    const sortedElementRemovedByDay = {};

    sortedDates.forEach(date => {
        sortedMetricsByDay[date] = metricsByDay[date] || 0;
        sortedAdSkipErrorByDay[date] = adSkipErrorByDay[date] || 0;
        sortedElementRemoveErrorByDay[date] = elementRemoveErrorByDay[date] || 0;
        sortedElementRemovedByDay[date] = elementRemovedByDay[date] || 0;
    });

    const ctx = document.getElementById('metricChart').getContext('2d');

    const chartData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Skip ADs',
                data: Object.values(sortedMetricsByDay),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Elements Removed',
                data: Object.values(sortedElementRemovedByDay),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
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
