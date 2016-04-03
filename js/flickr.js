$(function() {

    var currentYear = new Date();
    $('#footer-date').html("&copy;" + currentYear.getFullYear() + " Josh Braby");
  
    var $userSearch = $('#user_search');
    $userSearch.val("");
    var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    var $currentThumbnail;
    var HTML;

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

            HTML = "";

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

        console.log($currentThumbnail); 

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
            $currentThumbnail = $currentThumbnail.prev();
        }

        $imageIndex = $imageIndex.substring(0,$imageIndex.length - 6);
        $imageIndex = $imageIndex + ".jpg";

        $overlayIMG.attr('src',$imageIndex);

    }

    function slideRight() {

        var getClass = $currentThumbnail.find('img').attr('class');

        if(getClass === "11") {
            $currentThumbnail = $('.0').parent();
            $imageIndex = $currentThumbnail.find('img').attr('src');
        } else {
            $imageIndex = $currentThumbnail.next().find('img').attr('src');
            $currentThumbnail = $currentThumbnail.next();
        }

        $imageIndex = $imageIndex.substring(0,$imageIndex.length - 6);
        $imageIndex = $imageIndex + ".jpg";

        $overlayIMG.attr('src',$imageIndex);
        

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