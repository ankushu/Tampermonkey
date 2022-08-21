// ==UserScript==
// @name         StoryPointsInBoard
// @namespace    https://www.linkedin.com/in/ankush-agrawal-529033a/
// @version      0.1
// @description  Add Story points in sprint board
// @author       Ankush Agrawal
// @match        https://*.service-now.com/*vtb.do*
// @match        https://*.servicenow.com/*vtb.do*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var iter = 0;
    setTimeout(setPoints, 1000);

    function setPoints() {
        var storyNumberSelector = '.open-record-button';
        var nodeStories = $(storyNumberSelector);

        if (nodeStories.length === 0) {
            if(++iter === 30) {
                console.error('Could not find Stories in 30 iterations');
                return;
            }
            //retry
            setTimeout(setPoints, 1000);
            return;
        }
        var storyNumbers = [];
        for (var i = 0; i < nodeStories.length; i++)
            storyNumbers.push(nodeStories[i].text);

        // storyNumbers.forEach((e, i) => {
            $.get('/api/now/table/sn_safe_story?sysparm_query=numberIN' + storyNumbers.join(',') + '&sysparm_fields=number,story_points,classification,sn_safe_feature.sys_id,sn_safe_feature.short_description', function (data) {
                data.result.forEach(e => {
                    var nodeSTRYNumber = $(storyNumberSelector + ':contains("' + e.number + '")');
                    nodeSTRYNumber.text(e.number + ' (' + e.story_points + ')');
                    if (e.classification === 'Defect')
                        markDefect(_getCardID(nodeSTRYNumber));
                        // nodeSTRYNumber.css('color', 'red');

                    var safeFeature = e['sn_safe_feature.short_description'];
                    if (!safeFeature)
                        return;

                    //var nodeStryDescr = nodeSTRYNumber.parents('.vtb-card-component-wrapper').children('.sn-card-component_summary');
                    //var descr = nodeStryDescr.text();
                    //nodeStryDescr.html('<span style="color:brown;">' + getEpicPrintableText(sn_safe_feature) + '</span><br/>'+ descr);
                   //nodeSTRYNumber.parents('.vtb-card-component-meta-wrapper').children('.vtb-compact-sla-checklist').html('<span style="color:#222;"><a href="/rm_epic.do?sys_id=' + e['epic.sys_id'] + '">' + getEpicPrintableText(epic) + '</a></span>');
                    nodeSTRYNumber.parents('.vtb-card-component-meta-wrapper').children('.vtb-compact-sla-checklist').html('<a class="sn-card-component-detail open-record-button ng-binding" role="button" href="/sn_safe_feature.do?sys_id=' + e['sn_safe_feature.sys_id'] + '">' + getEpicPrintableText(safeFeature) + '</a>');
                });
            });
        // });

        function getEpicPrintableText(epicShortDescrt) {
            return epicShortDescrt.trim();
        }

        function _getCardID(nodeSTRYNumber) {
            return nodeSTRYNumber.parents('.vtb-card')[0].id;
        }

        function markDefect(cardID) {
            const LABEL_DEFECT = '0ed6b2b3db343300a39a0b55ca961960';
            $.ajax({
                type: 'PUT',
                url: '/api/now/v1/vtb/cards/' + cardID + '/labels/' + LABEL_DEFECT,
                data: '{"active":true}',
                contentType: 'application/json',
                dataType: 'application/json'
            });
        }
    }
})();