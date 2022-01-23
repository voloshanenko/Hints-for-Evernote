// ==UserScript==
// @name         evernote_font_change
// @namespace    http://tampermonkey.net/
// @version      0.7
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

    function getSelectedNode() {
    var node,selection;

    if (window.getSelection) {
      selection = getSelection();
      node = selection.anchorNode;
    }
    if (!node && document.selection) {
        selection = document.selection
        var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
        node = range.commonAncestorContainer ? range.commonAncestorContainer :
               range.parentElement ? range.parentElement() : range.item(0);
    }
    if (node) {
      return (node.nodeName == "#text" ? node.parentNode : node);
      //test
    }
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

    function onCtrlQ() {
        var colorpicker = $("#qa-FONTCOLOR_DROPDOWN");
        waitForKeyElements ("#rgb\\(252\\,\\ 18\\,\\ 51\\) div", ClickElement, true);
        simulateMouseClick(colorpicker[0]);
    };

    function onShiftCtrlQ() {
        var highlight_colorpicker = $("#qa-HIGHLIGHT_TEXT_BTN");
        waitForKeyElements ("#qa-GREEN_COLOR_LABEL div", ClickElement, true);
        simulateMouseClick(highlight_colorpicker[0]);
    };

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.shiftKey && evt.ctrlKey && evt.keyCode == 81) {
            onShiftCtrlQ();
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
