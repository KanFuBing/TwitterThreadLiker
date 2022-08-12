chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const splitUrl = tab.url.split('/')
    if (changeInfo.status === 'complete' && splitUrl[2] === 'twitter.com' && splitUrl[4] == 'status') {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['./foreground.js']
        })
    }
})
