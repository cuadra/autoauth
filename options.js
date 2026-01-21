chrome.storage.local.get(["keys"]).then((result) => {
  console.log("Frontend: Stored keys:", result.keys);
});

const handler = (e) => {
  e.preventDefault();
  chrome.storage.local
    .set({
      keys: [
        {
          a: document.querySelector("#a").value,
          u: document.querySelector("#u").value,
          p: document.querySelector("#p").value,
        },
      ],
    })
    .then(() => {
      console.log("Credentials saved.");

      chrome.storage.local.get(["keys"]).then((result) => {
        console.log("Frontend: Stored keys:", result.keys);
      });
    });
};
document.querySelector("#save").addEventListener("click", handler);
