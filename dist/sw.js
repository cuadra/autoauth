let alreadyTried = false;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: "index.html" });
  }
});

chrome.webRequest.onAuthRequired.addListener(
  async (details, callback) => {
    const k = await chrome.storage.local.get(["keys"]);

    console.log("onAuthRequired", details, k);

    //turn into proper url object
    //if failed attempts, do not provide credentials again
    //ensure https://
    //check redirects addresses too
    const o = k.keys.find((key) => details.url.includes(key.site));

    if (o && !alreadyTried) {
      console.log(`Providing credentials for`, o);
      callback({
        authCredentials: {
          username: o.user,
          password: o.password,
        },
      });
      alreadyTried = true;
    }

    callback();
  },
  { urls: ["<all_urls>"] },
  ["asyncBlocking"],
);

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
