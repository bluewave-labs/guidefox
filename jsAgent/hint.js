bw.hint = {
    isMouseOverTooltip : false,
    isMouseOverContainer : false,
    init: function () {
        bw.hint.putHtml();
    },
    putHtml: function () {
        const hintData = window.bwonboarddata.hint;

        for (let i = 0; i < hintData.length; i++) {
            const item = hintData[i];
            
            const tooltip = bw.hint.generateTooltip(item);
            const tooltipArrow = bw.hint.generateTooltipArrow();
            const header = bw.hint.generateHeader(item);
            
            const contentContainer = bw.hint.generateContentContainer(item);
            const content = bw.hint.generateContent(item);
            
            contentContainer.appendChild(content);
            
            if(item.action !== 'no action'){
                const button = bw.hint.generateButton(item);
                contentContainer.appendChild(button);
            }
            
            tooltip.appendChild(tooltipArrow);
            tooltip.appendChild(header);
            tooltip.appendChild(contentContainer);
            
            document.body.appendChild(tooltip);

            bw.hint.positionTooltip(tooltip, contentContainer, tooltipArrow);

            tooltip.addEventListener('mouseenter', function (e) {
                clearInterval(tooltip.timer);
                e.target.style.visibility = 'visible';
            });

            tooltip.addEventListener('mouseleave', function (e) {
                tooltip.timer = setTimeout(() => {
                    e.target.style.visibility = 'hidden';
                }, 1500);
            });
            bw.hint.bindSelector(item.targetElement, tooltip);

        }   
    },
    //this can be delete later
    positionTooltip: function(tooltip, tooltipOwner, tooltipArrow) {
        const containerRect = tooltipOwner.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        let top = containerRect.top - tooltipRect.height - 5; // 5px above
        let left = containerRect.left + (containerRect.width - tooltipRect.width) / 2; // Centered horizontally
        let arrowPosition = 'bottom';
        let tooltipPosition = 'top';
        if (top < 0) {
            arrowPosition = 'top';
            tooltipPosition = 'bottom';
        }
        if (left < 0) {
            arrowPosition = 'left';
            tooltipPosition = 'right';
        } else if (left + tooltipRect.width > viewportWidth) {
            arrowPosition = 'right';
            tooltipPosition = 'left';
        }
        
        if (tooltipPosition === 'top') {
            tooltip.style.top = '-87px';
            tooltip.style.left = '-27px';
        } else if (tooltipPosition === 'bottom') {
            tooltip.style.top = '38px';
            tooltip.style.left = '-27px';
        } else if (tooltipPosition === 'left') {
            tooltip.style.top = '-24px';
            tooltip.style.left = '-172px';
        } else if (tooltipPosition === 'right') {
            tooltip.style.top = '-24px';
            tooltip.style.left = '118px';
        }

        if(arrowPosition === 'bottom') {
            tooltipArrow.style.top = '100%';
            tooltipArrow.style.left = '50%';
            tooltipArrow.style.marginLeft = '-5px';
            tooltipArrow.style.borderColor = '#555 transparent transparent transparent';
        } else if(arrowPosition === 'top') {
            tooltipArrow.style.top = '-10px';
            tooltipArrow.style.left = '50%';
            tooltipArrow.style.marginLeft = '-5px';
            tooltipArrow.style.borderColor = 'transparent transparent #555 transparent';
        } else if(arrowPosition === 'left') {
            tooltipArrow.style.top = '50%';
            tooltipArrow.style.left = '-5px';
            tooltipArrow.style.marginTop = '-5px';
            tooltipArrow.style.borderColor = 'transparent #555 transparent transparent';
        } else if(arrowPosition === 'right') {
            tooltipArrow.style.top = '50%';
            tooltipArrow.style.left = '';
            tooltipArrow.style.right = '-10px';
            tooltipArrow.style.marginTop = '-5px';
            tooltipArrow.style.borderColor = 'transparent transparent transparent #555';
        }
        return {tooltipPosition, arrowPosition};
    },
    generateTooltip: function (item) {
        const tooltip = document.createElement('div');
        tooltip.pos = item.tooltipPlacement;
        tooltip.timer = null;
        tooltip.positionTimer = null;
        tooltip.style.cssText = `
            width: 400px;
            height: 250px;
            position: absolute;
            background-color: white;    
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            color: ${item.textColor};
            z-index: 9999;
        `;

        return tooltip;
    },
    generateTooltipArrow: function () {
        const tooltipArrow = document.createElement('div');
        tooltipArrow.style.content = '""';
        tooltipArrow.style.position = 'absolute';
        tooltipArrow.style.borderWidth = '5px';
        tooltipArrow.style.borderStyle = 'solid';
        tooltipArrow.style.width = '0';
        tooltipArrow.style.height = '0';

        return tooltipArrow;
    },
    generateHeader: function (item) {
        const header = document.createElement('div');
        header.style.cssText = `background-color: ${item.headerBackgroundColor}; color: ${item.headerColor};`;
        header.innerHTML = `
            <h3 style="font-size: 20px; font-weight: 600; line-height: 30px; text-align: left; padding: 0 32px; margin-bottom: 8px; margin-top: 24px;font-family: "Inter", sans-serif;">${item.header}</h3>
        `;
        return header;
    },
    generateContentContainer: function (item) {
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            color: ${item.textColor};   
            justify-content: space-between;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            min-height: 170px;
            padding: 0 32px;
            font-size: 13px;
            word-wrap: break-word;
        `;

        return contentContainer
    },
    generateContent : function (item) {
        const content = document.createElement('div');
        content.style.cssText = `
            font-family: "Inter", sans-serif;
        `;
        content.innerHTML = item.hintContent;
        return content;
    },
    generateButton: function (item) {
        const btnEvent = item.action;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
                margin-top: 8px;
                display: flex;
                justify-content: flex-end;
        `;
        const button = document.createElement('button');
        button.textContent = item.actionButtonText;
        button.style.cssText = `
            background-color: ${item.buttonBackgroundColor};
            color: ${item.buttonTextColor};
            border: none;
            border-radius: 8px;
            min-width: 64px;
            padding: 6px 16px;
            font-family: Inter;
            font-size: 13px;
            cursor: pointer;
            float: right;
            display: inline-flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            position: relative;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            vertical-align: middle;
        `;

        button.addEventListener('click', () => {
            if(btnEvent == 'no action'){
                
            }
            else if(btnEvent == 'open url'){
                location.href = item.actionButtonUrl;
            }
            else if(btnEvent == 'open url in a new tab'){
                window.open(item.actionButtonUrl, '_blank');
            }
        });

        button.addEventListener('mouseenter', function(e) {
            e.target.style.boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
        });

        button.addEventListener('mouseleave', function(e) {
            e.target.style.boxShadow = 'none';
        });

        buttonContainer.appendChild(button);
        return buttonContainer;
    },
    bindSelector: function (selector, tooltip) {
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            const tooltipCue = document.createElement('div');
            tooltipCue.className = 'tooltip-cue';
            tooltipCue.textContent = '?';
            tooltipCue.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #2078ca;
                color: #fff;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1001; 
                animation: pulse 1.5s infinite;
            }`;
            const rect = element.getBoundingClientRect();
            tooltipCue.style.left = `${rect.right + window.scrollX - 8}px`; // Adjust position
            tooltipCue.style.top = `${rect.top + window.scrollY - 8}px`; // Adjust position

            tooltipCue.animate(
                [
                    { transform: 'scale(1)', opacity: 1 },
                    { transform: 'scale(1.2)', opacity: 0.7 },
                    { transform: 'scale(1)', opacity: 1 }
                ],
                {
                    duration: 1500, // 1.5 seconds
                    iterations: Infinity // Loop forever
                }
            );

            document.body.appendChild(tooltipCue);

            element.addEventListener('mouseenter', function (e) {

                clearTimeout(tooltip.timer);
                clearTimeout(tooltip.positionTimer);
                tooltip.positionTimer = setTimeout(function() {

                    const position = e.target.getAttribute('data-tooltip-position') || 'top';



                    const rect = e.target.getBoundingClientRect();
                    switch (position) {
                        case 'top':
                            tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
                            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
                            tooltip.style.transform = 'translateX(-50%)';
                            break;
                        case 'bottom':
                            tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
                            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                            tooltip.style.transform = 'translateX(-50%)';
                            break;
                        case 'left':
                            tooltip.style.left = `${rect.left + window.scrollX - tooltip.offsetWidth - 5}px`;
                            tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
                            tooltip.style.transform = 'translateY(-50%)';
                            break;
                        case 'right':
                            tooltip.style.left = `${rect.right + window.scrollX + 5}px`;
                            tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
                            tooltip.style.transform = 'translateY(-50%)';
                            break;
                    }

                    tooltip.style.visibility = 'visible';


                }, 500);

            });
            element.addEventListener('mouseleave', function (e) {
                tooltip.timer = setTimeout(() => {
                    tooltip.style.visibility = 'hidden';
                }, 1500);
            });
        }
    }

};

(async function () {
    bw.hint.init();
})();