// Example: one-time credentials stored in memory (service worker can be evicted)
// Better: also persist in chrome.storage.session or storage.local with an expiry.

const user = '';
const pass = '';
const pattern = '';

let alreadyTried = false;
chrome.webRequest.onAuthRequired.addListener(
   (details, callback) => {
    console.log('onAuthRequired', details);
    //turn into proper url object

    //if failed attempts, do not provide credentials again
    if(details.url.includes(pattern) && !alreadyTried) {
        console.log(`Providing credentials for ${pattern}`);
    callback( {
      authCredentials: {
        username: user,
        password: pass
      }
    })
    alreadyTried = true;

    }

    callback(); // No credentials provided



  },
  { urls: ["<all_urls>"] },  ["asyncBlocking"] 
);
