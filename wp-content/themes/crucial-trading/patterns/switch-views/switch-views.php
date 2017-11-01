<?php


function switch_views() {
  return <<<HTML

  <div class="switch_views">
    <div class="switch_views__container">
      <a>View:</a>
      <a id='switch-views-one'>One</a>
      <a id='switch-views-two'>Two</a>
    </div>
  </div>

HTML;
}
