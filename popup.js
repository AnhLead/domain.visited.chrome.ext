function getDomain(url) {
  return new URL(url).hostname;
}

function savePage(domain, url) {
  chrome.storage.local.get(domain, function(data) {
    if (!data[domain]) {
      data[domain] = [];
    }
    if (!data[domain].includes(url)) {
      data[domain].push(url);
    }
    chrome.storage.local.set(data);
  });
}

function renderPages(domain) {
  chrome.storage.local.get(domain, function(data) {
    var pagesList = document.getElementById("pages");
    pagesList.innerHTML = "";
    if (data[domain]) {
      for (var i = 0; i < data[domain].length; i++) {
        var page = data[domain][i];
        var listItem = document.createElement("li");
        listItem.textContent = page;
        if (chrome.history.search({text: page}, function(results) {
          if (results.length > 0) {
            listItem.classList.add("visited");
          } else {
            listItem.classList.add("unvisited");
          }
        }));
        pagesList.appendChild(listItem);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  var saveButton = document.getElementById("save");
  saveButton.addEventListener("click", function() {
    var domain = document.getElementById("domain").value;
    if (domain) {
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var url = tabs[0].url;
        var domain = getDomain(url);
        savePage(domain, url);
        renderPages(domain);
      });
    }
  });
});
