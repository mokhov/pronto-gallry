$(function(){
    $('.b-context-popup').popup();
});

(function( $ ){
    $.fn.popup = function(options) {
    	var PADDING = 10;
    	var DURATION = 50;
    	
        var popupCont = this;
        var show = function(element){
            var elementIndex = $(element).attr('id').split('_').pop();            
            
            var initSize = {
                width: $(element).attr('width'),
                height: $(element).attr('height')    
            };
            popupCont.show();            
            popupCont.find('img').attr('src', $(element).attr('src')).css(initSize);            

            var data = galleryData.photos[elementIndex];
            
            popupCont.find('.js-image-full').attr('rel', 'photo_'+elementIndex);
            popupCont.find('td.js-imageinfo-title').html(data.title);
            popupCont.find('td.js-imageinfo-published').html(data.published);
            popupCont.find('td.js-imageinfo-size').html(data.width+'x'+data.height);
            popupCont.find('a.js-imageinfo-filename')
            	.attr('href', data.src)
            	.html(data.src.split('/').pop());
            
            var imgCont = popupCont.find('a.b-context-popup__image');
        	imgCont.css(initSize);
                    	
            var initLeft = $(element).parent().offset().left - (popupCont[0].offsetWidth - getElementWidth(element)) / 2;
            popupCont.css({
                left: initLeft,
                top: $(element).parent().offset().top - PADDING
            });  

            popupCont.animate(getPopupPosition(element, elementIndex), DURATION);            
            var resultImageSize = {
            	width: galleryData.photos[elementIndex].thumb_width,
            	height: galleryData.photos[elementIndex].thumb_height
            }; 
            popupCont.find('img').animate(resultImageSize, DURATION, 'linear');    
            //анимируем конейнер картинки            
        	imgCont.animate(resultImageSize, DURATION, 'linear');
        };

        var getPopupPosition = function(element, elementIndex) {
        	var popupHeight = galleryData.photos[elementIndex].thumb_height + 2*PADDING;         	
        	//для определения ширины временно установим картинке оригинальный размер
        	var img = popupCont.find('a.b-context-popup__image');
        	var oldW = img.css('width');
        	img.css({width: galleryData.photos[elementIndex].thumb_width});
        	popupCont.show();
        	popupWidth = popupCont[0].offsetWidth;
        	img.css({width: oldW});
        	
        	var imgWidth = getElementWidth(element);
        	var imgHeight = getElementHeight(element);   
        	
        	var left = $(element).parent().offset().left - (popupWidth - imgWidth)/2;
        	if(left < 0)
        		left = 0;
        	if(left + popupWidth > document.body.offsetWidth)
        		left = document.body.offsetWidth - popupWidth;
        	
        	return {
        		left: left,
        		top: $(element).parent().offset().top - (popupHeight - imgHeight)/2
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
