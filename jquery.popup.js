$(function(){
    $('.b-context-popup').popup();
});

(function( $ ){
    $.fn.popup = function(options) {
    	var PADDING = 10;
    	var DURATION = 200;
    	
        var popupCont = this;
        var show = function(element){
            var elementIndex = $(element).attr('id').split('_').pop();            
            
            var initSize = {
                width: $(element).attr('width'),
                height: $(element).attr('height')    
            };
            popupCont.show();            
            popupCont.find('img').attr('src', $(element).attr('src')).css(initSize);            

            popupCont.find('.js-image-full').attr('rel', 'photo_'+elementIndex);
            popupCont.find('td.js-imageinfo-title').html(galleryData.photos[elementIndex].title);
            popupCont.find('td.js-imageinfo-published').html(galleryData.photos[elementIndex].published);
            popupCont.find('td.js-imageinfo-size').html(galleryData.photos[elementIndex].width+'x'+galleryData.photos[elementIndex].height);
            popupCont.find('td.js-imageinfo-filename').html(galleryData.photos[elementIndex].src.split('/').pop());
            
            var imgCont = popupCont.find('a.b-context-popup__image');
        	imgCont.css(initSize);
                    	
            var initLeft = $(element).position().left - (popupCont[0].offsetWidth - getElementWidth(element)) / 2;
            popupCont.css({
                left: initLeft,
                top: $(element).position().top - PADDING
            });  
            
            //imgCont.css({width: });
            
            popupCont.animate(getPopupPosition(element, elementIndex), DURATION);            
            var resize = new ImageResize(popupCont.find('img'));
            var resultImageSize = {
            	width: galleryData.photos[elementIndex].thumb_width,
            	height: galleryData.photos[elementIndex].thumb_height
            }; 
            resize.resize(resultImageSize.width, resultImageSize.height, DURATION);            
            //анимируем конейнер картинки            
        	imgCont.animate(resultImageSize, DURATION);
        };
        
        var getPopupPosition = function(element, elementIndex) {
        	var popupHeight = galleryData.photos[elementIndex].thumb_height + 2*PADDING;         	
        	//для определения ширины временно установим картинке оригинальный размер
        	var img = popupCont.find('img');
        	var oldW = img.css('width');
        	img.css({width: galleryData.photos[elementIndex].thumb_width});
        	popupCont.show();
        	popupWidth = popupCont[0].offsetWidth;
        	img.css({width: oldW});
        	
        	var imgWidth = getElementWidth(element);
        	var imgHeight = getElementHeight(element);        	
        	
        	return {
        		left: $(element).position().left - (popupWidth - imgWidth)/2,
        		top: $(element).position().top - (popupHeight - imgHeight)/2
        	};
        };
        
        var getElementWidth = function (element) {
        	return $(element).width() < $(element).parent().width() ? $(element).width() : $(element).parent().width();
        };
        
        var getElementHeight = function (element) {
        	return $(element).height() < $(element).parent().height() ? $(element).height() : $(element).parent().height();
        };
        
        var hide = function(){
            popupCont.hide();
        };
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
    };   
})( jQuery );
