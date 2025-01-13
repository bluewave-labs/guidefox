const linksDefaultOptions = {
    "url": "https://www.google.com",
    "order": 1,
    "target": true,
    headerBackgroundColor: "#F8F9F8",
    iconColor: "#7F56D9",
    linkFontColor: "#344054"
};

const global_content_html=`
            <li class="bw-links-li" style="display: flex; align-items: center; height:24px;">
                <svg viewBox="0 0 16 16" width="16" height="16" style="margin-right:16px" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="M6.6668 8.66666C6.9531 9.04942 7.31837 9.36612 7.73783 9.59529C8.1573 9.82446 8.62114 9.96074 9.0979 9.99489C9.57466 10.029 10.0532 9.96024 10.501 9.79319C10.9489 9.62613 11.3555 9.36471 11.6935 9.02666L13.6935 7.02666C14.3007 6.39799 14.6366 5.55598 14.629 4.68199C14.6215 3.808 14.2709 2.97196 13.6529 2.35394C13.0348 1.73591 12.1988 1.38535 11.3248 1.37775C10.4508 1.37016 9.60881 1.70614 8.98013 2.31333L7.83347 3.45333M9.33347 7.33333C9.04716 6.95058 8.68189 6.63388 8.26243 6.4047C7.84297 6.17553 7.37913 6.03925 6.90237 6.00511C6.4256 5.97096 5.94708 6.03975 5.49924 6.20681C5.0514 6.37387 4.64472 6.63528 4.3068 6.97333L2.3068 8.97333C1.69961 9.602 1.36363 10.444 1.37122 11.318C1.37881 12.192 1.72938 13.028 2.3474 13.6461C2.96543 14.2641 3.80147 14.6147 4.67546 14.6222C5.54945 14.6298 6.39146 14.2939 7.02013 13.6867L8.16013 12.5467" 
                        stroke="{{strokeColor}}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        </path>
                    </g>
                    <defs>
                        <clipPath>
                            <rect width="16" height="16" fill="white"></rect>
                        </clipPath>
                    </defs>
                </svg>
                <a href="{{link}}" target="_blank" style="color:{{linkFontColor}}; text-decoration: none; font-family: Inter; font-size: 13px; font-weight: 400;">{{title}}</a>
            </li>
        `;

