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
    let iter = 0;
    let sprint = {};
    setTimeout(setPoints, 1000);

    //Announcement
    /*let title = $('label.sn-navhub-title').text();
    $('label.sn-navhub-title').text(title + ' ***\t' + 'Confirmation for the year end party');*/

    function setPoints() {
        var storyNumberSelector = '.open-record-button';
        var nodeStories = $(storyNumberSelector);
        var nodeUATStories = $('li:contains("In UAT")[class*="vtb-lane"] ' + storyNumberSelector);

        if (nodeStories.length === 0) {
            if (++iter === 30) {
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
        
        getSprintMetadata();

        // storyNumbers.forEach((e, i) => {
        // $.get('/api/now/table/sn_safe_story?sysparm_query=numberIN' + storyNumbers.join(',') + '&sysparm_fields=number,story_points,classification,sn_safe_feature.sys_id,sn_safe_feature.short_description,priority,order', function (data) { //SAFe
        $.get('/api/now/table/rm_story?sysparm_query=numberIN' + storyNumbers.join(',') + '&sysparm_fields=number,story_points,classification,epic.sys_id,epic.short_description,priority,order', function (data) { //Agile
            data.result.forEach(e => {
                var nodeSTRYNumber = $(storyNumberSelector + ':contains("' + e.number + '")');
                nodeSTRYNumber.text(e.number + ' (P' + e.priority + '/o' + e.order + '/' + e.story_points + 'Pt)');
                if (e.classification === 'Defect')
                    markDefect(_getCardID(nodeSTRYNumber));
                // nodeSTRYNumber.css('color', 'red');

                var safeFeature = e['epic.short_description']; //Feature e['sn_safe_feature.short_description'];
                if (!safeFeature)
                    return;

                let featureColor = stringToColour(safeFeature);
                //var nodeStryDescr = nodeSTRYNumber.parents('.vtb-card-component-wrapper').children('.sn-card-component_summary');
                //var descr = nodeStryDescr.text();
                //nodeStryDescr.html('<span style="color:brown;">' + getEpicPrintableText(sn_safe_feature) + '</span><br/>'+ descr);
                nodeSTRYNumber.parents('.vtb-card-component-meta-wrapper').children('.vtb-compact-sla-checklist').html('<a class="sn-card-component-detail open-record-button ng-binding" style="color:' + featureColor + '" role="button" href="/rm_epic.do?sys_id=' + e['epic.sys_id'] + '">' + getEpicPrintableText(safeFeature) + '</a>');
                // nodeSTRYNumber.parents('.vtb-card-component-meta-wrapper').children('.vtb-compact-sla-checklist').html('<a class="sn-card-component-detail open-record-button ng-binding" style="color:' + featureColor + '" role="button" href="/sn_safe_feature.do?sys_id=' + e['sn_safe_feature.sys_id'] + '">' + getEpicPrintableText(safeFeature) + '</a>');
            });
            addRefreshButton(this);
        });
        // });

        function addRefreshButton(that) {
            if ($('#setPoints').length !== 0)
                return;

            top.setPoints = setPoints;
            let existingHTML = $('.sn-navhub-content_row').children('div').html();
            $('.sn-navhub-content_row').children('div').html(existingHTML + '<button id="setPoints" onclick="top.setPoints()">Refresh Additional Info</button>');
        }

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

        var stringToColour = function (str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 6) - hash);
            }
            var colour = '#';
            for (var j = 0; j < 3; j++) {
                var value = (hash >> (j * 8)) & 0xFF;
                colour += ('00' + value.toString(16)).slice(-2);
            }
            return colour;
        }

        function getSprintMetadata() {
            $.get('/api/now/table/rm_story?sysparm_query=number=' + storyNumbers[0] + '&sysparm_fields=sprint,sprint.short_description', function (data) { //Agile
                ({
                    sprint: {
                        value: sprint.sys_id
                    },
                    'sprint.short_description': sprint.short_description
                } = data.result[0]);
                getStoryCountPerDev();
            });
        }

        function getStoryCountPerDev() {
            debugger;
            $.get("/api/now/stats/rm_story?sysparm_query=sprint=" + sprint.sys_id + "^stateIN-6,1,-5,-7,-4,-2^assigned_toISNOTEMPTY&sysparm_count=true&sysparm_group_by=assigned_to.name", function (data) {
                const storyPerDev = data.result.map(e => {
                    const USER = e.groupby_fields[0].value,
                        COUNT = e.stats.count
                    $('.vtb-filter-pill-label:contains("' + USER + '")').text(USER + ' (' + COUNT + ')');
                });
            });
        }

        const getPOATask = function () {
            /**
             * New design
             * 0. Add the button on STRY to close the task and move the story both
             * 1. Add the buttons to story title initially itself when we query the stories. 
             *   1.a we can also get the state of the story and run this only for the stories in 'In UAT'
             * 2. The button only acceptes the story number and has the function (acceptStory) --> untested done
             * 3. Fetch POA task only when the butotn is clicked, assign to self and close, move the story to accept
             * 
             */
            const IMG_MOVE_RIGHT = '/images/toggle_right.gif';
            if (nodeUATStories.length === 0)
                return;
            let uatStoriesNumbers = [];
            for (var i = 0; i < nodeUATStories.length; i++)
                uatStoriesNumbers.push(nodeUATStories[i].text.split(' ')[0]);
            $.get('/api/now/table/rm_scrum_task?sysparm_query=sn_safe_story.numberIN' + uatStoriesNumbers.join(',') + '^ORrm_story.numberIN' + uatStoriesNumbers.join(',') + '^type=7 - UAT&sysparm_fields=number,sys_id,rm_story.number', function (data) {
                data.result.forEach(e => {
                    debugger;
                    //TODO
                    let nodeSTRYNumber = $(storyNumberSelector + ':contains("' + e['rm_story.number'] + '")');
                    let nodeStryTitle = nodeSTRYNumber.parents('.vtb-card-component-wrapper').find('.vtb-card-header-default');
                    nodeStryTitle.html(nodeStryTitle.text() + '<button onclick="acceptStory(' + e + ')"><img src="/images/toggle_right.gif"></img></button>');
                }, this);

            }, this);
        }
    }
})();