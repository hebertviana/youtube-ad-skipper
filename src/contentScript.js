chrome.storage.sync.get(['skipTime'], function (result) {
    const skipTime = result.skipTime || 500; // Default value is 3500 ms

    console.log('Skip time:', skipTime); // Registra o valor do tempo de espera

    // Função para clicar no botão de "skip ad"
    function clickSkipAdButton() {
        const skipButton = document.querySelector('.ytp-ad-skip-button.ytp-button');

        if (skipButton) {
            setTimeout(() => {
                skipButton.click();
                console.log('Clicked "Skip Ad" button'); // Registra o clique no botão
                saveMetric('adSkipped'); // Armazena a métrica
                clickSkipAdButton(); // Chama a função novamente para continuar procurando
            }, skipTime); // Usa o valor de skipTime como tempo de espera
        } else {
            // Se o botão não for encontrado, continuar procurando após um pequeno intervalo
            setTimeout(() => {
                clickSkipAdButton();
                console.log('Wait 500 milisegundos'); // Registra o clique no botão
            }, 500); // Espera 500 milisegundos antes de procurar novamente
        }
    }


    // Função para armazenar métrica
    function saveMetric(metric) {
        chrome.storage.local.get({ metrics: [] }, function (result) {
            const metrics = result.metrics;
            metrics.push({ metric, timestamp: new Date().toISOString() });

            chrome.storage.local.set({ metrics }, function () {
                console.log('Metric saved:', metric);
            });
        });
    }

    // Inicia o processo de busca e clique
    clickSkipAdButton();
});
