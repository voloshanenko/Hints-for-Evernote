// ==UserScript==
// @name         Hints for Evernote
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Enhanced Evernote experience with improved keyboard shortcuts, text formatting tools, and UI enhancements
// @author       Igor Voloshanenko
// @match        https://www.evernote.com/client/*
// @icon         https://www.google.com/s2/favicons?domain=evernote.com
// @homepageURL  https://github.com/voloshanenko/Hints-for-Evernote
// @updateURL    https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js
// @downloadURL  https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://github.com/voloshanenko/Hints-for-Evernote/raw/main/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// ==/UserScript==

(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        verbose: GM_getValue('verbose', true),
        customColors: {
            primary: GM_getValue('primaryColor', 'rgb(252, 18, 51)'),
            highlight: GM_getValue('highlightColor', 'green'),
        },
        delays: {
            mouseClick: 50,
            waitInterval: 10,
        },
    };

    // Utility functions
    const log = (message, data = null) => {
        if (CONFIG.verbose) {
            console.log(`[Hints for Evernote] ${message}`, data);
        }
    };

    const showNotification = (text, title = 'Hints for Evernote') => {
        if (GM_notification) {
            GM_notification(text, title, null, () => {});
        }
    };

    // Error handling wrapper
    const safeExecute = (fn, context = 'Unknown') => {
        try {
            return fn();
        } catch (error) {
            console.error(`[Hints for Evernote] Error in ${context}:`, error);
            showNotification(`Error in ${context}: ${error.message}`);
            return null;
        }
    };

    // Calculate the distance between two elements.
    const getDistance = (obj1, obj2, ignoreObj1 = false) => {
        const pos1 = getRelativePos(obj1);
        const pos2 = getRelativePos(obj2);
        const dx = ignoreObj1 ? -pos2.offsetLeft : pos1.offsetLeft - pos2.offsetLeft;
        const dy = ignoreObj1 ? -pos2.offsetTop : pos1.offsetTop - pos2.offsetTop;
        return { x: dx, y: dy };
    };

    // Calculate relative position of an element.
    const getRelativePos = obj => {
        const pos = { offsetLeft: 0, offsetTop: 0 };
        while (obj) {
            pos.offsetLeft += obj.offsetLeft;
            pos.offsetTop += obj.offsetTop;
            obj = obj.offsetParent || obj.parentElement;
        }
        return pos;
    };

    // Get the last rectangle from the current selection in the editor iframe.
    const getTextPosition = iframe => {
        const selection = iframe[0].contentWindow.getSelection();
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        return rects[rects.length - 1];
    };

    // Get the bounding rectangle of the editor view element.
    const getEditorViewPosition = iframe => {
        const editorElem = iframe[0].contentWindow.document.querySelector('#en-note');
        return editorElem.getBoundingClientRect();
    };

    // Simulate a mouse click on an element with improved error handling
    const simulateMouseClick = async el => {
        return safeExecute(async () => {
            if (!el) {
                throw new Error('Element is null or undefined');
            }

            const opts = {
                view: document.defaultView,
                bubbles: true,
                cancelable: true,
                buttons: 1,
            };

            el.dispatchEvent(new MouseEvent('mousedown', opts));
            await new Promise(r => setTimeout(r, CONFIG.delays.mouseClick));
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.dispatchEvent(new MouseEvent('click', opts));

            log('MouseClick simulated', el);
            return true;
        }, 'simulateMouseClick');
    };

    // Simulate a mouseover event with improved error handling
    const simulateMouseOver = el => {
        return safeExecute(() => {
            const element = el && el[0] ? el[0] : el;
            if (!element) {
                throw new Error('Element is null or undefined');
            }

            const opts = {
                view: document.defaultView,
                bubbles: true,
                cancelable: true,
                buttons: 0,
            };

            element.dispatchEvent(new MouseEvent('mouseover', opts));
            log('MouseOver simulated', element);
            return true;
        }, 'simulateMouseOver');
    };

    // Click an element using jQuery trigger.
    const clickElement = jNode => {
        jNode.trigger('click');
        log('Element Clicked', jNode[0]);
    };

    // Calculate and adjust the position of a menu element.
    const moveElement = jNode => {
        let leftSubmenuCorrection = false;
        // Handle special case for colorPicker and Highlight dialogs from submenu.
        if (jNode.attr('id') === 'null_outer' || jNode.attr('id') === 'highlight_clear_outer') {
            log(`Special element ID detected: '${jNode.attr('id')}'`);
            jNode = jNode.parent().parent().parent();
            leftSubmenuCorrection = true;
        }

        const editorIframe = $('#qa-COMMON_EDITOR_IFRAME');
        const distance = getDistance(jNode[0], editorIframe[0], leftSubmenuCorrection);
        const nodeWidth = jNode.outerWidth();
        const textPosition = getTextPosition(editorIframe);
        const editorPosition = getEditorViewPosition(editorIframe);

        const needCorrection = editorPosition.right - textPosition.right - nodeWidth * 1.125;
        const leftCorrection = needCorrection > 0 ? 5 : needCorrection;
        const topCorrection = leftSubmenuCorrection
            ? textPosition.height
            : textPosition.height * 1.25;

        const newLeft = textPosition.right - distance.x + leftCorrection;
        const newTop = textPosition.top - distance.y + topCorrection;

        jNode.css({
            position: 'relative',
            top: newTop,
            left: newLeft,
        });

        log('Element moved', jNode[0]);

        const submenuElements = $('#qa-ACTIONS_MODAL ul');
        if (submenuElements.length === 2) {
            log('Submenu open, hiding it');
            submenuElements.eq(0).css({
                display: 'none',
                visibility: 'hidden',
            });
        }
    };

    // Specific actions for text color and highlight manipulation.
    const textColorSpecific = () => {
        processEvernoteMenuElement(
            '#qa-FONTCOLOR_DROPDOWN',
            '#rgb\\(252\\,\\ 18\\,\\ 51\\) > div',
            '#fontcolor > div',
            '#rgb\\(252\\,\\ 18\\,\\ 51\\) > div',
            clickElement
        );
    };

    const textHighlightSpecific = () => {
        processEvernoteMenuElement(
            '#qa-HIGHLIGHT_LABEL > div > svg',
            '#qa-GREEN_COLOR_LABEL > div',
            '#highlight > div',
            '#qa-GREEN_COLOR_LABEL > div',
            clickElement
        );
    };

    const textColorPicker = () => {
        processEvernoteMenuElement(
            '#qa-FONTCOLOR_DROPDOWN',
            '#qa-ACTIONS_MODAL',
            '#fontcolor > div',
            '#qa-ACTIONS_MODAL ul#default_dropdown_id > div#null_outer',
            moveElement
        );
    };

    const textHighlightPicker = () => {
        processEvernoteMenuElement(
            '#qa-HIGHLIGHT_LABEL > div > svg',
            '#qa-ACTIONS_MODAL',
            '#highlight > div',
            '#qa-ACTIONS_MODAL ul#default_dropdown_id > div#highlight_clear_outer',
            moveElement
        );
    };

    const overflowSubmenu = () => {
        const submenuExist = $('#qa-ACTIONS_MODAL > div > ul#default_dropdown_id');
        if (submenuExist.length === 0) {
            const overflowButtonIdentifier = '#qa-OVERFLOW_BTN > div > div';
            const moreSubmenuElement = $(overflowButtonIdentifier);
            if (moreSubmenuElement.length > 0) {
                waitForKeyElements('#qa-ACTIONS_MODAL', moveElement, true);
                simulateMouseClick(moreSubmenuElement[0]);
            } else {
                console.error(`Overflow button element '${overflowButtonIdentifier}' not found.`);
            }
        }
    };

    // Generalized function to process Evernote menu elements.
    const processEvernoteMenuElement = (
        elementIdentifier,
        waitForIdentifier,
        submenuIdentifier,
        submenuWaitForIdentifier,
        actionFunction
    ) => {
        const overflowButtonIdentifier = '#qa-OVERFLOW_BTN > div > div';
        const element = $(elementIdentifier);
        const moreSubmenuElement = $(overflowButtonIdentifier);

        if (!element[0]) {
            log(
                `Element not available, clicking '${overflowButtonIdentifier}' button`,
                moreSubmenuElement[0]
            );
            if (moreSubmenuElement.length > 0) {
                simulateMouseClick(moreSubmenuElement[0]);
                waitForKeyElements(submenuIdentifier, simulateMouseOver, true);
                waitForKeyElements(submenuWaitForIdentifier, actionFunction, true);
            } else {
                console.error(`Element '${overflowButtonIdentifier}' not found.`);
            }
        } else {
            simulateMouseClick(element[0]);
            waitForKeyElements(waitForIdentifier, actionFunction, true);
        }
    };

    // Keyboard shortcut handler with improved layout independence and help system
    const onKeydown = evt => {
        return safeExecute(() => {
            const os = detectOS();
            const code = evt.code;
            const ctrl = evt.ctrlKey;
            const shift = evt.shiftKey;
            const alt = evt.altKey;

            // Only respond when Ctrl is held (regardless of layout)
            if (!ctrl) return;

            // Help system: Ctrl+Alt+H
            if (alt && code === 'KeyH') {
                showHelp();
                evt.preventDefault();
                return;
            }

            // Cross-platform shortcuts
            const shortcuts = {
                // Text color picker: Ctrl+Shift+Q
                textColorPicker: shift && code === 'KeyQ',
                // Text color specific: Ctrl+Q
                textColorSpecific: !shift && code === 'KeyQ',
                // Text highlight specific: Ctrl+E (direct green highlight)
                textHighlightSpecific: !shift && code === 'KeyE',
                // Overflow submenu: Ctrl+G
                overflowSubmenu: !shift && code === 'KeyG',
                // Text highlight picker: Ctrl+Shift+W (macOS) or Ctrl+Shift+E (Windows)
                textHighlightPicker:
                    shift &&
                    ((os === 'MacOS' && code === 'KeyW') || (os === 'Windows' && code === 'KeyE')),
            };

            // Execute the appropriate action
            Object.entries(shortcuts).forEach(([action, condition]) => {
                if (condition) {
                    evt.preventDefault();
                    log(`Executing ${action} on ${os}`);

                    switch (action) {
                    case 'textColorPicker':
                        textColorPicker();
                        break;
                    case 'textColorSpecific':
                        textColorSpecific();
                        break;
                    case 'textHighlightSpecific':
                        textHighlightSpecific();
                        break;
                    case 'overflowSubmenu':
                        overflowSubmenu();
                        break;
                    case 'textHighlightPicker':
                        textHighlightPicker();
                        break;
                    }
                }
            });
        }, 'onKeydown');
    };

    // Help system
    const showHelp = () => {
        const os = detectOS();
        const helpText = `
Keyboard Shortcuts for Evernote Enhancement:

• Ctrl+Q: Apply red text color
• Ctrl+E: Apply green highlight
• Ctrl+Shift+Q: Open text color picker
• Ctrl+G: Open overflow submenu
• Ctrl+Shift+${os === 'MacOS' ? 'W' : 'E'}: Open highlight picker
• Ctrl+Alt+H: Show this help

Current OS: ${os}
        `.trim();

        showNotification(helpText, 'Keyboard Shortcuts Help');
        console.log(`[Hints for Evernote] ${helpText}`);
    };

    // Replace an element and change font settings.
    const replaceElementAndChangeFont = jNode => {
        const currentDate = $('#qa-HOME_SUBTITLE');
        currentDate.css({
            fontSize: 20,
            color: 'green',
        });
        if (jNode) {
            jNode[0].parentNode.replaceChild(currentDate[0], jNode[0]);
        }
    };

    // Enhanced OS detection with more reliable methods
    const detectOS = () => {
        const platform = navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();

        if (platform.includes('mac') || userAgent.includes('mac')) return 'MacOS';
        if (platform.includes('win') || userAgent.includes('win')) return 'Windows';
        if (platform.includes('linux') || userAgent.includes('linux')) return 'Linux';
        if (platform.includes('freebsd') || userAgent.includes('freebsd')) return 'FreeBSD';

        // Fallback to original method
        const appVersion = navigator.appVersion;
        if (appVersion.includes('Win')) return 'Windows';
        if (appVersion.includes('Mac')) return 'MacOS';
        if (appVersion.includes('X11')) return 'UNIX';
        if (appVersion.includes('Linux')) return 'Linux';

        return 'Unknown';
    };

    // Add custom styles for better UX
    const addCustomStyles = () => {
        GM_addStyle(`
            /* Enhanced Evernote styling */
            .hints-evernote-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                max-width: 300px;
            }
            
            .hints-evernote-help {
                background: #2196F3 !important;
                white-space: pre-line;
                font-size: 12px;
                line-height: 1.4;
            }
        `);
    };

    // Initialize the script with proper error handling
    const initialize = () => {
        return safeExecute(() => {
            log('Initializing Hints for Evernote script');

            // Add custom styles
            addCustomStyles();

            // Replace element and add keyboard listener
            waitForKeyElements('#qa-HOME_TITLE', replaceElementAndChangeFont);
            document.addEventListener('keydown', onKeydown, true);

            // Show initialization notification
            showNotification('Hints for Evernote loaded successfully! Press Ctrl+Alt+H for help.');

            log('Script initialized successfully');
        }, 'initialize');
    };

    // Start the script
    initialize();
})();
