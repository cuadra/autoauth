let alreadyTried = false;
chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    chrome.storage.local.get("keys", (result) => {
      if (!result.keys) {
        return;
      }
      console.log("Backend: stored keys:", result.keys);
    });

    console.log("onAuthRequired", details);

    //turn into proper url object
    //if failed attempts, do not provide credentials again
    //ensure https://
    //check redirects addresses too
    if (details.url.includes(patterns[0]) && !alreadyTried) {
      console.log(`Providing credentials for ${patterns[0]}`);
      callback({
        authCredentials: {
          username: creds[0].username,
          password: creds[0].password,
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
