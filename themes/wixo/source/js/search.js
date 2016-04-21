var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
			
			// set result position
			var s_div = $('#local-search-input');
			var r_div = $('#local-search-result');
			var r_div_width = 600;
			r_div.offset({'top': s_div.offset().top + s_div.height() + 12, 'left': s_div.offset().left + s_div.width() - r_div_width});
			r_div.width(r_div_width);
			
            $input.addEventListener('input', function(){
				var total_matched = 0;
                var str='<ul class=\"search-result-list\">';                
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // perform local searching
                datas.forEach(function(data) {
					$resultContent.style.display = 'none';
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty titles and contents
                    if(data_title != '' && data_content != '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // show search results
                    if (isMatch) {
                        str += "<li><a href='"+ data_url +"' class='search-result-title'>"+ data_title +"</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            // cut out 100 characters
                            var start = first_occur - 20;
                            var end = 100;
                            if(start < 0){
                                start = 0;
                            }
                            //if(start == 0){
                            //    end = 100;
                            //}
                            if(end > content.length){
                                end = content.length;
                            }
                            var match_content = content.substr(start, end);
                            // highlight all keywords
                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                            });
                            
                            str += "<p class=\"search-result\">" + match_content +"...</p>"
                        }
                        str += "</li>";
						total_matched++;
                    }
					
                });
                str += "</ul>";
                $resultContent.innerHTML = str;
				
				// hide result content if no matched
				if (total_matched > 0) {
					$resultContent.style.display = 'block';
				} else {
					$resultContent.style.display = 'none';
				}
				
            });
			
			$input.addEventListener('blur', function(){ 
				 $resultContent.style.display = 'none';
			});
        }
    });
}