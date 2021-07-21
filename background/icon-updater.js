import { getIconCanvas } from './icon-generator.js';
import { data } from '../common/data-retriever.js'
import { tabUrls } from './tab-url-recorder.js'

async function updateIcon(tabId) {
    // Get connection type for active tab
    let conn;
    if (tabId in tabUrls) {
        const tabUrl = tabUrls[tabId];
        const tabHostname = (new URL(tabUrl)).hostname;
        if (data.whitelist.has(tabHostname)) {
            conn = 'direct';
        } else {
            conn = 'default';
        }
    }

    // Set color
    let colorLeft = 'rgba(200, 200, 200)';
    let colorRight = 'rgba(0, 0, 200)';
    if (conn === 'default') {
        colorLeft = 'rgba(0, 0, 200)';
    } else if (conn === 'direct') {
        colorLeft = 'rgba(0, 200, 0)';
    }

    // Set icon
    const canvas = getIconCanvas(colorLeft, colorRight);
    const iconData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    browser.browserAction.setIcon({ imageData: iconData });
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const tabs = await browser.tabs.query({currentWindow: true, active: true});
    const activeTabId = tabs[0].id;
    if (tabId === activeTabId) {
        updateIcon(activeTabId);
    }
});

browser.tabs.onActivated.addListener(activeInfo => {
    const activeTabId = activeInfo.tabId;
    updateIcon(activeTabId);
});

browser.storage.onChanged.addListener(async changedData => {
    const tabs = await browser.tabs.query({currentWindow: true, active: true});
    const activeTabId = tabs[0].id;
    updateIcon(activeTabId);
});
