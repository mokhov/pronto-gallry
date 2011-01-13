$(function(){
    var tt = $('.b-scroller').scroller();
});

var g_scrollerUpdate;

(function( $ ){
    $.fn.scroller = function(options) {
    	var THUMB_HEIGHT = 90;
    	var scrollRatio;
    	
        var scroll = function(delta) {
        	var currentLeft = $('.b-scroller__scroll__position').position().left;         	
        	var newLeft = currentLeft - delta; 
        	
        	var minLeft = 14;
        	var maxLeft = $('.b-scroller__scrollable').outerWidth() - 16 - $('.b-scroller__scroll__position').width();
        	
            if (newLeft < minLeft) {
                newLeft = minLeft;
            } else if (newLeft > maxLeft) {
            	newLeft = maxLeft;
            }
            $('.b-scroller__scroll__position').css('left', newLeft);
            $('.b-scroller__scrollable').css('left', -(newLeft - minLeft) / scrollRatio );
        };
        
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
        })
        .mouseup(function(){
            mouseDown = false; 
        })
        .mouseleave(function(){
        	mouseDown = false; 
        });
        
        $('.b-scroller__scroll__arrow_left').click(function(){
            scroll(100*scrollRatio);    
        });
        $('.b-scroller__scroll__arrow_right').click(function(){
            scroll(-100*scrollRatio);    
        });
        
        $('.b-scroller__scroll').click(function(e){
        	if(e.target.className == this.className) {
        		var mult = e.pageX < $('.b-scroller__scroll__position').position().left ? 1 : -1;
        		scroll(mult * $('.b-scroller__scroll__position')[0].offsetWidth);
        	}
        });
        
        var span, img, paneWidth = 10;
        for (var i=0, n=galleryData.photos.length; i<n; i++) {
            img = $('<img/>');
            img.attr({
                src: galleryData.photos[i].thumb_src,
                height: THUMB_HEIGHT,
                width: Math.round(galleryData.photos[i].thumb_width * THUMB_HEIGHT / galleryData.photos[i].thumb_height),
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
            paneWidth += Math.round(galleryData.photos[i].thumb_width * THUMB_HEIGHT / galleryData.photos[i].thumb_height) + 10;
        }
        
        function update() {
        	var k = $('.b-scroller__scrollable').width() / paneWidth;
            if (k>1) {
                $('.b-scroller__scroll').hide();
            } else {
                $('.b-scroller__scroll__position').css('width', Math.round(k * 100)+'%');
            }
            
            scrollRatio = ( $('.b-scroller__scrollable').outerWidth() - $('.b-scroller__scroll__position').width() - 14) / ( paneWidth - $('.b-scroller__scrollable').outerWidth() );
            scroll(0);
        }
        
        g_scrollerUpdate = update;
        
        $(window).resize(update);
        
    };
})( jQuery );
