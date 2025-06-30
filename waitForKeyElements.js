/*--- waitForKeyElements(): A utility function for Greasemonkey scripts
     that detects and handles AJAXed content.

     Usage example:
       waitForKeyElements("div.comments", commentCallbackFunction);

       function commentCallbackFunction(jNode) {
         jNode.text("This comment changed by waitForKeyElements().");
       }

     Enhanced version with improved error handling and performance.
*/

/* eslint-disable no-redeclare, no-unused-vars */
const waitForKeyElements = (selectorTxt, actionFunction, bWaitOnce = false, iframeSelector) => {
    try {
        let targetNodes;

        if (typeof iframeSelector === 'undefined') {
            targetNodes = $(selectorTxt);
        } else {
            const iframe = $(iframeSelector);
            if (iframe.length > 0 && iframe[0].contentDocument) {
                targetNodes = $(iframe[0].contentDocument).find(selectorTxt);
            } else {
                targetNodes = $();
            }
        }

        if (targetNodes && targetNodes.length > 0) {
            targetNodes.each(function () {
                try {
                    const jThis = $(this);
                    if (!jThis.data('alreadyFound')) {
                        const cancelFound = actionFunction(jThis);
                        if (!cancelFound) {
                            jThis.data('alreadyFound', true);
                        }
                    }
                } catch (error) {
                    console.error('[waitForKeyElements] Error in actionFunction:', error);
                }
            });
        }

        const controlObj = waitForKeyElements.controlObj || {};
        const controlKey = selectorTxt.replace(/[^\w]/g, '_');
        let timeControl = controlObj[controlKey];

        if (targetNodes && targetNodes.length > 0 && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else if (!timeControl) {
            timeControl = setInterval(() => {
                waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
            }, 10);
            controlObj[controlKey] = timeControl;
        }

        waitForKeyElements.controlObj = controlObj;
    } catch (error) {
        console.error('[waitForKeyElements] Critical error:', error);
    }
};
