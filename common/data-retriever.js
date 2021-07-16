export let data = await browser.storage.local.get();

if (data.whitelist === undefined) {
    data.whitelist = new Set();
}

browser.storage.onChanged.addListener(changedData => {
    data.whitelist = changedData.whitelist.newValue;
});
