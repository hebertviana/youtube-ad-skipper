chrome.storage.sync.get(['skipTime'], function (result) {
    const skipTime = result.skipTime || 500;

    console.log('Skip time:', skipTime);

    function clickSkipAdButton() {
        const skipButton = document.querySelector('.ytp-ad-skip-button.ytp-button');

        if (skipButton) {
            setTimeout(() => {
                skipButton.click();
                console.log('Clicked "Skip Ad" button');
                saveMetric('adSkipped');
                clickSkipAdButton();
            }, skipTime);
        } else {
            setTimeout(() => {
                clickSkipAdButton();
                console.log('Wait 500 milisegundos');
            }, 500);
        }
    }

    function saveMetric(metric) {
        chrome.storage.local.get({ metrics: [] }, function (result) {
            const metrics = result.metrics;
            metrics.push({ metric, timestamp: new Date().toISOString() });

            chrome.storage.local.set({ metrics }, function () {
                console.log('Metric saved:', metric);
            });
        });
    }

    clickSkipAdButton();
});
