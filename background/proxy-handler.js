import { data } from '../common/data-retriever.js'
import { tabUrls } from './tab-url-recorder.js'

async function main() {
    // Main proxy handler
    function handleProxyRequest(requestInfo) {
        const url = requestInfo.url;
        const documentUrl = requestInfo.documentUrl;
        const type = requestInfo.type;
        const hostname = (new URL(url)).hostname;

        const proxyInfo0 = {type: 'direct'};
        const proxyInfo1 = {type: 'socks', host: 'localhost', port: 1080, proxyDNS: true};

        // Always use direct for localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log(`DIRECT: ${url}, REASON: Hostname is localhost`);
            return proxyInfo0;
        }

        // If url in whitelist
        if (data.whitelist.has(hostname)) {
            console.log(`DIRECT: ${url}, REASON: Hostname in whitelist`);
            return proxyInfo0;
        }

        // If documentUrl is invalid
        if (!documentUrl) {
            console.log(`PROXY: ${url}, REASON: New url irrelavant to current document`);
            return proxyInfo1;
        }

        // If request is from a tab
        const tabId = requestInfo.tabId;
        if (tabId >= 0) {
            if (tabId in tabUrls) {
                const tabUrl = tabUrls[tabId];
                if (tabUrl) {
                    const tabHostname = (new URL(tabUrl)).hostname;
                    if (data.whitelist.has(tabHostname)) {
                        console.log(`DIRECT: ${url}, REASON: Tab hostname in whitelist (tabId: ${tabId}, tabUrl: ${tabUrl}, documentUrl: ${documentUrl}, type: ${type})`);
                        return proxyInfo0;
                    } else {
                        console.log(`PROXY: ${url}, REASON: Tab hostname not in whitelist (tabId: ${tabId}, tabUrl: ${tabUrl}, documentUrl: ${documentUrl}, type: ${type})`);
                        return proxyInfo1;
                    }
                } else {
                    console.log(`PROXY: ${url}, REASON: Invalid tab url (tabId: ${tabId}, tabUrl: ${tabUrl}, documentUrl: ${documentUrl}, type: ${type})`);
                    return proxyInfo1;
                }
            } else {
                console.log(`PROXY: ${url}, REASON: Tab id not recorded (tabId: ${tabId}, documentUrl: ${documentUrl}, type: ${type})`);
                return proxyInfo1;
            }
        } else {  // tabId of initial requests or DNS requests is -1
            console.log(`PROXY: ${url}, REASON: Invalid tab id (tabId: ${tabId}, documentUrl: ${documentUrl}, type: ${type})`);
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
