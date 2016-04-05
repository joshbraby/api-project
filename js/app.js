$(function () {

    var currentYear = new Date();
    $('#footer-date').html("&copy;" + currentYear.getFullYear() + " Josh Braby");

    var HTML;
    var $userSearch = $('#user_search');
    $userSearch.val("");
    var artistID = "";
    var albumURL = 'https://api.spotify.com/v1/artists/' + artistID + '/albums?album_type=album';
    var classCount = 0;
    var albumName = [];
    var albumReleaseDate = [];
    var artistName = "";
    var getClass;
    var $imageIndex;

    function submitSearch() {

        HTML = "";
        
        var search = $userSearch.val();
        search = search.toLowerCase();
        search = search.replace(" ","+");

        if(search === "") {
            HTML = "";
        }

        var artistURL = 'https://api.spotify.com/v1/search?q=' + search + '&type=artist';

        var artistAPICallback = function (data) {

            var artistsObject = data.artists;

            var artistObject = artistsObject.items[0];

            artistID = artistObject.id;
            artistName = artistObject.name;
            artistID.toString();
            albumURL = 'https://api.spotify.com/v1/artists/' + artistID + '/albums?album_type=album';

            var albumAPICallback = function (data) {
                
                var prevAlbumName = [];
                albumName = [];
                albumReleaseDate = [];
                classCount = 0;
                
                $.each(data.items, function (imageID, imageData) {

                    var urlName = imageData.images[0];
                    var albumsInfo = imageData.href;

                    if (prevAlbumName.indexOf(imageData.name) == -1) {

                        var albumInfoAPICallback = function (albumData) {

                                var releaseDate = albumData.release_date.substring(0,4);
                                albumReleaseDate.push(releaseDate);

                        }

                        $.getJSON(albumsInfo, albumInfoAPICallback);
                                
                        albumName.push(imageData.name);
                        prevAlbumName.push(imageData.name);

                        HTML += '<div class="album-container">';
                        HTML += '<div class="thumbnail-container">';
                        HTML += '<img src="' + urlName.url + '" class="' + classCount + '"/>';
                        HTML += '</div>';
                        HTML += '<p>' + imageData.name + '</p>'
                        HTML += '</div>';

                        classCount++;

                    }

                });

                $('.container').html(HTML);
                        
            }

            $.getJSON(albumURL, albumAPICallback);

        }

        $.getJSON(artistURL, artistAPICallback);

    }

    $userSearch.bind("enterKey",function(e){
        submitSearch();
    });

    $userSearch.keyup(function(e){
        if(e.keyCode == 13)
        {
            submitSearch();
        }
    });

    $('button').on('click', function () {
        submitSearch();
    })
        
    var $body = $('body');
    $body.append("<div class='overlay'><i class='fa fa-arrow-circle-o-left fa-4x'></i><i class='fa fa-arrow-circle-o-right fa-4x'></i><div><img src='' '/></div><p class='artist-name'></p><p class='album-name'></p><p class='album-release-date'></p></div>");
    var $overlay = $('.overlay');
    $overlay.hide();
    var $overlayIMG = $('.overlay img');
    var $overlayPArtistName = $('.artist-name');
    var $overlayPAlbumName = $('.album-name');
    var $overlayPAlbumReleaseDate = $('.album-release-date');


    $('div').on('click', '.thumbnail-container', function () {

        getClass = $(this).find('img').attr('class');

        $overlay.show();
        $imageIndex = $(this).find("img").attr('src');

        $overlayIMG.attr('src',$imageIndex);
        $overlayPArtistName.text('Artist: ' + artistName);
        $overlayPAlbumName.text('Album: ' + albumName[getClass]);
        $overlayPAlbumReleaseDate.text('Released: ' + albumReleaseDate[getClass]);

    });

    $body.on('click', '.overlay img', function () {
        $('.overlay').hide();
    });

    function slideLeft() {

        if(getClass == 0) {
            getClass = classCount - 1;
            $imageIndex = $('.' + getClass + '').attr('src');
        } else {
            getClass--;
            $imageIndex = $('.' + getClass + '').attr('src');
        }
        $overlayIMG.attr('src',$imageIndex);
        $overlayPAlbumName.text('Album: ' + albumName[getClass]);
        $overlayPAlbumReleaseDate.text('Released: ' + albumReleaseDate[getClass]);

    }

    function slideRight() {

        if(getClass == classCount - 1) {
            getClass = 0;
            $imageIndex = $('.' + getClass + '').attr('src');
        } else {
            getClass++;
            $imageIndex = $('.' + getClass + '').attr('src');
        }
        $overlayIMG.attr('src',$imageIndex);
        $overlayPAlbumName.text('Album: ' + albumName[getClass]);
        $overlayPAlbumReleaseDate.text('Released: ' + albumReleaseDate[getClass]);

    }

    $body.on('click', '.fa-arrow-circle-o-left', slideLeft);

    $body.on('click', '.fa-arrow-circle-o-right', slideRight);

    $(document).keydown(function (e) {
        if (e.keyCode === 37) {
            slideLeft();
        } else if (e.keyCode === 39) {
            slideRight();
        }
    });

}); //end document object function