bw.links={
    init:function(){
        bw.links.putHtml();
        bw.links.putHeader();
        bw.links.bindClick();
    },
    putHtml:function(){
        const options = window.bwonboarddata.helperLink[0];
        let option = {
            ...linksDefaultOptions,
            ...options
        };
        
        let temp_html = `
        <div style="position: fixed; bottom: 20px; right: 30px; z-index: 9999999;">
            <div id="bw-links" style=" box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.031372549), 0px 20px 24px -4px rgba(16, 24, 40, 0.0784313725); width: 330px; display: flex; flex-direction: column; justify-content: space-between; ">
                ${bw.links.putHeader(option.title, option.headerBackgroundColor)}
                ${bw.links.putContent(option.links, option.linkFontColor, option.iconColor)}
                ${bw.links.putFooter()}
            </div>
            <div style="display: flex; justify-content: flex-end;" >
                <svg id="bw-link-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 28V21M24 14H24.02M19.8 38.4L22.72 42.2933C23.1542 42.8723 23.3714 43.1618 23.6375 43.2653C23.8707 43.356 24.1293 43.356 24.3625 43.2653C24.6286 43.1618 24.8458 42.8723 25.28 42.2933L28.2 38.4C28.7863 37.6183 29.0794 37.2274 29.437 36.929C29.9138 36.5311 30.4766 36.2497 31.081 36.107C31.5343 36 32.0228 36 33 36C35.7956 36 37.1935 36 38.2961 35.5433C39.7663 34.9343 40.9343 33.7663 41.5433 32.2961C42 31.1935 42 29.7956 42 27V15.6C42 12.2397 42 10.5595 41.346 9.27606C40.7708 8.14708 39.8529 7.2292 38.7239 6.65396C37.4405 6 35.7603 6 32.4 6H15.6C12.2397 6 10.5595 6 9.27606 6.65396C8.14708 7.2292 7.2292 8.14708 6.65396 9.27606C6 10.5595 6 12.2397 6 15.6V27C6 29.7956 6 31.1935 6.45672 32.2961C7.06569 33.7663 8.23373 34.9343 9.7039 35.5433C10.8065 36 12.2044 36 15 36C15.9772 36 16.4657 36 16.919 36.107C17.5234 36.2497 18.0862 36.5311 18.563 36.929C18.9206 37.2274 19.2137 37.6183 19.8 38.4Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            
        </div>`;
        document.body.insertAdjacentHTML('beforeend', temp_html);
    },
    putHeader: function(title, headerBackgroundColor){
        const temp_header_html =`
            <div id="bw-links-header" style="padding: 18px 30px; background-color:${headerBackgroundColor}; display: flex;     justify-content: space-around; align-items: center;">
            <svg style="height: 24px; width: 24px; color: rgb(102, 112, 133); font-size: 24px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m7.46 7.12-2.78 1.15c-.51-1.36-1.58-2.44-2.95-2.94l1.15-2.78c2.1.8 3.77 2.47 4.58 4.57M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3M9.13 4.54l1.17 2.78c-1.38.5-2.47 1.59-2.98 2.97L4.54 9.13c.81-2.11 2.48-3.78 4.59-4.59M4.54 14.87l2.78-1.15c.51 1.38 1.59 2.46 2.97 2.96l-1.17 2.78c-2.1-.81-3.77-2.48-4.58-4.59m10.34 4.59-1.15-2.78c1.37-.51 2.45-1.59 2.95-2.97l2.78 1.17c-.81 2.1-2.48 3.77-4.58 4.58">
                </path>
            </svg> 
                <span style="margin:auto; flex-grow: 1; margin: 0 12px; font-family: Inter; font-size: 20px; font-weight: 600; line-height: 30px;">
                ${title}
                </span>
                    <svg id="bw-links-close" viewBox="0 0 24 24" style="height: 20px; width: 20px; fill: rgb(152, 162, 179); font-size: 20px;">
                <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4">
                </path>
            </svg>
            </div>
        `;
        return temp_header_html;
    },
    putContent: function(links, linkFontColor, strokeColor){
        let temp_content_html=`
            <div id="bw-links-content" style="margin: 0;padding: 26px 34px 44px; background: white;">
                <ul >
                {{links}} 
                </ul>
            </div>
        `;
        let li_html="";
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            let content_link = global_content_html.replace(new RegExp('{{link}}', 'g'), link.url );
            content_link = content_link.replace(new RegExp('{{title}}', 'g'), link.title );
            content_link = content_link.replace(new RegExp('{{linkFontColor}}', 'g'), linkFontColor );
            content_link = content_link.replace(new RegExp('{{strokeColor}}', 'g'), strokeColor );
            
            li_html+=content_link;
        }
        temp_content_html = temp_content_html.replace(new RegExp('{{links}}', 'g'), li_html );
        
        return temp_content_html;
    },
    putFooter: function(){
        return '<p style="margin-bottom: 0px; margin-top: 0px; background: white;; padding: 14px 0 11px;border-top: 1px solid #ebebeb; font-family: Inter; font-size: 11px; font-weight: 400; line-height: 2.12; text-align: center;">Powered by BlueWave Onboarding</p>';
    },
    bindClick : function(){
        bw.util.bindLive("#bw-link-icon", "click", function(){
            bw.links.toggle();
        });
        bw.util.bindLive("#bw-links-close", "click", function(){
            document.getElementById('bw-links').style.display = 'none';    
        });

        document.querySelectorAll(".bw-links-li a").forEach(function(item){
            item.addEventListener("mouseover", function(e){
                e.target.style.textDecoration = 'underline';
            });
            item.addEventListener("mouseout", function(e){
                e.target.style.textDecoration = 'none';
            });
        });
        
    },
    toggle: function(){
        const element = document.getElementById('bw-links');
        element.style.display = element.style.display=='none' ? 'block':'none';
    }
};

(async function () {
    bw.links.init();
})();


