$(function() {

    var currentYear = new Date();
    $('#footer-date').html("&copy;" + currentYear.getFullYear() + " Josh Braby");
  
    // $('.footer-button').on('click', function() {
    //     $.getJSON('https://api.github.com/users/joshbraby/repos')
    //   .done(function(data) {
    //     $.each(data, function( key, value ){
    //       var repoLink = '<li><a href="#" target="_blank">' + value.html_url + '</li>';
    //         $('.repo-list').append(repoLink);
    //     });
    //   });  
    // });

    var $userSearch = $('#user_search');
    $userSearch.val("");
    var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    var $currentThumbnail;


    $userSearch.keyup(function() {

        var search = $(this).val();
        search = search.toLowerCase();

        if(search === "") {
            HTML = "";
        }

        var flickrOptions = {
            tags: search,
            format: "json"
        }

        $.getJSON(flickrAPI, flickrOptions, displayPhotos);

        function displayPhotos(data) {

            var HTML = "";

            $.each(data.items, function(i, photo) {

                if(i > 11) {
                    return false;
                }

                HTML += '<div class="thumbnail-container">';
                HTML += '<img src="' + photo.media.m + '" alt="an image of ' + search + '" class="' + i + '"/>';
                HTML += '</div>';

            });

            $('.container').html(HTML);

        }

    });

    var $body = $('body');
    var $thumbnailIMG = $(".thumbnail-container img");
    $body.append("<div class='overlay'><i class='fa fa-arrow-circle-o-left fa-4x'></i><i class='fa fa-arrow-circle-o-right fa-4x'></i><div><img src='' id='large-image'/></div><p></p></div>");
    var $overlay = $('.overlay');
    $overlay.hide();
    var $overlayIMG = $('.overlay img');


    $('div').on('click', '.thumbnail-container', function() {

        $currentThumbnail = $(this);

    	$overlay.show();
    	$imageIndex = $(this).find("img").attr('src');
        $imageIndex = $imageIndex.substring(0,$imageIndex.length - 6);
        $imageIndex = $imageIndex + ".jpg";

        $overlayIMG.attr('src',$imageIndex);

    });

    $body.on('click', '.overlay img', function() {
    	$('.overlay').hide();
    });

    function slideLeft() {

        var getClass = $currentThumbnail.find('img').attr('class');

        if(getClass === "0") {
            $currentThumbnail = $('.11').parent();
            $imageIndex = $currentThumbnail.find('img').attr('src');

        } else {
            $imageIndex = $currentThumbnail.prev().find('img').attr('src');
        }

        $imageIndex = $imageIndex.substring(0,$imageIndex.length - 6);
        $imageIndex = $imageIndex + ".jpg";

        $overlayIMG.attr('src',$imageIndex);

        $currentThumbnail = $currentThumbnail.prev();

    }

    function slideRight() {

        var getClass = $currentThumbnail.find('img').attr('class');

        if(getClass === "11") {
            $currentThumbnail = $('.0').parent();
            $imageIndex = $currentThumbnail.find('img').attr('src');

        } else {
            $imageIndex = $currentThumbnail.prev().find('img').attr('src');
        }

        $imageIndex = $currentThumbnail.next().find('img').attr('src');
        $imageIndex = $imageIndex.substring(0,$imageIndex.length - 6);
        $imageIndex = $imageIndex + ".jpg";

        $overlayIMG.attr('src',$imageIndex);

        $currentThumbnail = $currentThumbnail.next();

    }

    $body.on('click', '.fa-arrow-circle-o-left', slideLeft);

    $body.on('click', '.fa-arrow-circle-o-right', slideRight);

	$(document).keydown(function(e) {
    	if (e.keyCode === 37) {
    		slideLeft();
    	} else if (e.keyCode === 39) {
        	slideRight();
    	}
	});


}); //end document object function