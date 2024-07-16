/*
 * This Event triggers when the browser has comitted to loading a webpage.
 * As opposed to e.g. webNavigation.onCompleted, this will start to run early
 * so that we can begin to remove ads as soon as possible.
 */

firefox.webNavigation.onCommitted.addListener(function (tab) {
  //Prevents script from running when other frames load
  if (tab.frameId == 0) {
    firefox.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      // Get the URL of the webpage
      let url = tabs[0].url;
      // Remove unnecessary protocol definitions and www subdomain from the URL
      let parsedUrl = url
        .replace("https://", "")
        .replace("http://", "")
        .replace("www", "");
      // Remove path and queries e.g. linkedin.com/feed or linkedin.com?query=value
      // We only want the base domain
      let domain = parsedUrl
        .slice(
          0,
          parsedUrl.indexOf("/") == -1
            ? parsedUrl.length
            : parsedUrl.indexOf("/"),
        )
        .slice(
          0,
          parsedUrl.indexOf("?") == -1
            ? parsedUrl.length
            : parsedUrl.indexOf("?"),
        );
      try {
        if (domain.length < 1 || domain === null || domain === undefined) {
          return;
        } else if (domain == "linkedin.com") {
          runLinkedInScript();
          return;
        }
      } catch (error) {
        throw error;
      }
    });
  }
});

function runLinkedInScript() {
  // Inject script from file into webpage
  firefox.tabs.executeScript({
    file: "linkedin.js",
  });
  return true;
}
