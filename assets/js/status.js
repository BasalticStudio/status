(function(){
  var STATUS_API = 'https://status.basaltic.tw/api/status.json';
  var $nodes = document.querySelectorAll('.node')
  var nodes = {}
  var uri = new URL(STATUS_API)

  // Load Nodes on Page
  $nodes.forEach(function(node) {
    var hostname = node.dataset.hostname;
    // Cache DOM
    nodes[hostname] = {
      $el: node,
      $color: node.querySelector('.legend__color'),
      $status: node.querySelector('.legend__value'),
      hostname: hostname
    };
    // Add for Query
    uri.searchParams.append('node[]', hostname);
  });

  var currentTime = (new Date()).getTime() / 1000;

  // TODO: Refactor it
  fetch(uri)
    .then(function(res) { return res.json() })
    .then(function(statuses) {
      var node = {}
      var $color = null;
      var $status = null;

      for(var hostname in statuses) {
        node = statuses[hostname];

        if ( node && nodes[hostname] ) {
          $color = nodes[hostname]['$color'];
          $status = nodes[hostname]['$status'];

          // Online
          if ((currentTime - node.timestamp) / 60 <= 5) {
            $color.style.cssText = "--color: var(--color-online)";
            $status.innerText = "Online";
          } else {
            $color.style.cssText = "--color: var(--color-offline)";
            $status.innerText = "Offline";
          }
        }
      }
    });
}())

