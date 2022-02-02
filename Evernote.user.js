// ==UserScript==
// @name         evernote_font_change
// @namespace    http://tampermonkey.net/
// @version      0.13
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

    function getDistance(obj1, obj2){
        var pos1 = getRelativePos(obj1);
        var pos2 = getRelativePos(obj2);
        var dx = pos1.offsetLeft - pos2.offsetLeft;
        var dy = pos1.offsetTop - pos2.offsetTop;
        return {x:dx, y:dy};
    };

    function getRelativePos(obj){
        var pos = {offsetLeft:0,offsetTop:0};
        while(obj!=null){
            pos.offsetLeft += obj.offsetLeft;
            pos.offsetTop += obj.offsetTop;
            obj = obj.offsetParent || obj.parentElement;
        }
        return pos;
    };

    function getTextPosition(iframe) {
        var selection, range, rects;
        selection = iframe[0].contentWindow.getSelection();
        range = selection.getRangeAt(0);
        rects = range.getClientRects()
        return rects[rects.length - 1];
    };

    function getEditorViewPosition(iframe) {
        var editor_elem, position;
        editor_elem = iframe[0].contentWindow.document.querySelector("#en-note");
        position = editor_elem.getBoundingClientRect();
        return position;
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
        var nodeWidth, editorIframe, distance,
            textPosition, editorPosition;

        editorIframe = $("#qa-COMMON_EDITOR_IFRAME")
        distance = getDistance(jNode[0], editorIframe[0]);

        nodeWidth = jNode.outerWidth();
        textPosition = getTextPosition(editorIframe);
        editorPosition = getEditorViewPosition(editorIframe);

        var needCorrection, leftCorrection, topCorrection, newLeft, newTop
        // Check if new element poisition still inside editor border
        needCorrection = editorPosition.right - textPosition.right - nodeWidth*1.125;
        leftCorrection = needCorrection > 0 ? 5: needCorrection;
        topCorrection = textPosition.height*1.25

        newLeft = textPosition.right - distance.x + leftCorrection;
        newTop = textPosition.top + topCorrection

        jNode.css({ "position": "relative",
                   "top": newTop,
                   "left": newLeft
                  });
    };

    function textColorSpecific() {
        var colorpicker = $("#qa-FONTCOLOR_DROPDOWN");
        waitForKeyElements ("#rgb\\(252\\,\\ 18\\,\\ 51\\) > div", ClickElement, true);
        simulateMouseClick(colorpicker[0]);
    };

    function textHighlightSpecific() {
        var highlight_colorpicker = $("#qa-HIGHLIGHT_LABEL > div > svg");
        waitForKeyElements ("#qa-GREEN_COLOR_LABEL > div", ClickElement, true);
        simulateMouseClick(highlight_colorpicker[0]);
    };

    function textColorPicker() {
        var colorpicker = $("#qa-FONTCOLOR_DROPDOWN");
        waitForKeyElements ("#qa-ACTIONS_MODAL", MoveElement, true);
        simulateMouseClick(colorpicker[0]);
    };

    function textHighlightPicker() {
        var highlight_colorpicker = $("#qa-HIGHLIGHT_LABEL > div > svg");
        waitForKeyElements ("#qa-ACTIONS_MODAL", MoveElement, true);
        simulateMouseClick(highlight_colorpicker[0]);
    };

    function onKeydown(evt) {
        //detect OS
        var os = detectOS();
        // Use https://keycode.info/ to get keys
        if (os == "MacOS"){
            if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 81) {
                // Ctrl + Shift + Q
                textColorPicker();
            }else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 87) {
                // Ctrl + shift + W
                textHighlightPicker();
            }else if(evt.ctrlKey && evt.keyCode == 81){
                // Ctrl + Q
                textColorSpecific();
            }
        }else if (os === "Windows"){
            if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 81) {
                // Ctrl + Shift + Q
                textColorPicker();
            }else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 69) {
                // Ctrl + Shift + E
                textHighlightPicker();
            }else if(evt.ctrlKey && evt.keyCode == 81){
                // Ctrl + Q
                textColorSpecific();
            }
        }
    };

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

    function detectOS(){
        var os = "Unknown";
        if (navigator.appVersion.indexOf("Win") != -1) os = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) os = "MacOS";
        if (navigator.appVersion.indexOf("X11") != -1) os = "UNIX";
        if (navigator.appVersion.indexOf("Linux") != -1) os = "Linux";
        return os;
    };

    //ReplaceCurrentDateField
    waitForKeyElements ("#qa-HOME_TITLE", replaceElementAndChangeFont);
    //Add keyboard handler
    document.addEventListener('keydown', onKeydown, true);

})();
