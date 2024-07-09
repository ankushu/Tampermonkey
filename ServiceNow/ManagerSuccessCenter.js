// ==UserScript==
// @name         ManagerSuccessCenter
// @namespace    https://www.linkedin.com/in/ankush-agrawal-529033a/
// @version      0.1
// @description  Better manage goals, qgc in Surf
// @author       ankush.agrawal
// @match        https://my.servicenow.com/*sn_mh*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var iter = 0;
  setTimeout(msc, 1000);

  function msc() {
    if ($(".qgc-container").length === 0) {
      if (++iter === 30) {
        console.error("Could not find QGC in 30 iterations");
        return;
      }
      //retry
      setTimeout(msc, 1000);
      return;
    }
      const QUARTER = angular.element($('.quarter-dropdown')[0]).scope().c.data.quarter;
    const URL = '/esc?id=qgc_manager_growth_conversation&userId=%s&pageNo=0&quarter=' + QUARTER;

    function createOpenGoalNode(dr) {
      const nodeSpan = document.createElement("span");
      nodeSpan.setAttribute("class", "glyphicon glyphicon-new-window");
      const nodeAnchor = document.createElement("a");
      nodeAnchor.setAttribute(
        "href",
        URL.replace('%s', dr.userid)
      );
      nodeAnchor.setAttribute("target", "_blank");
      nodeAnchor.setAttribute("class", "userscript-custom");
      nodeAnchor.appendChild(nodeSpan);
      return nodeAnchor;
    }

    $(".userscript-custom").remove();
    $(".qgc-container").each(function ( ) {
      this.lastElementChild.appendChild(createOpenGoalNode(angular.element(this).scope().dr));
    });

    (function addRefreshManageGoals() {
      if ($("#refreshGoals").length !== 0) return;

      top.msc = msc;
        let btnGoals = document.createElement('button');
        btnGoals.setAttribute('id', 'refreshGoals');
        btnGoals.setAttribute('class', 'btn btn-goal');
        btnGoals.setAttribute('onclick', 'top.msc();');
        let btnText = document.createTextNode('Refresh Userscripts');
        btnGoals.appendChild(btnText);
    //   const BUTTON_REFRESH =
    //     '<button id="refreshGoals" class="btn btn-goal" onclick="top.msc();">Refresh Userscripts</button>';
    //   let existingHTML = $(".action-block").html();
    //   $(".action-block").html(existingHTML + BUTTON_REFRESH);
        $(".mrow")[0].appendChild(btnGoals);
    })();
  }
})();
