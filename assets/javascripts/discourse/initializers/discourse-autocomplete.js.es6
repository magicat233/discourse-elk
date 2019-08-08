export default {

  name: "discourse-autocomplete",
  initialize() {},
  _initialize(options) {
    //Autocomplete function
    function callAjax(url,json){
      return $.ajax({
                url : url,
                type : "POST",
                data : JSON.stringify(json),
                contentType : "application/json; charset=utf-8",
                dataType : "json",
                // async : false,
                success : function(data) {
                    return (data);
                },
                failure : function(errMsg) {
                    alert(errMsg);
                },
                complete: function(XMLHttpRequest) {
                        this; 
                    }
            });
    }

    var esUrl = 'https://test-discourse.ubnt.com.cn/elasticsearch/_search',
        autocomplete = function(query, cb) {
        var results = $.map([0], function() {
            //Get text from the input field
            var text = $('#search-box').val();
            //ES Query
            var json = {
                        "query":{
                            "multi_match":
                            {"query":text,
                             "fields":[],
                             "type":"best_fields"
                            }
                        }
                    };
            
            //Ajax call to ES make sure this matches YOUR ES info
            var request = callAjax(esUrl, json);
            console.log(request);
            console.log(request.responseText);
            //Parse the results and return them
            var response = JSON.parse(request.responseText),
                resultsData = response.hits,
                resultsLength = Object.keys(resultsData.hits).length,
                resultsIndex = resultsData.hits._index,
                datum = [];

            for (var i = 0; i < resultsLength; i++) {
              var resultsArray = resultsData.hits[i]._source,
                  resultsIndex = resultsData.hits[i]._index;
              if (resultsIndex == "discourse-users") {
                var user_avatar = resultsArray.avatar_template.replace("\{size}", 50);
                datum.push({
                    // user
                    user_avatar_template: user_avatar,
                    user_username: resultsArray.username,
                    user_likes_received: resultsArray.likes_received,
                    url: resultsArray.url
                });
              }else if (resultsIndex == "discourse-tags") {
                datum.push({
                    // tag
                    tag_name: resultsArray.name,
                    tag_topic_count: resultsArray.topic_count,
                    url:resultsArray.url
                });
              }else if (resultsIndex == "discourse-posts") {
                var topic_name = resultsArray.topic.title,
                    topic_view = resultsArray.topic.views,
                    topic_url = resultsArray.topic.url,
                    category = resultsArray.category.name,
                    category_color = resultsArray.category.color,
                    category_url = resultsArray.category.url,
                    author = resultsArray.user.username,
                    author_url = resultsArray.user.url,
                    pre = resultsArray.content;

                datum.push({
                    // post
                    post_topic_name: topic_name,
                    post_topic_view: topic_view,
                    url: topic_url,
                    post_category: category,
                    post_category_color: category_color,
                    post_category_url: category_url,
                    post_author: author,
                    post_author_url: author_url,
                    post_pre: pre

                });
              }

            }

            // }
            return datum;
        });

        cb(results);
    };


    $('#search-box').typeahead({
      highlight: true,
      minLength: 1
      }, 
      {
      name: 'posts',
      displayKey: 'value',
      limit: 4,
      source: autocomplete,
      templates: {
        empty: [
          '<div class="empty-message">',
            '无结果',
          '</div>'
        ].join('\n'),
        suggestion: function(value) {
          if (value.post_topic_name == undefined) {
            return '<span></span>'
          }else{
            return '<div class="es-dataset-posts"><div class="hit-post"><div class="hit-post-title-holder"><span class="hit-post-topic-title"><a href="' + value.url + '">'+ value.post_topic_name + '</a></span><span class="hit-post-topic-views" title="Number of times the topic has been viewed">'+ value.post_topic_view + '</span></div><div class="hit-post-category-tags"><span class="hit-post-category"><span class="badge-wrapper bullet"><span class="badge-category-bg" style="background-color: #'+ value.post_category_color +';"></span><a class="badge-category hit-post-category-name" href="'+ value.post_category_url +'">'+ value.post_category + '</a></span></span></div><div class="hit-post-content-holder"><a class="hit-post-username" href="'+ value.post_author_url +'">'+ value.post_author + '</a>:<span class="hit-post-content">'+ value.post_pre +'</span></div></div></div>'
            
          }
        }
      }
    },{
      name: 'users',
      displayKey: 'value',
      limit: 4,
      source: autocomplete,
      templates: {
        empty: "",
        suggestion: function(value) {
          if (value.user_username == undefined) {
            return '<span></span>'
          }else{
            return '<div class="es-dataset-users"><a href="'+ value.url +'"><div class="hit-user-left"><img class="hit-user-avatar" src="'+ value.user_avatar_template + '" /></div><div class="hit-user-right"><div class="hit-user-username-holder"><span class="hit-user-username">@'+ value.user_username + '</span><span class="hit-user-custom-ranking" title="Number of likes the user has received"><span class="hit-user-like-heart"> ❤ </span>' + value.user_likes_received + '</span></div></div></a></div>'
          }
        }
      }
    },{
      name: 'tags',
      displayKey: 'value',
      limit: 4,
      source: autocomplete,
      templates: {
        empty: "",
        footer: [
          '<div class="show-more">',
            '<a class="advanced-search" onclick="document.location.href="/search"; document.reload();" href="/search">更多...</a>',
          '<div>'
        ].join('\n'),
        suggestion: function(value) {
          if (value.tag_name == undefined) {
            return '<span></span>'
          }else{
            return '<div class="es-dataset-tags"><a href="'+ value.url +'"><div class="hit-tag"><span class="hit-tag-name">#'+ value.tag_name +' </span><span class="hit-tag-topic_count" title="Number of topics with this tag"> '+ value.tag_topic_count +'</span></div></a></div>'
          }
        }


      }
    }).on('typeahead:selected', function(event, datum) {
      console.log(datum);
      window.location = datum.url; 
    });

    $("#search-box").on('focus', function (event) {
      $(this).select();
    });
  }
}

