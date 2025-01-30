
const HIGHLIGHTER_ID = 'bw-highlighter';
const DIV_ID = 'bw-sticky-botton-div';
const INPUT_ID = 'bw-ext-input';
const BUTTON_ID = 'bw-ext-button';
let domSelected = false;
let lastHighlightTarget;


function terminate() {
	// The `click` listener is automatically removed after it has been called once
	window.removeEventListener('mousemove', throttle(updateHighlight));
	window.removeEventListener('keydown', checkTerminateKeys);
	removeHighlight();
};



function createStickyDiv() {
    // Create the container div
	debugger;
	let checkElement =document.getElementById('bw-sticky-botton-div');
	if(checkElement){return;}

    const stickyDiv = document.createElement('div');
	stickyDiv.id = DIV_ID;
    stickyDiv.style.position = 'fixed';
    stickyDiv.style.bottom = '0';
    stickyDiv.style.left = '0';
    stickyDiv.style.width = '100%';
    stickyDiv.style.backgroundColor = '#f8f9fa';
    stickyDiv.style.padding = '10px';
    stickyDiv.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
    stickyDiv.style.display = 'flex';
    stickyDiv.style.alignItems = 'center';
    stickyDiv.style.justifyContent = 'center';
    stickyDiv.style.gap = '10px';
    stickyDiv.style.zIndex = '1000'; // Ensure it stays on top

    // Create the label
    const label = document.createElement('label');
    label.textContent = 'Target Element :';
    label.style.fontSize = '16px';
    label.style.color = '#333';
    stickyDiv.appendChild(label);

    // Create the input field
    const input = document.createElement('input');
	input.id = INPUT_ID;
    input.type = 'text';
	input.disabled = true;
    input.placeholder = 'selector';
    input.style.padding = '8px';
    input.style.fontSize = '16px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    input.style.outline = 'none';
    input.style.flex = '1';
    input.style.maxWidth = '300px';
    input.addEventListener('focus', () => {
        input.style.borderColor = '#007bff';
        input.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
    });
    input.addEventListener('blur', () => {
        input.style.borderColor = '#ccc';
        input.style.boxShadow = 'none';
    });
    stickyDiv.appendChild(input);

    // Create the button
    const button = document.createElement('button');
	button.id = BUTTON_ID;
    button.textContent = 'Copy';
    button.style.padding = '8px 16px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s ease';
    
	button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#0056b3';
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#007bff';
    });
    button.addEventListener('click',async () => {
		await navigator?.clipboard?.writeText(input.value);
        //alert(`You entered: ${input.value}`);
    });
    stickyDiv.appendChild(button);

    // Append the sticky div to the body
    document.body.appendChild(stickyDiv);
}

function addHighlight() {
	const div = document.createElement('div');
	div.id = HIGHLIGHTER_ID;
	const { style } = div;
	style.backgroundColor = '#1d234280';
	style.boxSizing = 'border-box';
	style.border = 'solid 4px #f0bb8980';
	style.position = 'fixed';
	style.zIndex = '9999';
	style.pointerEvents = 'none';
	document.body.appendChild(div);
};

function updateHighlight({ target }) {
	if (!(target instanceof HTMLElement) || target === lastHighlightTarget) {
		return;
	}
	lastHighlightTarget = target;
	const { top, left, width, height } = target.getBoundingClientRect();
	const highlighter = document.getElementById(HIGHLIGHTER_ID);
	if(!domSelected){
		document.getElementById('bw-ext-input').value = generateSelector(target);
	}
	
	if (!highlighter) return;
	const { style } = highlighter;
	style.top = top - 4 + 'px';
	style.left = left - 4 + 'px';
	style.width = width + 8 + 'px';
	style.height = height + 8 + 'px';
};

function removeHighlight() {
	const highlighter = document.getElementById(HIGHLIGHTER_ID);
	if (highlighter) {
		document.body.removeChild(highlighter);
	}
	domSelected = true;
};

async function grabSelector(event) {
	event.preventDefault();
	const { target } = event;
	if (!(target instanceof HTMLElement)) {
		terminate();
		return;
	}
	terminate();
};

function generateSelector(element) {
	if (!element) return '';

	let selector = getSelector(element);
	while(!isUnique(selector) && element) {
		element = element.parentElement;
		const newSelector = getSelector(element);
		if(newSelector) selector = newSelector + '>' + selector;
	}

	return selector;
};

function getSelector(element) {
	if (!element) return '';

	const { tagName, id } = element;
	const tag = tagName.toLowerCase();
	if (tag === 'body' || tag === 'html') return tag;

	let selector = tag;
	if(!isUnique(selector)) selector += id ? '#' + id : '';
	
	return appendPseudoSelector(element, selector);
};

function appendPseudoSelector(element, selector) {
	return isUnique(selector) ? selector : `${selector}:nth-child(${getChildIndex(element)})`;
};

function getChildIndex({ previousElementSibling: sibling }) {
	return sibling ? getChildIndex(sibling) + 1 : 1;
};

function getQueryLength(selector) {
	return document.querySelectorAll(selector).length;
};

function isUnique(selector) {
	return getQueryLength(selector) <= 1;
};

function checkTerminateKeys(event) {
	
	const { key } = event;
	if (key === 'Escape' || key === 'Esc') {
		event.preventDefault();
		terminate();
	}
};

function throttle(func, limit = 100) {
	createStickyDiv();
	let inThrottle;
	let lastResult;
	domSelected = false;
	return function () {
		const args = arguments;
		const context = this

		if (!inThrottle) {
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
			lastResult = func.apply(context, args);
		}

		return lastResult;
	};
};
