$(function(){
    $('.b-context-popup').popup();
});

(function( $ ){
    $.fn.popup = function(options) {
        var popupCont = this;
        var show = function(element){
            var elementIndex = $(element).attr('id').split('_').pop();
            popupCont.css({
                left: $(element).position().left-5,
                top: $(element).position().top-5
            }).show()
            popupCont.find('img').attr('src', $(element).attr('src')).css({
                width: $(element).attr('width'),
                height: $(element).attr('height')    
            });
            popupCont.find('img').animate({
                width: galleryData.photos[elementIndex].thumb_width,
                height: galleryData.photos[elementIndex].thumb_height
            });
            var popupTargetPos = {};
            if (popupCont.position().left + galleryData.photos[elementIndex].thumb_width + 20 > $('.b-gallery').width()) {
                popupTargetPos.left = $('.b-gallery').width() - galleryData.photos[elementIndex].thumb_width;    
            }
            if (popupCont.position().top + galleryData.photos[elementIndex].thumb_height + 20 > $('.b-gallery').height() + $('.b-gallery').position().top) {
                popupTargetPos.top = $('.b-gallery').height() + $('.b-gallery').position().top - galleryData.photos[elementIndex].thumb_height;
            }
            if (popupTargetPos.left || popupTargetPos.top) {
                popupCont.animate(popupTargetPos);
            }
            
            popupCont.find('.js-image-full').attr('rel', 'photo_'+elementIndex);
            popupCont.find('td.js-imageinfo-title').html(galleryData.photos[elementIndex].title);
            popupCont.find('td.js-imageinfo-published').html(galleryData.photos[elementIndex].published);
            popupCont.find('td.js-imageinfo-size').html(galleryData.photos[elementIndex].width+'x'+galleryData.photos[elementIndex].height);
            popupCont.find('td.js-imageinfo-filename').html(galleryData.photos[elementIndex].src.split('/').pop());
        }
        var hide = function(){
            popupCont.hide();
        }
        var timeout;
        $('.b-gallery a').mouseover(function(){
            var element = $(this).find('img');
            timeout = setTimeout(function(){
                show(element);
            }, 500);
        });
        $('.b-gallery a').mouseout(function(){
            clearTimeout(timeout);
        });
        $(popupCont).mouseleave(function(){
            hide();
        });
    }   
})( jQuery );
