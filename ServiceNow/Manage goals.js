// ==UserScript==
// @name         ManageGoals
// @namespace    https://www.linkedin.com/in/ankush-agrawal-529033a/
// @version      0.1
// @description  Better manage goals in Surf
// @author       ankush.agrawal
// @match        https://surf.service-now.com/*pd_my_goals*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var iter = 0;
  setTimeout(manageGoals, 1000);

  function manageGoals() {
    if ($(".goal-actions").length === 0) {
      if (++iter === 30) {
        console.error("Could not find Stories in 30 iterations");
        return;
      }
      //retry
      setTimeout(manageGoals, 1000);
      return;
    }
      
    function createOpenGoalNode(goal) {
      const nodeSpan = document.createElement("span");
      nodeSpan.setAttribute("class", "glyphicon glyphicon-new-window");
      const nodeAnchor = document.createElement("a");
      nodeAnchor.setAttribute("href", "/esc?id=pd_goals_form&gid=" + goal.gid);
      nodeAnchor.setAttribute("target", "_blank");
      nodeAnchor.appendChild(nodeSpan);
      return nodeAnchor;
    }
    $(".goal-actions").each(function (goalAction) {
      this.appendChild(createOpenGoalNode(angular.element(this).scope().goal));
    });
  }
})();
