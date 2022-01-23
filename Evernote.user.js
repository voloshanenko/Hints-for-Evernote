// ==UserScript==
// @name         evernote_font_change
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Evernote.com Date/Greeting replacement, font color change + CtrlQ shortcut for text color change
// @author       Igor Voloshanenko
// @match        https://www.evernote.com/client/*
// @icon         https://www.google.com/s2/favicons?domain=evernote.com
// @homepageURL  https://github.com/voloshanenko/Hints-for-Evernote
// @update       https://github.com/voloshanenko/Hints-for-Evernote/raw/master/dist/Evernote.user.js
// @downloadURL  https://github.com/voloshanenko/Hints-for-Evernote/raw/master/dist/Evernote.user.js
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
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

    function onCtrlQ() {
        var selection = $("#qa-COMMON_EDITOR_IFRAME")[0].contentWindow.getSelection();
        var node = selection.anchorNode
        var textRange = selection.getRangeAt(0);
        var contents = textRange.cloneContents();

        if (contents.childNodes.length == 1 && contents.childNodes[0].nodeName == "#text"){
            var span = document.createElement("span");
            span.setAttribute('style', '--darkmode-color: rgb(255, 49, 78); --lightmode-color: rgb(252, 18, 51);');
            span.className = "UrtAp";
            span.appendChild(contents.childNodes[0]);
            //textRange.insertNode(span);
            textRange.deleteContents();
            textRange.insertNode(span);
        };

        //<span style="--darkmode-color: rgb(255, 49, 78); --lightmode-color: rgb(252, 18, 51);" class="UrtAp">За прошедшие 15-20 лет</span>
        //node.parentNode.replaceChild(span, node);

    }

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.ctrlKey && evt.keyCode == 81) {
            onCtrlQ();
        }
    }

    function replaceElementAndChangeFont (jNode) {

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
