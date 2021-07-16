export let tabUrls = {}

function recordTabUrl(details) {
    console.log(`onBeforeNavigate to: ${details.url}`);
    if (details.frameId == 0 && !details.url.startsWith('about:')) {
        console.log(`Recording tabId ${details.tabId} for ${details.url}`);
        tabUrls[details.tabId] = details.url;
    }
}
browser.webNavigation.onBeforeNavigate.addListener(recordTabUrl);
