$(function(){
    $('.b-scroller').scroller();
});

(function( $ ){
    $.fn.scroller = function(options) {
        
        var scroll = function(delta) {
            if ($('.b-scroller__scroll__position').position().left - delta < 14) {
                delta = $('.b-scroller__scroll__position').position().left - 14;
            } else if ($('.b-scroller__scroll__position').position().left - delta > $('.b-scroller__scrollable').outerWidth() - 16 - $('.b-scroller__scroll__position').width()) {
                delta = - ($('.b-scroller__scrollable').outerWidth() - 16 - $('.b-scroller__scroll__position').width() - $('.b-scroller__scroll__position').position().left);
            }
            $('.b-scroller__scroll__position').css('left', $('.b-scroller__scroll__position').position().left - delta);
            $('.b-scroller__scrollable').css('left', $('.b-scroller__scrollable').position().left + delta/scrollRatio);
        }
        
        var mouseDown = false, oldx;
        $('.b-scroller__scroll__position').mousedown(function(){
            mouseDown = true;
            return false;
        });
        
        $('body').mousemove(function(e){
            if (mouseDown) {
                scroll(oldx - e.pageX);
                oldx = e.pageX;
                return false;
            }
        }).mouseup(function(){
            mouseDown = false; 
        });
        
        $('.b-scroller__scroll__arrow_left').click(function(){
            scroll(100*scrollRatio);    
        });
        $('.b-scroller__scroll__arrow_right').click(function(){
            scroll(-100*scrollRatio);    
        });
        
        var span, img, paneWidth = 10;
        for (var i=0, n=galleryData.photos.length; i<n; i++) {
            img = $('<img/>');
            img.attr({
                src: galleryData.photos[i].thumb_src,
                height: 90,
                id: 'photo_thumb_'+i,
                rel: 'photo_'+i
            });
            span = $('<span/>');
            span.append(img);
            span.addClass('b-scroller__image');
            if (parseInt(location.hash.substr(1)) == i) {
                span.addClass('b-scroller__image_active');
            }
            $('.b-scroller__scrollable').append(span);
            paneWidth += galleryData.photos[i].thumb_width * ( 90 / galleryData.photos[i].thumb_height ) + 10;
        }
        var k = $('.b-scroller__scrollable').width() / paneWidth;
        if (k>1) {
            $('.b-scroller__scroll').hide();
        } else {
            $('.b-scroller__scroll__position').css('width', Math.round(k * 100)+'%');
        }
        
        var scrollRatio = ( $('.b-scroller__scrollable').outerWidth() - $('.b-scroller__scroll__position').width() - 14*2) / ( paneWidth - $('.b-scroller__scrollable').outerWidth() );
    };
})( jQuery );
