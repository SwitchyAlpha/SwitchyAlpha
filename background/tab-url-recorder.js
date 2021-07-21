export let tabUrls = {}

function recordTabUrl(details) {
    console.log(`onBeforeNavigate to: ${details.url}`);
    if (details.tabId >= 0 && details.frameId === 0 && details.url && !details.url.startsWith('about:')) {
        console.log(`Recording tabId ${details.tabId} for ${details.url}`);
        tabUrls[details.tabId] = details.url;
    }
}
browser.webNavigation.onBeforeNavigate.addListener(recordTabUrl);
