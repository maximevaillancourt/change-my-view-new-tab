var id;

$(document).ready(function(){
  $.getJSON("https://www.reddit.com/r/changemyview/top/.json", function(json) {
    var length = json.data.children.length
    var selected = Math.floor(Math.random() * length);
    var thing = json.data.children[selected].data
    id = thing.id
    var html = `
      <div style='margin-bottom:0.5em;' class='initialism'>Top thread #${selected+1} in the past 24 hours</div>
      <h1 style="font-size:1.5em; font-weight:500;">
        ${thing.title}
      </h1>
      <div>
        Posted by <a href="/u/${thing.author}">${thing.author}</a>
        &middot;
        <a href="${thing.url}">
          view original post
        </a>
      </div>
      <hr/>
      <p>
        ${thing.selftext_html}
      </p>
    `
    // real ugly hack
    var elem = document.createElement('textarea');
    elem.innerHTML = html;
    var decoded = elem.value;
    $('#poster').hide();
    $('#poster').html(decoded);
    $('#poster').html(decoded);
    $('#poster').fadeIn();
    
    $.getJSON("https://www.reddit.com/r/changemyview/comments/" + id + ".json", function (data){
      
      comments = data[1].data.children
      
      $("#results").hide()
      $('#results').html('');

      $.each(comments, function (i, item) {
        var comment = item.data.body_html
        var author = item.data.author
        
        var postcomment = `
          <div>
            <p>
              <b>
                <a style="color: unset;" href="/u/${author}">
                  ${author}
                </a>
              </b>
            </p>
            <div>
              ${comment}
            </div>
          </div>
        `
        
        // ugly hack, again
        var elem = document.createElement('textarea');
        elem.innerHTML = postcomment;
        var decoded = elem.value;
        $("#results").append('<div class="card card-comment"><div class="card-block">' + decoded + '</div></div>')
      });
      $("#results").fadeIn()

      // prefix relative URLs to Reddit with reddit.com domain
      $('a').each(function() {
        const extensionUrl = chrome.extension.getURL("");
        if(this.href.match(extensionUrl)) {
          const redditPath = this.href.replace(extensionUrl, "")
          this.href = "https://reddit.com/" + redditPath
        }
      })
    })
  })
})
