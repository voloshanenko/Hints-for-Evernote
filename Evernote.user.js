// ==UserScript==
// @name         evernote_font_change
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Evernote.com Date/Greeting replacement, font color change + CtrlQ shortcut for text color change
// @author       Igor Voloshanenko
// @match        https://www.evernote.com/client/*
// @icon         https://www.google.com/s2/favicons?domain=evernote.com
// @homepageURL  https://github.com/voloshanenko/Hints-for-Evernote
// @updateURL    https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js
// @downloadURL  https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://github.com/voloshanenko/Hints-for-Evernote/raw/main/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==

(() => {
    'use strict';

    const verbose = true;

    const log = (message, data = null) => {
        if (verbose) {
            console.log(message, data);
        }
    };

    // Calculate the distance between two elements
    const getDistance = (obj1, obj2, ignoreObj1 = false) => {
        const pos1 = getRelativePos(obj1);
        const pos2 = getRelativePos(obj2);
        const dx = ignoreObj1 ? -pos2.offsetLeft : pos1.offsetLeft - pos2.offsetLeft;
        const dy = ignoreObj1 ? -pos2.offsetTop : pos1.offsetTop - pos2.offsetTop;
        return { x: dx, y: dy };
    };

    // Calculate relative position of an element
    const getRelativePos = (obj) => {
        let pos = { offsetLeft: 0, offsetTop: 0 };
        while (obj) {
            pos.offsetLeft += obj.offsetLeft;
            pos.offsetTop += obj.offsetTop;
            obj = obj.offsetParent || obj.parentElement;
        }
        return pos;
    };

    // Get the last rectangle from the current selection in the editor iframe
    const getTextPosition = (iframe) => {
        const selection = iframe[0].contentWindow.getSelection();
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        return rects[rects.length - 1];
    };

    // Get the bounding rectangle of the editor view element
    const getEditorViewPosition = (iframe) => {
        const editorElem = iframe[0].contentWindow.document.querySelector("#en-note");
        return editorElem.getBoundingClientRect();
    };

    // Simulate a mouse click on an element
    const simulateMouseClick = async (el) => {
        const opts = { view: window, bubbles: true, cancelable: true, buttons: 1 };
        el.dispatchEvent(new MouseEvent("mousedown", opts));
        await new Promise(r => setTimeout(r, 50));
        el.dispatchEvent(new MouseEvent("mouseup", opts));
        el.dispatchEvent(new MouseEvent("click", opts));
        log("MouseClick simulated", el);
    };

    // Simulate a mouseover event
    const simulateMouseOver = (el) => {
        const opts = { view: window, bubbles: true, cancelable: true, buttons: 0 };
        el[0].dispatchEvent(new MouseEvent("mouseover", opts));
        log("MouseOver simulated", el[0]);
    };

    // Click an element using jQuery trigger
    const clickElement = (jNode) => {
        jNode.trigger("click");
        log("Element Clicked", jNode[0]);
    };

    // Calculate and adjust the position of a menu element
    const moveElement = (jNode) => {
        let leftSubmenuCorrection = false;
        // Handle special case for colorPicker and Highlight dialogs from submenu
        if (jNode.attr('id') === "null_outer" || jNode.attr('id') === "highlight_clear_outer") {
            log(`Special element ID detected: '${jNode.attr('id')}'`);
            jNode = jNode.parent().parent().parent();
            leftSubmenuCorrection = true;
        }

        const editorIframe = $("#qa-COMMON_EDITOR_IFRAME");
        const distance = getDistance(jNode[0], editorIframe[0], leftSubmenuCorrection);
        const nodeWidth = jNode.outerWidth();
        const textPosition = getTextPosition(editorIframe);
        const editorPosition = getEditorViewPosition(editorIframe);

        const needCorrection = editorPosition.right - textPosition.right - nodeWidth * 1.125;
        const leftCorrection = needCorrection > 0 ? 5 : needCorrection;
        const topCorrection = leftSubmenuCorrection ? textPosition.height : textPosition.height * 1.25;

        const newLeft = textPosition.right - distance.x + leftCorrection;
        const newTop = textPosition.top - distance.y + topCorrection;

        jNode.css({
            position: "relative",
            top: newTop,
            left: newLeft
        });

        log("Element moved", jNode[0]);

        const submenuElements = $("#qa-ACTIONS_MODAL ul");
        if (submenuElements.length === 2) {
            log("Submenu open, hiding it");
            submenuElements.eq(0).css({
                display: "none",
                visibility: "hidden"
            });
        }
    };

    // Specific actions for text color and highlight manipulation
    const textColorSpecific = () => {
        processEvernoteMenuElement(
            "#qa-FONTCOLOR_DROPDOWN",
            "#rgb\\(252\\,\\ 18\\,\\ 51\\) > div",
            "#fontcolor > div",
            "#rgb\\(252\\,\\ 18\\,\\ 51\\) > div",
            clickElement
        );
    };

    const textHighlightSpecific = () => {
        processEvernoteMenuElement(
            "#qa-HIGHLIGHT_LABEL > div > svg",
            "#qa-GREEN_COLOR_LABEL > div",
            "#highlight > div",
            "#qa-GREEN_COLOR_LABEL > div",
            clickElement
        );
    };

    const textColorPicker = () => {
        processEvernoteMenuElement(
            "#qa-FONTCOLOR_DROPDOWN",
            "#qa-ACTIONS_MODAL",
            "#fontcolor > div",
            "#qa-ACTIONS_MODAL ul#default_dropdown_id > div#null_outer",
            moveElement
        );
    };

    const textHighlightPicker = () => {
        processEvernoteMenuElement(
            "#qa-HIGHLIGHT_LABEL > div > svg",
            "#qa-ACTIONS_MODAL",
            "#highlight > div",
            "#qa-ACTIONS_MODAL ul#default_dropdown_id > div#highlight_clear_outer",
            moveElement
        );
    };

    const overflowSubmenu = () => {
        const submenuExist = $("#qa-ACTIONS_MODAL > div > ul#default_dropdown_id");
        if (submenuExist.length === 0) {
            const overflowButtonIdentifier = "#qa-OVERFLOW_BTN > div > div";
            const moreSubmenuElement = $(overflowButtonIdentifier);
            waitForKeyElements("#qa-ACTIONS_MODAL", moveElement, true);
            simulateMouseClick(moreSubmenuElement[0]);
        }
    };

    // Generalized function to process Evernote menu elements
    const processEvernoteMenuElement = (elementIdentifier, waitForIdentifier, submenuIdentifier, submenuWaitForIdentifier, actionFunction) => {
        const overflowButtonIdentifier = "#qa-OVERFLOW_BTN > div > div";
        const element = $(elementIdentifier);

        if (!element[0]) {
            log(`Element not available, clicking '${overflowButtonIdentifier}' button`);
            const moreSubmenuElement = $(overflowButtonIdentifier);
            simulateMouseClick(moreSubmenuElement[0]);
            waitForKeyElements(submenuIdentifier, simulateMouseOver, true);
            waitForKeyElements(submenuWaitForIdentifier, actionFunction, true);
        } else {
            simulateMouseClick(element[0]);
            waitForKeyElements(waitForIdentifier, actionFunction, true);
        }
    };

    // Keyboard shortcut handler
    const onKeydown = (evt) => {
        const os = detectOS();
        const key = evt.key.toLowerCase();

        if (os === "MacOS") {
            if (evt.ctrlKey && evt.shiftKey && key === 'q') {
                textColorPicker();
            } else if (evt.ctrlKey && evt.shiftKey && key === 'w') {
                textHighlightPicker();
            } else if (evt.ctrlKey && key === 'q') {
                textColorSpecific();
            } else if (evt.ctrlKey && key === 'g') {
                overflowSubmenu();
            }
        } else if (os === "Windows") {
            if (evt.ctrlKey && evt.shiftKey && key === 'q') {
                textColorPicker();
            } else if (evt.ctrlKey && evt.shiftKey && key === 'e') {
                textHighlightPicker();
            } else if (evt.ctrlKey && key === 'q') {
                textColorSpecific();
            } else if (evt.ctrlKey && key === 'g') {
                overflowSubmenu();
            }
        }
    };

    // Replace an element and change font settings
    const replaceElementAndChangeFont = (jNode) => {
        const currentDate = $("#qa-HOME_SUBTITLE");
        currentDate.css({
            fontSize: 20,
            color: "green"
        });
        if (jNode) {
            jNode[0].parentNode.replaceChild(currentDate[0], jNode[0]);
        }
    };

    // Simple OS detection based on navigator.appVersion
    const detectOS = () => {
        const appVersion = navigator.appVersion;
        if (appVersion.indexOf("Win") !== -1) return "Windows";
        if (appVersion.indexOf("Mac") !== -1) return "MacOS";
        if (appVersion.indexOf("X11") !== -1) return "UNIX";
        if (appVersion.indexOf("Linux") !== -1) return "Linux";
        return "Unknown";
    };

    // Initialize: Replace element and add keyboard listener
    waitForKeyElements("#qa-HOME_TITLE", replaceElementAndChangeFont);
    document.addEventListener('keydown', onKeydown, true);

})();