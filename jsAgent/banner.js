let temp_banner_html = `
<div class="bw-banner" id="bw-banner-{{id}}" data-id="{{dataId}}" style="position: fixed; {{position}}: 50px; z-index: 999999; height:50px; width:435px; background-color:{{backGroundColor}}; left: 50%; transform: translate(-50%, -50%);
    line-height: 13px; font-weight: 400; display: flex; align-items: center; justify-content: space-between; padding: 0.7rem; border-radius: 5px; height:50px; width:435px;">
        <div style="color:{{textColor}}; width: 100%; text-align: center;font-family: Inter; font-size: 13px; font-weight: 400; line-height: 24px; text-align: left; text-underline-position: from-font; text-decoration-skip-ink: none;">
         {{content}}
        </div>
        <svg class="bw-banner-close-icon" aria-hidden="true" viewBox="0 0 24 24" style="fill:{{textColor}}; font-size: 20px; cursor: pointer; width: 25px; height: 25px; padding: 12px;">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>    
</div>`;

bw.banner = {
    init: function () {
        bw.banner.putHtml();
        bw.banner.bindClick();
    },
    putHtml: function () {
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
            element.addEventListener('click', function (e) {
                const clickedElement = document.getElementById("bw-banner-" + i);
                clickedElement.style.display = 'none';
                const dataId = clickedElement.getAttribute('data-id');
                bw.data.sendData(bw.GuideType.BANNER, bw.user.getUserID(), true, dataId);
            });
        }
    },

};

(async function () {
    bw.banner.init();
})();