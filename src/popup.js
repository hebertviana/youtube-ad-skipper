chrome.storage.local.get({ metrics: [] }, function (result) {
    const metrics = result.metrics;

    // Crie objetos para armazenar métricas por tipo
    const metricsByType = {
        adSkipped: {},
        adSkipError: {},
        elementRemoveError: {},
        elementRemoved: {}
    };

    // Organize as métricas por dia e tipo
    metrics.forEach(metricObj => {
        const date = new Date(metricObj.timestamp).toLocaleDateString();

        if (!metricsByType[metricObj.metric][date]) {
            metricsByType[metricObj.metric][date] = 0;
        }
        metricsByType[metricObj.metric][date]++;
    });

    // Obtenha todas as datas únicas
    const uniqueDates = new Set(
        Object.keys(metricsByType.adSkipped)
            .concat(Object.keys(metricsByType.adSkipError))
            .concat(Object.keys(metricsByType.elementRemoveError))
            .concat(Object.keys(metricsByType.elementRemoved))
    );

    // Ordene as datas
    const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b));

    // Crie objetos organizados por tipo e data
    const organizedMetrics = {};
    Object.keys(metricsByType).forEach(metricType => {
        organizedMetrics[metricType] = {};
        sortedDates.forEach(date => {
            organizedMetrics[metricType][date] = metricsByType[metricType][date] || 0;
        });
    });

    const ctx = document.getElementById('metricChart').getContext('2d');

    const chartData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Skip ADs',
                data: Object.values(organizedMetrics.adSkipped),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Elements Removed',
                data: Object.values(organizedMetrics.elementRemoved),
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
