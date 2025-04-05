/*--- waitForKeyElements(): A utility function for Greasemonkey scripts
     that detects and handles AJAXed content.

     Usage example:
       waitForKeyElements("div.comments", commentCallbackFunction);

       function commentCallbackFunction(jNode) {
         jNode.text("This comment changed by waitForKeyElements().");
       }
*/

const waitForKeyElements = (selectorTxt, actionFunction, bWaitOnce = false, iframeSelector) => {
    let targetNodes = typeof iframeSelector === "undefined" ?
                      $(selectorTxt) :
                      $(iframeSelector).contents().find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        targetNodes.each(function() {
            const jThis = $(this);
            if (!jThis.data('alreadyFound')) {
                const cancelFound = actionFunction(jThis);
                if (!cancelFound) {
                    jThis.data('alreadyFound', true);
                }
            }
        });
    }

    const controlObj = waitForKeyElements.controlObj || {};
    const controlKey = selectorTxt.replace(/[^\w]/g, "_");
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
};