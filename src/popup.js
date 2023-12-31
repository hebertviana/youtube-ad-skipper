chrome.storage.local.get({ metrics: [] }, function (result) {
    const metrics = result.metrics;

    // Create objects to store metrics by type
    const metricsByType = {
        adSkipped: {},
        adSkipError: {},
        elementRemoveError: {},
        elementRemoved: {}
    };

    // Organize metrics by day and type
    metrics.forEach(metricObj => {
        const date = new Date(metricObj.timestamp).toLocaleDateString();

        if (!metricsByType[metricObj.metric][date]) {
            metricsByType[metricObj.metric][date] = 0;
        }
        metricsByType[metricObj.metric][date]++;
    });

    // Get all unique dates
    const uniqueDates = new Set(
        Object.keys(metricsByType.adSkipped)
            .concat(Object.keys(metricsByType.adSkipError))
            .concat(Object.keys(metricsByType.elementRemoveError))
            .concat(Object.keys(metricsByType.elementRemoved))
    );

    // Order the dates
    const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b));

    // Create objects organized by type and date
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

document.addEventListener('DOMContentLoaded', function() {
    const extensionVersion = chrome.runtime.getManifest().version;
    const currentVersionElement = document.getElementById('currentVersion');
    const newVersionElement = document.getElementById('newVersion');

    // Display current version
    currentVersionElement.textContent = extensionVersion;

    // Fetch version information
    fetch('https://raw.githubusercontent.com/hebertviana/youtube-ad-skipper/main/version.json')
        .then(response => response.json())
        .then(data => {
            // Check if a new version is available
            if (data.version !== extensionVersion) {
                newVersionElement.textContent = data.version;

                // Set the download URL for the new version
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = data.download_url;
            }
        })
        .catch(error => {
            console.error('Error fetching version information:', error);
        });

});
