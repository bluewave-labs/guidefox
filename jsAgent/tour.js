console.log('tour.js is loaded');

const FLOATING_UI_CORE_URL = "https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.9";
const FLOATING_UI_DOM_URL = "https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.13";

bw.tour = {
    currentStep: 0,
    tourData: null,
    /**
     * Initializes the tour by asynchronously loading floating-ui libraries.
     * @param {function(boolean): void} cb - Callback function, called with true on success, false on failure.
     * @returns {void}
     */
    init : async function (cb) {
        const result = window.bwonboarddata.tour[0];
        const tourId = result.id;
        
         const styleElement = document.createElement('style');

        // 2. Define your CSS rules as a string
        const cssRules = `
            .bw-glowing-box {
                    border: 2px solid #7f56d9;
                    border-radius: 8px;
                    animation: purple-glow 1s infinite alternate;
                }

                @keyframes purple-glow {
                from {
                    box-shadow: 0 0 5px 2px rgba(138, 43, 226, 0.5);
                }
                to {
                    box-shadow: 0 0 5px 7px rgba(138, 43, 226, 0.8);
                }
            }
        `;

        styleElement.textContent = cssRules;
        document.head.appendChild(styleElement);


        bw.data.getTourById(tourId).then((tourData) => {
            console.log(tourData);
            bw.tour.tourData = tourData;
            cb && cb(tourData);
        }).catch((error) => {
            console.error('Error fetching tour data:', error);
            cb && cb(false);
        });
    },
    /**
     * Generates a dialog item.  Currently, this function is empty.
     * @returns {void}
     */
    showTour: function (tourData) {
        if (!tourData) {
            console.error('No tour data provided');
            return;
        }
       
        this.showDialog(bw.tour.currentStep);
    },
    createOverlay: function () {
        const overlay = document.createElement('div');
        overlay.id = 'bw-tour-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            `;
        return overlay;
    },
    createContainer: function () {
        const container = document.createElement('div');
        container.className = 'bw-tour-container';
        container.style.cssText = `
            border-radius: 8px;
            box-shadow: 2px 2px 10px 0px #0000000D;
            border: 1px solid #F0F0F0 !important;
            position: relative;
            max-width: 400px;
            width: 90%;
            z-index: 9999;
          `;     
        return container;
    },
    createHeader: function (textColor) {
        const header = document.createElement('div');
        header.className = 'header';
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            color: ${textColor};
          `;
        return header;
    },
    createHeaderH2: function (text) {
        const divH2 = document.createElement('div');
        divH2.id = 'bw-tour-header';
        divH2.textContent = text;
        divH2.style.cssText = `
                margin: 0;
            font-size: 20px;
            font-family: "Inter";
            font-weight: 600;
            `;
        return divH2;
    },
    createCloseButton: function () {
        const closeButton = `<svg id='bw-modal-close' focusable="false" viewBox="0 0 24 24" data-testid="CloseOutlinedIcon" 
            style="fill: rgb(152, 162, 179) !important; font-size: 20px !important; display: block !important; position: absolute !important; float: right !important; right: 23px !important; cursor: pointer !important; width: 20px !important; height: 20px !important; display: inline-block !important; margin: auto !important;">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>`

        return closeButton;
    },
    generateContent: function (content, textColor) {
        const p = document.createElement('p');
        p.id = 'bw-tour-description';
        p.innerHTML = content;
        p.style.cssText = `
            margin: 0px 20px 20px;
            min-height: 70px;
            font-family: 'Inter';
            font-size: 13px;
            font-weight: 400;
            color: ${textColor};
          `;
        return p;
    },
    generateBackButton: function () {
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = 'Previous';
        backButton.disabled = bw.tour.currentStep === 0;
        backButton.style.cssText = `
            background-color: #eee;
            color: rgb(181 167 167);
            margin-right: 10px;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            min-width: 128px;
          `;
        return backButton;
    },

    deHighlightOtherElements : function() {
        
        bw.tour.tourData.steps.forEach((step, index) => {
            if (index !== bw.tour.currentStep) {
                const targetElement = document.querySelector(step.targetElement);
                if (targetElement) {
                    targetElement.classList.remove('bw-glowing-box');
                }
            }
        });
    },
    generateNextButton: function () {
        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.textContent = 'Next';
        nextButton.disabled = bw.tour.currentStep === bw.tour.tourData.steps.length - 1;
        nextButton.style.cssText = `
            background-color: ${bw.tour.tourData.buttonBackgroundColor};
            color: ${bw.tour.tourData.buttonTextColor};
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            min-width: 128px;
          `;
        
        return nextButton;
    },
    /**
     * Generates a dialog item.
     * @returns {void}
     */
    generateDialog: function () {

        
        //adding overlay to the body with gray background and opacity
        // const overlay = bw.tour.createOverlay();
        // document.body.appendChild(overlay);
        
        // Create container
        const container = bw.tour.createContainer();
        document.body.appendChild(container);

        // Create header
        const header = bw.tour.createHeader(bw.tour.tourData.headerColor);
        container.appendChild(header);

        // Create heading (h2)
        const divH2 = bw.tour.createHeaderH2(bw.tour.tourData.steps[bw.tour.currentStep].header);
        header.appendChild(divH2);

        // Create close button
        const closeButton = bw.tour.createCloseButton(container);
        header.insertAdjacentHTML('beforeend', closeButton);
        document.getElementById('bw-modal-close').addEventListener('click', () => {
            container.remove();
        });

        // Create paragraph
        const p = bw.tour.generateContent(bw.tour.tourData.steps[bw.tour.currentStep].description, bw.tour.tourData.textColor);
        container.appendChild(p);

        // Create pagination
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        pagination.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
          `;
        container.appendChild(pagination);

        // Create indicators
        const numIndicators = bw.tour.tourData.steps.length;
        const indicators = [];
        for (let i = 0; i < numIndicators; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.style.cssText = `
              width: 23px;
              height: 5px;
              margin: 0 5px;
              border-radius: 2px;
              background-color: #ddd;
              cursor: pointer;
            `;
            if (i === 0) {
                indicator.classList.add('active');
                indicator.style.cssText += `background-color: #673ab7;`;
            }
            pagination.appendChild(indicator);
            indicators.push(indicator);
        }

        // Create footer (buttons container)
        const footer = document.createElement('div');
        footer.className = 'bw-tour-footer';
        footer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            background-color: #f8f8f8;
            border-top: 1px solid #ddd;
            padding: 15px 20px 15px 15px;
            width: 100%;
            box-sizing: border-box;
          `;
        container.appendChild(footer);

        // Create back button
        const backButton = bw.tour.generateBackButton();
        backButton.addEventListener('click', handleBack);
        footer.appendChild(backButton);

        // Create next button
        const nextButton = bw.tour.generateNextButton();
        nextButton.addEventListener('click', handleNext);
        footer.appendChild(nextButton);

        

        function setActiveIndicator(index) {
            indicators.forEach(indicator => indicator.style.backgroundColor = '#ddd');
            indicators[index].style.backgroundColor = '#673ab7';
            if (index === 0) {
                backButton.disabled = true;
                backButton.style.color =`rgb(181 167 167)`;
            }
            else if (index === indicators.length - 1) {
                nextButton.textContent = bw.tour.tourData.finalButtonText;
                backButton.disabled = false;
                backButton.style.color =`#333`;
            } else {
                nextButton.textContent = 'Next';
                backButton.disabled = false;
                backButton.style.color =`#333`;
            }
            updateData();
            updatePosition();
            
        }

        function updateData() {
            document.getElementById('bw-tour-header').textContent = bw.tour.tourData.steps[bw.tour.currentStep].header;
            document.getElementById('bw-tour-description').innerHTML = bw.tour.tourData.steps[bw.tour.currentStep].description;
        }

        function updatePosition() {
            const targetElement = document.querySelector(bw.tour.tourData.steps[bw.tour.currentStep].targetElement);
            //update container position according to target element with smooth animation transition
            const rect = targetElement.getBoundingClientRect();
            container.style.left = `${rect.left + window.scrollX}px`;
            container.style.top = `${rect.top + rect.height + 5 + window.scrollY }px` ;
            container.style.transform = `translate(-50%, 0%)`;
            container.style.position = `absolute`;
            container.style.backgroundColor = `#fff`;
            container.style.zIndex = `9999`;
            container.style.transition = `all 0.3s ease-in-out`;

            deHighlightOtherElements();
            highlightTatgetElement(targetElement);
        }

        function deHighlightOtherElements() {
        
            bw.tour.tourData.steps.forEach((step, index) => {
                if (index !== bw.tour.currentStep) {
                    const targetElement = document.querySelector(step.targetElement);
                    if (targetElement) {
                        targetElement.classList.remove('bw-glowing-box');
                    }
                }
            });
        }

        function highlightTatgetElement(targetElement){
            // highlight target element
            targetElement.classList.add('bw-glowing-box');
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                setActiveIndicator(index);
                bw.tour.currentStep = index;
            });
        });

        function handleBack() {
            bw.tour.currentStep = Math.max(0, bw.tour.currentStep - 1);
            setActiveIndicator(bw.tour.currentStep);
        }

        function handleNext() {
            if (bw.tour.currentStep === indicators.length - 1) {

                try {
                    const userId = bw.user.getUserID();
                    if (!userId) {
                        console.warn("Cannot send tour completion: user ID not available");
                    } else {
                        bw.data.sendData(bw.GuideType.TOUR, userId, true, bw.tour.tourData.id)
                            .catch(err => console.error("Failed to send tour completion data:", err));
                    }
                    console.log("Tour completed");

                    container.remove();
                    bw.tour.deHighlightOtherElements();
                    return;
                } catch (err) {
                    console.error("Error during tour completion:", err);
                    container.remove();
                    return;
                }

            }
            bw.tour.currentStep = Math.min(indicators.length - 1, bw.tour.currentStep + 1);
            setActiveIndicator(bw.tour.currentStep);
        }
        updatePosition();
        
        const handleReposition = () => {
            if (container.isConnected) { // Only update if the container is still in the DOM
                updatePosition();
            } else {
                // Clean up event listeners if container is removed
                window.removeEventListener('resize', handleReposition);
                window.removeEventListener('scroll', handleReposition);
            }
        };
        
        window.addEventListener('resize', handleReposition);
        window.addEventListener('scroll', handleReposition);
        
    },
    showDialog: function (index) {
        this.generateDialog(bw.tour.tourData.steps[index]);
    }
};

(function () {
    bw.tour.init((tourData) => {
        if (tourData) {
            console.log("Tour initialized successfully!");
            console.log(tourData);
            bw.tour.showTour(tourData);
        } else {
            console.warn("Tour initialization failed.");
        }
    });
})();