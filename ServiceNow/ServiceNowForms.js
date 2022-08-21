// ==UserScript==
// @name         ServiceNowForms
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add quick to copy link and sysID
// @author       Ankush Agrawal
// @match        https://*.service-now.com/*.do*
// @match        https://*.servicenow.com/*.do*
// @match        http://localhost:8080/*.do*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    if(typeof g_form === "undefined" || !g_form)
        return;
    var nodeHeader = $j('span[id*="section_head_right"]');
    var nodeCopyURL = document.createElement('span');
    var baseUrl = window.location.href.split('/').slice(0, 3).join('/'),
        table = g_form.getTableName(),
        sysID = g_form.getUniqueValue();
    var url = baseUrl + '/' + table + '.do?sys_id=' + sysID;
    nodeHeader.append('<a class="icon-link" style="margin: 0.5em" onClick="copyToClipboard(\'' + url + '\')"></a>');
    nodeHeader.append('<a class="icon-key" style="margin: 0.5em" onClick="copyToClipboard(\'' + sysID + '\')"></a>');
})();