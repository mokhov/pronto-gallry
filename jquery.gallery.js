$(function(){
    $('.b-gallery').gallery({
        maxWidth: 266,
        minWidth: 200,
        maxHeight: 200,
        minHeight: 150,
        interval: 10,
        data: galleryData
    });
});

(function( $ ){
    $.fn.gallery = function(options) {
        
        var getGalleryContWidth = function(){
            return galleryCont.width();
        }
        
        var obeyConstraints = function() {
            for (var i=0, n=data.photos.length, photos=data.photos; i<n; i++) {
                photos[i].thumb_fixed_width = photos[i].thumb_width;
                photos[i].thumb_fixed_height = photos[i].thumb_height;
                if (photos[i].thumb_width > options.maxWidth) {
                    photos[i].thumb_fixed_height = photos[i].thumb_height * (options.maxWidth / photos[i].thumb_width);
                    photos[i].thumb_fixed_width = options.maxWidth;
                } else if (photos[i].thumb_height > options.maxHeight) {
                    photos[i].thumb_fixed_width = photos[i].thumb_width * (options.maxHeight / photos[i].thumb_height);
                    photos[i].thumb_fixed_height = options.maxHeight;
                }
            }
        }
        
        var splitByRows = function(){
            var curImagesWidth = 0;
            var firstInRow = 0;
            var j, k;
            for (var i=0, n=data.photos.length, photos=data.photos; i<n; i++) {
                photos[i].thumb_inrow_width = photos[i].thumb_fixed_width;
                photos[i].thumb_inrow_height = photos[i].thumb_fixed_height;
                curImagesWidth += photos[i].thumb_fixed_width + options.interval;
                if (curImagesWidth >= galleryContWidth) {
                    k = (curImagesWidth - (i-firstInRow+1)*options.interval) / (galleryContWidth - (i-firstInRow+1)*options.interval);
                    for (j=firstInRow; j<=i; j++) {
                        photos[j].thumb_inrow_width = Math.floor(photos[j].thumb_fixed_width / k);
                        photos[j].thumb_inrow_height = Math.floor(photos[j].thumb_fixed_height / k);
                    }
                    curImagesWidth = 0;
                    firstInRow = i + 1;
                }
            }
        }
        
        var createImages = function(){
            var image, link;
            for (var i=0, n=data.photos.length, photos=data.photos; i<n; i++) {
                image = $('<img/>');
                link = $('<a/>');
                image.attr({
                    src: photos[i].src,
                    width: photos[i].thumb_inrow_width,
                    height: photos[i].thumb_inrow_height,
                    'class': 'b-gallery__item',
                    id: 'photo_'+i
                });
                link.attr('href', photos[i].src);
                link.append(image);
                galleryCont.append(link);
            }
        }
        
        var setInrowSizes = function(){
            galleryCont.find('img').each(function(i){
                $(this).attr({
                    width: data.photos[i].thumb_inrow_width,
                    height: data.photos[i].thumb_inrow_height
                });
            });
        }
        
        $(window).resize(function(){
            galleryContWidth = getGalleryContWidth();
            splitByRows();
            setInrowSizes();
        });
        
        var galleryCont = this;
        var galleryContWidth = getGalleryContWidth();
        var data = options.data;
        obeyConstraints();
        splitByRows();
        createImages();
        $('.b-pane__title_text').text(galleryData.title);
        $('.b-pane__photos-count_number').text(galleryData.photos.length);
    };
})( jQuery );
