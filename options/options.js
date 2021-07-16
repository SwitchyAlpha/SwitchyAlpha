import { data } from '../common/data-retriever.js'

const whitelistTextArea = document.querySelector('#whitelist');
whitelistTextArea.value = Array.from(data.whitelist).join('\n');

whitelistTextArea.addEventListener('change', () => {
    let whitelist = new Set(whitelistTextArea.value.split('\n'));
    browser.storage.local.set({ whitelist });
});
