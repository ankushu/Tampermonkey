// ==UserScript==
// @name         ManageGoals
// @namespace    https://www.linkedin.com/in/ankush-agrawal-529033a/
// @version      0.1
// @description  Better manage goals in Surf
// @author       ankush.agrawal
// @match        https://my.servicenow.com/*pd_my_goals*
// @match        https://my.servicenow.com/*pd_manage_goals*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var iter = 0;
  setTimeout(manageGoals, 1000);

  function manageGoals() {
    if ($(".goal-container").length === 0) {
      if (++iter === 30) {
        console.error("Could not find Stories in 30 iterations");
        return;
      }
      //retry
      setTimeout(manageGoals, 1000);
      return;
    }

    function createOpenGoalNode(goal) {
      let reviewGoalsQuery = "";
      if (window.getSpPageUrl().indexOf("manage_goals") !== -1)
        reviewGoalsQuery = "&goal_action=review";
      const nodeSpan = document.createElement("span");
      nodeSpan.setAttribute("class", "glyphicon glyphicon-new-window");
      const nodeAnchor = document.createElement("a");
      nodeAnchor.setAttribute(
        "href",
        "/esc?id=pd_goals_form&gid=" + goal.gid + reviewGoalsQuery
      );
      nodeAnchor.setAttribute("target", "_blank");
      nodeAnchor.setAttribute("class", "userscript-custom");
      nodeAnchor.appendChild(nodeSpan);
      return nodeAnchor;
    }

    $(".userscript-custom").remove();
    $(".goal-container").each(function () {
      this.appendChild(createOpenGoalNode(angular.element(this).scope().goal));
    });

    (function addRefreshManageGoals() {
      if ($("#refreshGoals").length !== 0) return;

      top.manageGoals = manageGoals;
        let btnGoals = document.createElement('button');
        btnGoals.setAttribute('id', 'refreshGoals');
        btnGoals.setAttribute('class', 'btn btn-goal');
        btnGoals.setAttribute('onclick', 'top.manageGoals();');
        let btnText = document.createTextNode('Refresh Userscripts');
        btnGoals.appendChild(btnText);
    //   const BUTTON_REFRESH =
    //     '<button id="refreshGoals" class="btn btn-goal" onclick="top.manageGoals();">Refresh Userscripts</button>';
    //   let existingHTML = $(".action-block").html();
    //   $(".action-block").html(existingHTML + BUTTON_REFRESH);
        $(".action-block")[0].appendChild(btnGoals);
    })();
  }
})();
