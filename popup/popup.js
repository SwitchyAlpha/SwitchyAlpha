async function main() {
    // Retrieve whitelist
    const data = await browser.storage.local.get();
    let whitelist = data.whitelist ? data.whitelist : new Set();
    browser.storage.onChanged.addListener(changeData => {
        whitelist = changeData.whitelist.newValue;
    });

    // Retrieve hostname
    const tabs = await browser.tabs.query({currentWindow: true, active: true});
    if (!tabs[0].url) {
        return;
    }
    const url = new URL(tabs[0].url);
    let hostname = url.hostname;

    // Set UI
    document.getElementById('hostname').innerHTML = hostname;
    if (whitelist.has(hostname)) {
        document.getElementById('list-whitelist').checked = true;
    } else {
        document.getElementById('list-none').checked = true;
    }

    // Listen on radio change
    document.addEventListener('change', event => {
        if (event.target.type == 'radio') {
            console.log(`Radio value changed: ${event.target.value}`);
            switch (event.target.value) {
                case 'none':
                    whitelist.delete(hostname);
                    break;
                case 'whitelist':
                    whitelist.add(hostname);
                    break;
            }
            browser.storage.local.set({ whitelist });
        }
    })
}

main().catch(error => {
    console.error(`Error in popup: ${error.message}`);
});
