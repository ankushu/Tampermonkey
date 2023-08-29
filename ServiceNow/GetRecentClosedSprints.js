// ==UserScript==
// @name         GetRecentClosedSprints
// @namespace    https://www.linkedin.com/in/ankush-agrawal-529033a/
// @version      0.1
// @description  Get recently closed sprints
// @author       ankush.agrawal
// @match        https://surf.service-now.com/*rm_story*
// @match        https://surf.service-now.com/*sn_safe_story*
// @match        https://my.servicenow.com/*story*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    $j.get('/api/now/table/rm_sprint?sysparm_query=assignment_group=' + g_form.getValue('assignment_group') + '^state=3^closed_at>=javascript:gs.beginningOfLastMonth()&sysparm_fields=short_description,sys_id,end_date', function (data) {
        var sortedArr = data.result.sort(function (a, b) {
            return a.end_date > b.end_date ? -1 : 1;
        }).map(e => {
            return e.short_description + ' - ' + e.sys_id;
        });

        console.log(sortedArr.join('\n'));
    });
})();
