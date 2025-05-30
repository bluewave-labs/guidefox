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

            //bw.hint.positionTooltip(tooltip, contentContainer, tooltipArrow);

            tooltip.addEventListener('mouseenter', function (e) {
                clearInterval(tooltip.timer);
                e.target.style.visibility = 'visible';
                //bw.hint.positionTooltip(tooltip, contentContainer, tooltipArrow);
            });

            tooltip.addEventListener('mouseleave', function (e) {
                tooltip.timer = setTimeout(() => {
                    e.target.style.visibility = 'hidden';
                }, 1500);
            });
            bw.hint.bindSelector(item, tooltip);

        }   
    },
    //this can be delete later
    positionTooltip: function(tooltip, tooltipOwner, tooltipArrow) {
       
        const containerRect = tooltipOwner.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let tooltipPosition = tooltip.pos; //'top';
        let arrowPosition = 'bottom';
        if(tooltipPosition == 'top'){ arrowPosition = 'bottom'}
        if(tooltipPosition == 'bottom'){ arrowPosition = 'top'}
        if(tooltipPosition == 'left'){ arrowPosition = 'right'}
        if(tooltipPosition == 'right'){ arrowPosition = 'left'}


        let top = containerRect.top - tooltipRect.height - 5; // 5px above
        let left = containerRect.left + (containerRect.width - tooltipRect.width) / 2; // Centered horizontally

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
            tooltip.style.left = `${containerRect.left + window.scrollX + containerRect.width / 2}px`;
            tooltip.style.top = `${containerRect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
            tooltip.style.transform = 'translateX(-50%)';
        } else if (tooltipPosition === 'bottom') {
            tooltip.style.left = `${containerRect.left + window.scrollX + containerRect.width / 2}px`;
            tooltip.style.top = `${containerRect.bottom + window.scrollY + 5}px`;
            tooltip.style.transform = 'translateX(-50%)';
        } else if (tooltipPosition === 'left') {
            tooltip.style.left = `${containerRect.left + window.scrollX - tooltip.offsetWidth - 5}px`;
            tooltip.style.top = `${containerRect.top + window.scrollY + containerRect.height / 2}px`;
            tooltip.style.transform = 'translateY(-50%)';
        } else if (tooltipPosition === 'right') {
            tooltip.style.left = `${containerRect.right + window.scrollX + 5}px`;
            tooltip.style.top = `${containerRect.top + window.scrollY + containerRect.height / 2}px`;
            tooltip.style.transform = 'translateY(-50%)';
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
        tooltip.setAttribute('data-tooltip-position', item.tooltipPlacement);
        tooltip.timer = null;
        tooltip.positionTimer = null;
        tooltip.style.cssText = `
            width: 400px;
            height: 250px;
            position: absolute;
            background-color: white;    
            box-shadow: rgba(0, 0, 0, 0.1) 1px 4px 13px;
            display: flex;
            flex-direction: column;
            color: ${item.textColor};
            z-index:9999;
            visibility: hidden;
        `;

        return tooltip;
    },
    generateTooltipArrow: function () {
        const tooltipArrow = document.createElement('div');
        tooltipArrow.style.content = '""';
        tooltipArrow.classList.add('bw-tooltip-arrow');
        tooltipArrow.style.cssText= `
            content: "";
            position: absolute;
            border-width: 5px;
            border-style: solid;
            width: 0px;
            height: 0px;
            margin-left: -5px;
            border-color: rgb(85, 85, 85) transparent transparent;`;

        return tooltipArrow;
    },
    generateHeader: function (item) {
        const header = document.createElement('div');
        header.style.cssText = `background-color: ${item.headerBackgroundColor} !important; color: ${item.headerColor} !important;`;
        header.innerHTML = `
            <h3 style="font-size: 20px !important; font-weight: 600 !important; line-height: 30px !important; text-align: left !important; padding: 0 32px !important; margin-bottom: 8px !important; margin-top: 24px !important; font-family: "Inter", sans-serif !important;">${item.header}</h3>
        `;
        return header;
    },
    generateContentContainer: function (item) {
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            color: ${item.textColor} !important;   
            justify-content: space-between !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            min-height: 170px !important;
            padding: 0 32px !important;
            font-size: 13px !important;
            word-wrap: break-word !important;
        `;

        return contentContainer
    },
    generateContent : function (item) {
        const content = document.createElement('div');
        content.style.cssText = `
            font-family: "Inter", sans-serif !important;
        `;
        content.innerHTML = item.hintContent;
        return content;
    },
    generateButton: function (item) {
        const btnEvent = item.action;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
                margin-top: 8px !important;
                display: flex !important;
                justify-content: flex-end !important;
        `;
        const button = document.createElement('button');
        button.textContent = item.actionButtonText;
        button.setAttribute("bw-data-id", item.id);
        button.style.cssText = `
            background-color: ${item.buttonBackgroundColor} !important;
            color: ${item.buttonTextColor} !important;
            border: none !important;
            border-radius: 8px !important;
            min-width: 64px !important;
            padding: 6px 16px !important;
            font-family: Inter !important;
            font-size: 13px !important;
            cursor: pointer !important;
            float: right !important;
            display: inline-flex !important;
            -webkit-box-align: center !important;
            align-items: center !important;
            -webkit-box-pack: center !important;
            position: relative !important;
            box-sizing: border-box !important;
            -webkit-tap-highlight-color: transparent !important;
            vertical-align: middle !important;
        `;

        button.addEventListener('click',async (e) => {
            e.preventDefault();
            const itemId = e.target.getAttribute('bw-data-id');
            if(btnEvent == 'no action'){
                //do nothing
            }
            else if(btnEvent == 'open url'){
                await bw.data.sendData(bw.GuideType.HINT, bw.user.getUserID(), true, itemId);
                location.href = item.actionButtonUrl;
            }
            else if(btnEvent == 'open url in a new tab'){
                await bw.data.sendData(bw.GuideType.HINT, bw.user.getUserID(), true, itemId);
                window.open(item.actionButtonUrl, '_blank');
            }
        });

        button.addEventListener('mouseenter', function(e) {
            e.target.style.boxShadow = '0px 2px 7px 0px #0000001F !important'
        });

        button.addEventListener('mouseleave', function(e) {
            e.target.style.boxShadow = 'none';
        });


        
        buttonContainer.appendChild(button);
        return buttonContainer;
    },
    bindSelector: function (item, tooltip) {
        const selector= item.targetElement;
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            if(item.isHintIconVisible){
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
            }
            

            element.addEventListener('mouseenter', function (e) {

                clearTimeout(tooltip.timer);
                clearTimeout(tooltip.positionTimer);
                tooltip.positionTimer = setTimeout(function() {
                    
                    const position = tooltip.getAttribute('data-tooltip-position') || 'top';

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
                    
                    let tooltipArrow = tooltip.getElementsByClassName('bw-tooltip-arrow')[0];
                    bw.hint.positionTooltip(tooltip,  e.target, tooltipArrow);
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