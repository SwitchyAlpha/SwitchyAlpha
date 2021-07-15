import { tabUrls } from './tab-url-recorder.js'

async function main() {
    // Retrieve whitelist
    const data = await browser.storage.local.get();
    let whitelist = data.whitelist ? data.whitelist : new Set();
    browser.storage.onChanged.addListener(changeData => {
        whitelist = changeData.whitelist.newValue;
    });

    // Main proxy handler
    function handleProxyRequest(requestInfo) {
        const url = new URL(requestInfo.url);

        const proxyInfo0 = {type: 'direct'};
        const proxyInfo1 = {type: 'socks', host: 'localhost', port: 1080, proxyDNS: true};

        // Always use direct for localhost
        if (url.hostname == 'localhost' || url.hostname == '127.0.0.1') {
            console.log(`DIRECT: ${url}, REASON: Hostname is localhost`);
            return proxyInfo0;
        }

        // If url in whitelist
        if (whitelist.has(url.hostname)) {
            console.log(`DIRECT: ${url}, REASON: Hostname in whitelist`);
            return proxyInfo0;
        }

        // If request is from a tab
        const tabId = requestInfo.tabId;
        const documentUrl = requestInfo.documentUrl;
        if (tabId >= 0) {
            if (tabId in tabUrls) {
                const tabUrl = tabUrls[tabId];
                if (tabUrl) {
                    const tabHostname = (new URL(tabUrl)).hostname;
                    if (whitelist.has(tabHostname)) {
                        console.log(`DIRECT: ${url}, REASON: Tab hostname in whitelist (tabId: ${tabId}, tabUrl: ${tabUrl}, documentUrl: ${documentUrl})`);
                        return proxyInfo0;
                    } else {
                        console.log(`PROXY: ${url}, REASON: Tab hostname not in whitelist (tabId: ${tabId}, tabUrl: ${tabUrl}, documentUrl: ${documentUrl})`);
                        return proxyInfo1;
                    }
                } else {
                    console.log(`PROXY: ${url}, REASON: Invalid tab url (tabId: ${tabId}, tabUrl: ${tabUrl}, documentUrl: ${documentUrl})`);
                    return proxyInfo1;
                }
            } else {
                console.log(`PROXY: ${url}, REASON: Tab id not recorded (tabId: ${tabId}, documentUrl: ${documentUrl})`);
                return proxyInfo1;
            }
        } else {  // tabId of initial requests or DNS requests is -1
            console.log(`PROXY: ${url}, REASON: Invalid tab id (tabId: ${tabId}, documentUrl: ${documentUrl})`);
            return proxyInfo1;
        }
    }

    // Listen on all requests
    browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ['<all_urls>']});
    browser.proxy.onError.addListener(error => {
        console.error(`Error in proxy handler: ${error.message}`);
    });
}

main().catch(error => {
    console.error(`Error in background: ${error.message}`);
});
