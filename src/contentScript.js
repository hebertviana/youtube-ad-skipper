chrome.storage.sync.get(['skipTime'], function (result) {
    const skipTime = result.skipTime || 500;

    console.log('Skip time:', skipTime);

    function clickSkipAdButton() {
        try {
            const skipButton = document.querySelector('.ytp-ad-skip-button.ytp-button');

            if (skipButton) {
                skipButton.click();
                console.log('Clicked "Skip Ad" button');
                saveMetric('adSkipped');
            }
        } catch (error) {
            console.error('Error clicking "Skip Ad" button:', error);
            saveMetric('adSkipError');
        }
    }

    function saveMetric(metric) {
        chrome.storage.local.get({ metrics: [] }, function (result) {
            try {
                const metrics = result.metrics;
                metrics.push({ metric, timestamp: new Date().toISOString() });

                chrome.storage.local.set({ metrics }, function () {
                    console.log('Metric saved:', metric);
                });
            } catch (error) {
                console.error('Error saving metric:', error);
            }
        });
    }

    const observer = new MutationObserver(function (mutationsList) {
        try {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    clickSkipAdButton();
                }
            }
        } catch (error) {
            console.error('MutationObserver error:', error);
        }
    });

    const videoPlayer = document.querySelector('.html5-video-player');
    if (videoPlayer) {
        try {
            observer.observe(videoPlayer, { childList: true, subtree: true });
        } catch (error) {
            console.error('Error starting MutationObserver:', error);
        }
    }
});
