chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: setup,
    args: [tab],
  });
});

function setup() {
	addHighlight();
	window.addEventListener('mousemove', throttle(updateHighlight));
	window.addEventListener('click', grabSelector, {capture: true, once: true});
	window.addEventListener('keydown', checkTerminateKeys);
};
