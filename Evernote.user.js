// ==UserScript==
// @name         evernote_font_change
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Evernote.com Date/Greeting replacement, font color change + CtrlQ shortcut for text color change
// @author       Igor Voloshanenko
// @match        https://www.evernote.com/client/*
// @icon         https://www.google.com/s2/favicons?domain=evernote.com
// @homepageURL  https://github.com/voloshanenko/Hints-for-Evernote
// @update       https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js
// @downloadURL  https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://github.com/voloshanenko/Hints-for-Evernote/raw/main/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    function getSelectedTextEndPosition() {
        var selection = $("#qa-COMMON_EDITOR_IFRAME")[0].contentWindow.getSelection();
        var range = selection.getRangeAt(0);
        var rects = range.getClientRects()
        return rects[rects.length - 1];
    };

    async function simulateMouseClick(el) {
        let opts = {view: window, bubbles: true, cancelable: true, buttons: 1};
        el.dispatchEvent(new MouseEvent("mousedown", opts));
        await new Promise(r => setTimeout(r, 50));
        el.dispatchEvent(new MouseEvent("mouseup", opts));
        el.dispatchEvent(new MouseEvent("click", opts));
    };

    function ClickElement(jNode){
        jNode.trigger("click");
    };

    function MoveElement(jNode){
        var node_width = jNode.outerWidth();
        var textPos = getSelectedTextEndPosition();
        var newTop = textPos.top + textPos.height*0.75
        var newLeft = textPos.left - node_width*2 + textPos.width/2 + textPos.width/4 + textPos.width/8
        jNode.css({ "position": "relative", "top": newTop, "left": newLeft });
    }

    function onCtrlQ() {
        var colorpicker = $("#qa-FONTCOLOR_DROPDOWN");
        waitForKeyElements ("#rgb\\(252\\,\\ 18\\,\\ 51\\) > div", ClickElement, true);
        simulateMouseClick(colorpicker[0]);
    };

    function onCtrlShiftQ() {
        var highlight_colorpicker = $("#qa-HIGHLIGHT_LABEL > div > svg");
        waitForKeyElements ("#qa-GREEN_COLOR_LABEL > div", ClickElement, true);
        simulateMouseClick(highlight_colorpicker[0]);
    };

    function onCtrlShiftE() {
        var highlight_colorpicker = $("#qa-HIGHLIGHT_LABEL > div > svg");
        simulateMouseClick(highlight_colorpicker[0]);
        waitForKeyElements ("#qa-ACTIONS_MODAL", MoveElement, true);
    };

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 81) {
            onCtrlShiftQ();
        }else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 69) {
            onCtrlShiftE();
        }else if(evt.ctrlKey && evt.keyCode == 81){
            onCtrlQ();
        }
    }

    function replaceElementAndChangeFont(jNode) {
        var CurrentDate = $("#qa-HOME_SUBTITLE");
        CurrentDate.css({
                fontSize: 20,
                color: "green"
        });

        if (jNode) {
            jNode[0].parentNode.replaceChild(CurrentDate[0], jNode[0]);
        }
    };

    //ReplaceCurrentDateField
    waitForKeyElements ("#qa-HOME_TITLE", replaceElementAndChangeFont);
    //Add keyboard handler
    document.addEventListener('keydown', onKeydown, true);

})();
