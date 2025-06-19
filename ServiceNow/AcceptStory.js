// ==UserScript==
// @name         Accept Story
// @namespace    https://www.linkedin.com/in/ankush-agrawal-529033a/
// @version      0.1
// @description  Accept the story and assign the UAT task to self (if exists.)
// @author       ankush.agrawal
// @match        https://*.service-now.com/rm_story.do*
// @match        https://*.servicenow.com/rm_story.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    acceptStory();

    function closeUATTask(storyID) {
        var grStoryTask = new GlideRecord("rm_scrum_task");
        grStoryTask.addQuery("type", "UAT");
        grStoryTask.addQuery('story', storyID);
        grStoryTask.query();
        if (!grStoryTask.next())
            return;

        grStoryTask.setValue("assigned_to", g_user.getUserID());
        grStoryTask.setValue("state", "3");
        grStoryTask.update();
    }

    function acceptStory() {
        let storyID = g_form.getUniqueValue();
        
        /* var grStory = new GlideRecord('rm_story');
        grStory.addQuery('sys_id', g_form.getUniqueValue());
        grStory.query();
        if (!grStory.next())
            return; */

        closeUATTask(storyID);

        g_form.setValue('state', '6');
        if(g_form.getValue('u_story_owner'))
            g_form.setValue('assigned_to', g_form.getValue('u_story_owner'));
        g_form.save();
        /* grStory.setValue('state', '6');
        grStory.update(); */
    }
})();