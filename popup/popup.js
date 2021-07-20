import { data } from '../common/data-retriever.js'

// Retrieve hostname
const tabs = await browser.tabs.query({currentWindow: true, active: true});
if (tabs[0].url) {
    const url = new URL(tabs[0].url);
    let hostname = url.hostname;

    // Set UI
    document.getElementById('hostname').textContent = hostname;
    if (data.whitelist.has(hostname)) {
        document.getElementById('list-whitelist').checked = true;
    } else {
        document.getElementById('list-none').checked = true;
    }

    // Listen on radio change
    document.addEventListener('change', event => {
        if (event.target.type === 'radio') {
            console.log(`Radio value changed: ${event.target.value}`);
            switch (event.target.value) {
                case 'none':
                    data.whitelist.delete(hostname);
                    break;
                case 'whitelist':
                    data.whitelist.add(hostname);
                    break;
            }
            browser.storage.local.set({ whitelist: data.whitelist });
        }
    });
}
