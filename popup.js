// Get the visited pages from storage and display them in the popup
chrome.storage.local.get(['visitedPages'], function(result) {
  const visitedPages = result.visitedPages || {};
  const visitedList = document.getElementById('visited-list');

  for (const [url, visited] of Object.entries(visitedPages)) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.innerHTML = url;
    listItem.appendChild(link);
    if (visited) {
      listItem.classList.add('visited');
    } else {
      listItem.classList.add('not-visited');
    }
    visitedList.appendChild(listItem);
  }
});

// Save the visited pages when the user clicks the save button
document.getElementById('save-button').addEventListener('click', function() {
  const domain = document.getElementById('domain-input').value;
  const regex = new RegExp(`^https?:\/\/(www\.)?${domain}\/`);
  const visitedPages = {};

  // Get all the tabs that match the domain regex
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    for (const tab of tabs) {
      if (regex.test(tab.url)) {
        visitedPages[tab.url] = true;
      }
    }

    // Save the visited pages to storage
    chrome.storage.local.set({visitedPages: visitedPages}, function() {
      console.log('Visited pages saved');
    });

    // Refresh the popup to display the updated visited pages
    window.location.reload();
  });
});
