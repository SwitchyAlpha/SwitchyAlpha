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
        const hostname = url.hostname;

        const proxyInfo0 = {type: 'direct'};
        const proxyInfo1 = {type: 'socks', host: 'localhost', port: 1080, proxyDNS: true};

        // Always use direct for localhost
        if (hostname == 'localhost' || hostname == '127.0.0.1') {
            console.log(`Using direct for ${url} because hostname is localhost`);
            return proxyInfo0;
        }

        // If url in whitelist
        if (whitelist.has(hostname)) {
            console.log(`Using direct for ${url} because hostname (${hostname}) is in whitelist`);
            return proxyInfo0;
        }

        // If request is from a tab
        const tabId = requestInfo.tabId;
        if (tabId >= 0) {
            if (tabId in tabUrls) {
                const tabUrl = tabUrls[tabId];
                if (tabUrl) {
                    const tabHostname = (new URL(tabUrl)).hostname;
                    if (whitelist.has(tabHostname)) {
                        console.log(`Using direct for ${url} because tabHostname (${tabHostname}) is in whitelist`);
                        return proxyInfo0;
                    } else {
                        console.log(`Using proxy for ${url} because tabHostname (${tabHostname}, tabUrl: ${tabUrl}) is not in whitelist`);
                        return proxyInfo1;
                    }
                } else {
                    console.log(`Using proxy for ${url} because tabUrl is invalid (${tabUrl}, tabId: ${tabId})`);
                    return proxyInfo1;
                }
            } else {
                console.log(`Using proxy for ${url} because tabId (${tabId}) is not in tabUrls`);
                return proxyInfo1;
            }
        } else {  // tabId of initial requests or DNS requests is -1
            console.log(`Using proxy for ${url} because tabId is ${requestInfo.tabId}`);
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
