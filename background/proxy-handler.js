async function main() {
    // Retrieve whitelist
    const data = await browser.storage.local.get();
    let whitelist = data.whitelist ? data.whitelist : new Set();
    browser.storage.onChanged.addListener(changeData => {
        whitelist = changeData.whitelist.newValue;
    });

    // Main proxy handler
    function handleProxyRequest(requestInfo) {
        function urlInWhitelist(url_str) {
            const url = new URL(url_str);
            return whitelist.has(url.hostname);
        }

        const proxy_info_0 = {type: 'direct'};
        const proxy_info_1 = {type: 'socks', host: 'localhost', port: 1080};

        // If url in whitelist
        if (requestInfo.url && urlInWhitelist(requestInfo.url)) {
            return proxy_info_0;
        }

        // If request is from a tab
        if (requestInfo.tabId >= 0) {
            return browser.tabs.get(requestInfo.tabId).then(tab => {
                if (tab.url && urlInWhitelist(tab.url)) {
                    return proxy_info_0;
                }
                //console.log(`Using direct for ${requestInfo.url} because hostname of tab.url (${tab.url}) is in whitelist`);
                return proxy_info_1;
            });
        } else {  // tabId of initial requests or DNS requests is -1
            //console.log(`Using proxy for ${requestInfo.url} because its hostname is not in whitelist and it does not belong to a tab`);
            return proxy_info_1;
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
