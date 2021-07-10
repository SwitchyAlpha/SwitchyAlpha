async function main() {
    // Retrieve whitelist
    const data = await browser.storage.local.get();
    let whitelist = data.whitelist ? data.whitelist : new Set();

    const whitelistTextArea = document.querySelector('#whitelist');
    whitelistTextArea.value = Array.from(whitelist).join('\n');

    whitelistTextArea.addEventListener('change', () => {
        let whitelist = new Set(whitelistTextArea.value.split('\n'));
        browser.storage.local.set({ whitelist });
    });
}

main().catch(error => {
    console.error(`Error in options page: ${error.message}`);
});
