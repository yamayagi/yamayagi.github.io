/*
Credits: this script is shamelessly borrowed from
https://github.com/kitian616/jekyll-TeXt-theme
*/
(function() {
  function queryString() {
    var queryObj = {};
    var queryStr = window.location.search.substring(1);
    var queryArr = queryStr.split('&');
    queryArr.forEach(function(pair) {
      var [key, value] = pair.split('=');
      queryObj[key] = value;
    });
    return queryObj;
  }

  var setUrlQuery = (function() {
    var baseUrl = window.location.href.split('?')[0];
    return function(query) {
      if (typeof query === 'string') {
        window.history.replaceState(null, '', baseUrl + query);
      } else {
        window.history.replaceState(null, '', baseUrl);
      }
    };
  })();

  $(document).ready(function() {
    var $tags = $('.js-tags');
    var $articleTags = $tags.find('.tag-button');
    var $tagShowAll = $tags.find('.tag-button--all');
    var $result = $('.js-result');
    var $sections = $result.find('section');
    var sectionArticles = [];
    var $lastFocusButton = null;
    var sectionTopArticleIndex = [];
    var hasInit = false;

    $sections.each(function() {
      sectionArticles.push($(this).find('.item'));
    });

    function init() {
      var index = 0;
      $sections.each(function(i, section) {
        sectionTopArticleIndex.push(index);
        index += $(section).find('.item').length;
      });
      sectionTopArticleIndex.push(index);
    }

    function searchButtonsByTag(_tag) {
      return _tag ? $articleTags.filter('[data-encode="' + _tag + '"]') : $tagShowAll;
    }

    function buttonFocus(target) {
      if (target) {
        target.addClass('focus');
        if ($lastFocusButton && !$lastFocusButton.is(target)) {
          $lastFocusButton.removeClass('focus');
        }
        $lastFocusButton = target;
      }
    }

    function tagSelect(tag, target) {
      var result = {};
      sectionArticles.forEach((articles, i) => {
        articles.each(function(j) {
          var tags = $(this).data('tags').split(',');
          if (!tag || tags.includes(tag)) {
            result[i] = result[i] || {};
            result[i][j] = true;
          }
        });
      });

      $sections.each(function(i, section) {
        if (result[i]) {
          $(section).removeClass('d-none');
          $(section).find('.item').each(function(j) {
            $(this).toggleClass('d-none', !result[i][j]);
          });
        } else {
          $(section).addClass('d-none');
        }
      });

      hasInit || ($result.removeClass('d-none'), hasInit = true);

      if (target) {
        buttonFocus(target);
        setUrlQuery(tag ? '?tag=' + tag : '');
      } else {
        buttonFocus(searchButtonsByTag(tag));
      }
    }

    var query = queryString(), _tag = query.tag;

    init();
    tagSelect(_tag);

    $tags.on('click', 'a', function() {
      tagSelect($(this).data('encode'), $(this));
    });
  });
})();
