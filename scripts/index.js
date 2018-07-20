(function ($) {
  'use strict';

  $(function () {
    $.getJSON("https://www.reddit.com/r/changemyview/top/.json", function (json) {
      let length = json.data.children.length;
      let selected = Math.floor(Math.random() * length);
      let thing = json.data.children[selected].data;
      let id = thing.id;

      let html = `
        <div class='initialism'>Top thread #${selected + 1} in the past 24 hours</div>
          <h1>
              ${thing.title}
          </h1>
        <div>
          Posted by <a ${thing.author === '[deleted]' ? '' : `href="/u/${thing.author}"`}>${thing.author}</a>&middot;
          <a href="${thing.url}">
            view original post
          </a>
        </div>
        <hr/>
        <p>
          ${unsanitizeHtml(thing.selftext_html)}
        </p>
      `;

      let poster = $("#poster");
      poster.hide();
      poster.html(html);
      poster.fadeIn();

      $.getJSON(
        "https://www.reddit.com/r/changemyview/comments/" + id + ".json",
        function (data) {
          let comments = data[1].data.children;
          let results = $("#results");

          results.hide();
          results.html("");

          $.each(comments, function (i, item) {
            let comment = item.data.body_html;
            let author = item.data.author;

            let postcomment = `
              <div>
                <p>
                  <b>
                    <a class="comment-author" ${author === '[deleted]' ? '' : `href="/u/${author}"`}>
                      ${unsanitizeHtml(author)}
                    </a>
                  </b>
                </p>
                <div>
                  ${unsanitizeHtml(comment)}
                </div>
              </div>
            `;

            results.append(
              `<div class="card card-comment">
                  <div class="card-block">${postcomment}</div>
               </div>`
            );
          });
          results.fadeIn();

          // prefix relative URLs to Reddit with reddit.com domain
          $("a").each(function () {
            const extensionUrl = chrome.extension.getURL("");
            if (this.href.match(extensionUrl)) {
              const redditPath = this.href.replace(extensionUrl, "");
              this.href = "https://reddit.com/" + redditPath;
            }
          });
        }
      );
    });
  });

  // https://stackoverflow.com/a/34064434
  function unsanitizeHtml(sanitizedHtml) {
    return new DOMParser().parseFromString(sanitizedHtml, "text/html").documentElement.textContent;
  }

})(window.jQuery || window.$);