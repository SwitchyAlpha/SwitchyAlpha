export let tabUrls = {}

function recordTabUrl(details) {
    console.log(`onBeforeNavigate to: ${details.url}`);
    tabUrls[details.tabId] = details.url;
}
browser.webNavigation.onBeforeNavigate.addListener(recordTabUrl);
