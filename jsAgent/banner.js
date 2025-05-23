let temp_banner_html = `
<div class="bw-banner" id="bw-banner-{{id}}" data-id="{{dataId}}" style="position: absolute !important; top: 25px !important; z-index: 999999 !important; background-color: #5e4b7b !important; left: calc(50% - 435px / 2) !important; line-height: 13px !important; font-weight: 400 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; border-radius: 5px !important; width: 435px !important; box-shadow: 0px 2px 7px 0px #0000001F; border: 1px solid #D0D5DD;">
    <div style="color:{{textColor}} !important; width: 100% !important; text-align: center !important; font-family: Inter !important; font-size: 13px !important; font-weight: 400 !important; line-height: 24px !important; text-align: left !important; text-underline-position: from-font !important; text-decoration-skip-ink: none !important; padding-left: 28px !important;">
        {{content}}
    </div>
    <svg class="bw-banner-close-icon" aria-hidden="true" viewBox="0 0 24 24" style="fill:{{textColor}} !important; font-size: 20px !important; cursor: pointer !important; width: 25px !important; height: 25px !important; padding: 12px !important;">
        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
</div>`;

bw.banner = {
    init: function () {
        bw.banner.putHtml();
        bw.banner.bindClick();
    },
    putHtml:async function () {
        const bannersData = window.bwonboarddata.banner;
        let bannerHtml = '';
        for (let i = 0; i < bannersData.length; i++) {
            const item = bannersData[i];
            let temp_html = ``;
            temp_html = temp_banner_html.replace(new RegExp('{{backGroundColor}}', 'g'), item.backgroundColor);
            temp_html = temp_html.replace(new RegExp('{{position}}', 'g'), item.position);
            temp_html = temp_html.replace(new RegExp('{{textColor}}', 'g'), item.fontColor);
            temp_html = temp_html.replace(new RegExp('{{content}}', 'g'), item.bannerText);
            temp_html = temp_html.replace(new RegExp('{{dataId}}', 'g'), item.id);
            temp_html = temp_html.replace(new RegExp('{{id}}', 'g'), i);
            bannerHtml += temp_html;
        }
        document.body.insertAdjacentHTML('afterbegin', bannerHtml);
    },
    bindClick: function () {
        let closeBtns = document.getElementsByClassName('bw-banner-close-icon');
        for (let i = 0; i < closeBtns.length; i++) {
            const element = closeBtns[i];
            element.addEventListener('click',async function (e) {
                const clickedElement = document.getElementById("bw-banner-" + i);
                clickedElement.style.display = 'none';
                const dataId = clickedElement.getAttribute('data-id');
                await bw.data.sendData(bw.GuideType.BANNER, bw.user.getUserID(), true, dataId);
            });
        }
    },

};

(async function () {
    bw.banner.init();
})();