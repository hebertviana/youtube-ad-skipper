chrome.storage.sync.get(['skipTime'], function (result) {
    const skipTime = result.skipTime || 500;

    console.log('Skip time:', skipTime);

    function clickSkipAdButton() {
        const skipButton = document.querySelector('.ytp-ad-skip-button.ytp-button');
        const skipPremium = document.querySelector('yt-button-renderer#dismiss-button.style-scope.yt-mealbar-promo-renderer');
        const deleteCompanion = document.querySelector('div#companion.style-scope.ytd-companion-slot-renderer')
        const deletePromoted = document.querySelector('ytd-promoted-sparkles-web-renderer.style-scope.ytd-in-feed-ad-layout-renderer.sparkles-light-cta')
        const deleteAdSlot = document.querySelector('ytd-ad-slot-renderer.style-scope.ytd-rich-item-renderer')     

        if (skipButton) {
            setTimeout(() => {
                skipButton.click();
                console.log('Clicked "Skip Ad" button');
                saveMetric('adSkipped');
                clickSkipAdButton();
            }, skipTime);
        } 
        if (skipPremium) {
            setTimeout(() => {
                skipPremium.click();
                console.log('Clicked "Skip Ad" Premium');
                saveMetric('elementRemoved');
                clickSkipAdButton();
            }, skipTime);
        }
        if (deleteCompanion) {
            setTimeout(() => {
                deleteCompanion.remove();
                console.log('Delete "Delete Ad" Companion');
                saveMetric('elementRemoved');
                clickSkipAdButton();
            }, skipTime);
        }
        if (deletePromoted) {
            setTimeout(() => {
                deletePromoted.remove();
                console.log('Delete "Delete Ad" Promoted');
                saveMetric('elementRemoved');
                clickSkipAdButton();
            }, skipTime);
        }
        if (deleteAdSlot) {
            setTimeout(() => {
                deleteAdSlot.remove();
                console.log('Delete "Delete Ad" Slot');
                saveMetric('elementRemoved');
                clickSkipAdButton();
            }, skipTime);
        }
        else {
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
