const popupDefaultOptions = {
    padding: 20,
    overlayOpacity:"0",
    overlayBlur:0,
    closeButtonAction: "no action",
    popupSize: "small",
    url: "https://",
    actionButtonText: "Take me to subscription page",
    headerBackgroundColor: "#F8F9F8",
    headerColor: "#101828",
    textColor: "#344054",
    buttonBackgroundColor: "#7F56D9",
    buttonTextColor: "#FFFFFF",
    header: "default",
    content: ""
}

const PopUpSize = Object.freeze({
    small:{ 
        width: 400,
        height: 250
    },
    medium:{    
        width: 500,
        height: 300
    },
    large:{
        width: 700,
        height: 350
    }
});

bw.popup = {
    init: async function () {
        bw.popup.addOverlay();
        await bw.popup.addModal();
     },
    
    addOverlay: function () {
        document.body.insertAdjacentHTML('afterbegin', `<div id='bw-overlay' style=' position: fixed; top: 0; left: 0;width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.${popupDefaultOptions.overlayOpacity}); z-index: 999;'></div>`);
    },
    addModal: async function (cb) {
        const options = window.bwonboarddata.popup[0];
        let overlay = document.getElementById('bw-overlay');
       
        let option = {
            ...popupDefaultOptions,
            ...options
        };
        const size = PopUpSize[option.popupSize];

        let temp_html = `
            <div id='bw-modal' style='position: fixed; top: 180px; left: 50%; transform: translate(-50%, -50%); width: ${size.width}px; height: ${size.height}px; display: block; z-index: 1000; border: 1px solid var(--light-border-color); box-sizing: border-box; padding-top: 100px; background-color: rgb(255 255 255 / 0%);;'>
                <div class='modal-content' style='border-radius: 4px; position: relative; margin: auto;padding: 0;border: 1px solid #D0D5DD; background-color: white;box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;'>
                    ${bw.popup.addHeader(option.header, option.headerBackgroundColor, option.headerColor, option.padding)}
                    <div class="modal-body" style='padding: ${option.padding}px ${option.padding}px; display: flex; justify-content: space-between; flex-direction: column; box-sizing: border-box; font-family: "Inter", sans-serif; font-size: 13px; min-height: 227px; '>
                        ${option.content}
                        ${option.closeButtonAction !== 'no action' ?  bw.popup.addButton(option.actionButtonText, option.buttonBackgroundColor, option.buttonTextColor, option.padding, `bw-popup-btn`): ''}
                    </div>
                </div>
            </div>`;
        overlay.insertAdjacentHTML('afterbegin', temp_html);
        await bw.data.sendData(bw.GuideType.POPUP, bw.user.getUserID(), true, option.id);
        bw.popup.bindEvents( option.closeButtonAction, option.url);
    },
    addHeader: function(headerTitle, bgColor, textColor, padding){
        let headerHtml = `<div class="modal-header" style='height:57px; margin: auto; font-weight: bold; padding: 0 ${padding}px; background-color: ${bgColor}; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #D0D5DD;'>
            <h2 style= 'font-family: "Inter", sans-serif; font-size: 20px; font-weight: 500; margin-left: 5px; color:${textColor}'>${headerTitle}</h2>
            <svg id='bw-modal-close' class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseOutlinedIcon" 
                style="fill: rgb(152, 162, 179); font-size: 20px; display: block;position: absolute;float: right;right: 23px;cursor: pointer; width: 1em;height: 1em;display: inline-block; margin: auto;">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
        </div>`;
        return headerHtml;
    },
    addButton: function(text, bgColor, textColor, padding, btnId){
        let buttonHtml = `
            <div class="modal-button-container" style=' display: flex; justify-content: flex-end; margin-top: 16px;'>
                <button id="${btnId}" style="color: ${textColor}; padding: ${padding}px ${padding}px;background-color: ${bgColor}; border-radius:8px; cursor: pointer;
                transition: background-color 0.3s, border-color 0.3s; min-width: 64px; padding: 6px 16px; border: 0; font-family: Inter; font-weight: 500; font-size: 13px; line-height: 1.75;">${text}</button>
            </div>`;
        return buttonHtml;
    },
    bindEvents: function(btnEvent, btnlink){
        document.getElementById('bw-modal-close').addEventListener('click', function(){
            bw.popup.hideModal();
        });
        
        const button = document.getElementById('bw-popup-btn');
        button.addEventListener('click', function(){
            if(btnEvent == 'no action'){
                bw.popup.hideModal();
            }
            else if(btnEvent == 'open url'){
                location.href = btnlink;
            }
            else if(btnEvent == 'open url in a new tab'){
                window.open(btnlink);
            }
        });

        button.addEventListener('mouseenter', function(e) {
            e.target.style.boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
        });

        button.addEventListener('mouseleave', function(e) {
            e.target.style.boxShadow = 'none';
        });
    },
    hideModal: function(){
        document.getElementById('bw-overlay').style.display = 'none';
    }
};


(async function () {
    bw.popup.init();
})();