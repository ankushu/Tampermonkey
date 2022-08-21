// ==UserScript==
// @name         toggleFeatures
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Toggle features in SAFe Planning board
// @author       Ankush Agrawal
// @match        https://*.service-now.com/*safe_board.do*
// @match        https://*.servicenow.com/*safe_board.do*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var iter = 0;
    $j(".accordion-toggle").click();
})();