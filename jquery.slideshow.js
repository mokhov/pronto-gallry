$(function(){
    $('.b-gallery-slideshow').slideshow({
        images: $('.b-gallery a'),
        data: galleryData
    });
});

$.easing.custom = function (x, t, b, c, d){
	var tt = t/d;	
	var k = 0.5;	
	if(tt < 0.5)
		var res =  .5 * (1 - Math.sqrt((0.5-tt)*k*2) / Math.sqrt(1 - k));
	else
		var res = .5 * (1 + Math.sqrt((tt-.5)*k*2) / Math.sqrt(1 - k));
	return res;
};

if($.browser.msie)
	$.easing.custom = $.easing.linear;
//else
//	$.easing.custom = $.easing.swing;

(function( $ ){
	var options;
	var currentImage;
	var slideshowCont;
	var isScrollerHidden = false;
	
	var getWindowSize = function() {
        var myWidth = 0, myHeight = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }            
        return {width: myWidth, height: myHeight};
    };
	
	var getImageSize = function(imageIndex, withoutControls, forceScroller) {
        var windowSize = getWindowSize();
        var maxWidth = windowSize.width - 15*2;
        var maxHeight = windowSize.height - 15*2 - ($('.b-gallery__view__image__info').is(':visible') ? $('.b-gallery__view__image__info').outerHeight() : 0);
        if (!withoutControls) {
            maxWidth -= 150*2; 
            maxHeight -= ($('.b-pane').is(':visible') ? 62 : 0);
        }
        
        if(forceScroller !== undefined)
        	var isSroller = forceScroller;
        else
        	var isSroller = !withoutControls && !isScrollerHidden && $('.b-scroller').is(':visible');
        if(isSroller)
        	maxHeight -= 124;
        
        var vmargin = 0;        
        var height = options.data.photos[imageIndex].height;
        var width = options.data.photos[imageIndex].width;
        
        if(width > maxWidth || height > maxHeight) {
	        if (maxWidth / options.data.photos[imageIndex].width > maxHeight / options.data.photos[imageIndex].height)  {
	            height = maxHeight;
	            width = options.data.photos[imageIndex].width * (maxHeight / options.data.photos[imageIndex].height);
	        } else {
	            width = maxWidth;
	            height = options.data.photos[imageIndex].height * (maxWidth / options.data.photos[imageIndex].width);	        	
	            vmargin = (maxHeight - height) / 2;
	        }
        
        } else {
        	//image don't need resize
        	vmargin = (maxHeight - height) / 2;
        }
        return {width: Math.round(width), height:  Math.round(height), vmargin: Math.round(vmargin)};
    };
	
	
	//управляет анимацией появления/изчезновения элементов управления
	var AnimatedControls = function() {
		//анимированные элементы
		var animatedControls = {
            pane: {
                element: $('.b-pane'),
                properties: {
                    height: {
                        start: $('.b-pane').height(),
                        end: 0
                    },
                    'padding-top': {
                        start: 1,
                        end: 0,
                        units: 'em'
                    },
                    'padding-bottom': {
                        start: .5,
                        end: 0,
                        units: 'em'
                    }
                }
            },
            scroller: {
                element: $('.b-scroller'),
                properties: {
                    height: {
                        start: $('.b-scroller').height(),
                        end: 0
                    }
                }
            }
        };
		
		var controlsHidden = false;
		
		this.isHidden = function() {return controlsHidden;};
		
		function isControlInList(control, controls) {
			if(!controls)
				return true;
			for(var i=0; i<controls.length; i++) {
				if(controls[i] == control)
					return true;
			}
			return false;
		};
		
		var eachControlProp = function(controls, lambda) {
			var props;
            for (var control in animatedControls) {
            	if(!isControlInList(control, controls))
            		continue;
            	
            	if(!controls && isScrollerHidden && control == 'scroller')
            		continue;
            	
                props = animatedControls[control].properties;
                for (var property in props) {
                	lambda(animatedControls[control], property, props[property]);                    
                }
            }
		};
		
		var showControls = function(controls) {
			if(controls && controls[0] == 'scroller')
        		var imageSize = getImageSize(currentImage, controlsHidden, true);
        	else
        		var imageSize = getImageSize(currentImage);
			
            slideshowCont.find('.b-gallery__view__image__img').animate({
                width: imageSize.width,
                height: imageSize.height
            },{
                step: function(now, obj){                	
                	eachControlProp(controls, function(control, propName, property){
                		control.element.css(propName, property.end + (property.start - property.end) * obj.pos + (property.units ? property.units : 0 ));
                	});
                }    
            });
            
            if(!controls) {
            	$('.b-pane').show();
            	$('.b-gallery__view__nav').show();
            }
        };
        this.show = function(){
        	showControls();
        	controlsHidden = false;
        };
        
        var hideControls = function(controls) {
        	if(controls && controls[0] == 'scroller')
        		var imageSize = getImageSize(currentImage, false, false);
        	else
        		var imageSize = getImageSize(currentImage, true);
            
            $('.b-scroller, .b-pane').css('overflow', 'hidden');            
        	animatedControls.pane.properties.height.start = $('.b-pane').height();
        	if(!isScrollerHidden)
        		animatedControls.scroller.properties.height.start = $('.b-scroller').height();
            if (imageSize.vmargin > 0) {
                animatedControls.wrapper = {
                    element: $('.b-gallery__view__image__wrapper'),
                    properties: {
                        'margin-top': {
                            start: parseInt($('.b-gallery__view__image__wrapper').css('margin-top')),
                            end: imageSize.vmargin,
                            units: 'px'
                        },
                        'margin-bottom': {
                            start: parseInt($('.b-gallery__view__image__wrapper').css('margin-bottom')),
                            end: imageSize.vmargin,
                            units: 'px'
                        }
                    }
                };
            } else {
                delete animatedControls.wrapper;
            }
            slideshowCont.find('.b-gallery__view__image__img').animate({
                width: imageSize.width,
                height: imageSize.height
            },{
                step: function(now, obj){
                	eachControlProp(controls, function(control, propName, property){                		
                		control.element.css(propName, property.start + (property.end - property.start) * obj.pos + (property.units ? property.units : 0 ));
                	});                	
                }
            });
            
            if(!controls)
            	$('.b-gallery__view__nav').hide();            
        };
        
        this.hide = function() {
        	hideControls();
        	controlsHidden = true;
        };
        
        this.hideScroller = function() {
        	hideControls(['scroller','wrapper']);
        	isScrollerHidden = true;
        };
        
        this.showScroller = function() {
        	isScrollerHidden = false;
        	showControls(['scroller', 'wrapper']);
        	
        	$('.b-scroller').css({height:100});
        };
	};
	
	
    $.fn.slideshow = function(_opt) {
    	options = _opt;
        slideshowCont = this;        
        var shown = false;
        var isScrollImage;
        
        var SCROLL_DURATION = 700;
        var SLIDESHOW_DURATION = 3000;
        
        var animatedControls = new AnimatedControls();
        
        var show = function(element) {
        	$(document.body).removeClass('body-gallery');
        	
            var imageIndex = parseInt($(element).attr('id').split('_').pop());
            slideshowCont.show();
            $('.b-scroller').show();
            g_scrollerUpdate();
            $('.b-gallery').hide();
            $('.b-context-popup').hide();
            $('.b-footer').hide();
            $('.b-layout').addClass('b-layout_inner');
            $('.b-pane__counter').show();
            $('.b-pane__back').show();
            $('.b-pane__photos-count').hide();
            $('.b-actions__action_show-thumbnails, .b-actions__action_show-info, .b-actions__action_download').show();
            
            showImage(imageIndex);
            
            $('body').bind('mousemove', onUserAction).css('overflow', 'hidden');
            $('body').bind('click', onUserAction).css('overflow', 'hidden');
            
            shown = true;
            isScrollImage = false;
            //IE6 fix
            if($.browser.msie) {
            	$('.b-gallery__view__nav').hide();
	            setTimeout(function(){
	            	$('.b-gallery__view__nav').show();
	            },10);
            }
        };
        
        var showImage = function(imageIndex, sourceImage) {
            var imageSize = getImageSize(imageIndex, animatedControls.isHidden());
            slideshowCont.find('.b-gallery__view__image__img').attr({
                src: sourceImage ? sourceImage.src : options.data.photos[imageIndex].src
            }).css({
                width: imageSize.width,
                height: imageSize.height    
            });
            slideshowCont.find('.b-gallery__view__image__wrapper').css({
                'margin-top': imageSize.vmargin,
                'margin-bottom': imageSize.vmargin
            });
            
            location.hash = imageIndex;
            
            currentImage = imageIndex;
            
            $('.b-pane__index-current').text(imageIndex+1);
            $('.b-scroller__image_active').removeClass('b-scroller__image_active');
            $('#photo_thumb_'+imageIndex).parent().addClass('b-scroller__image_active');
            $('.b-actions__action_download').attr('href', galleryData.photos[imageIndex].src);
            $('.b-gallery__view__image__info__title').text(galleryData.photos[imageIndex].title);
            $('.b-gallery__view__image__info__description').text(galleryData.photos[imageIndex].description);
            $('.b-gallery__view__image__info__link').attr('href', galleryData.photos[imageIndex].src).text(galleryData.photos[imageIndex].src.split('/').pop());
        };
        this.showImage = showImage;
        
        $(window).resize(function(){
        	if(shown)
        		showImage(currentImage);
        });
        
        var hide = function() {
        	if(isSlideshowStarted())
        		stopSlideshow();
        	
        	$(document.body).addClass('body-gallery');
        	
            $('.b-scroller').hide();
            $('.b-gallery').show();
            $('.b-gallery-slideshow').hide();
            $('.b-footer').show();
            $('.b-layout').removeClass('b-layout_inner');
            $('.b-pane__counter').hide();
            $('.b-pane__back').hide();
            $('.b-pane__photos-count').show();
            $('.b-actions__action_show-thumbnails, .b-actions__action_show-info, .b-actions__action_download').hide();
            
            $('body').unbind('mousemove', onUserAction).css('overflow', '');
            $('body').unbind('click', onUserAction);
            
            clearTimeout(timer);
            
            location.hash = null;
            
            shown = false;
        };
        
        var scrollImage = function(delta) {
        	if(isScrollImage)
        		return;
        	
            var newCurentImage = parseInt(currentImage)+delta;
            if (newCurentImage == galleryData.photos.length) {
                newCurentImage = 0;
            } else if (newCurentImage < 0) {
                newCurentImage = galleryData.photos.length - 1;
            }
            var oldImage = $('.b-gallery__view__image__wrapper');
            var newImage = oldImage.clone();
            newImage.find('img').attr('src', galleryData.photos[newCurentImage].src);
            $('body').append(newImage);
            var imageSize = getImageSize(newCurentImage);
            var windowSize = getWindowSize();
            $('.b-gallery__view__image__info__title', newImage).text(galleryData.photos[newCurentImage].title);
            $('.b-gallery__view__image__info__description', newImage).text(galleryData.photos[newCurentImage].description);
            $('.b-gallery__view__image__info__link', newImage).text(galleryData.photos[newCurentImage].src.split('/').pop());
            newImage.find('img').css({
                width: imageSize.width,
                height: imageSize.height
            });
            imageSize.width = newImage[0].offsetWidth; 
            newImage.css({
                position: 'absolute',
                top: $('.b-gallery__view').position().top+imageSize.vmargin,
                left: (delta < 0 ? -imageSize.width+'px' : windowSize.width),
                'z-index': 1000,
                margin: 0
            });
            
            newImage.animate({
                left: (windowSize.width - imageSize.width) / 2
            }, SCROLL_DURATION, 'custom');
            //остановим таймер салйдшоу, если оно запущено
            if(isSlideshowStarted)
            	clearInterval(slideshowInterval);
            
            
            isScrollImage = true;
            
            oldImage.css('position', 'relative').animate(
            	{
	                left: Math.round(delta*(oldImage.position().left - windowSize.width))
	            }
            	, SCROLL_DURATION, 'custom',
            	function(){
                    oldImage.css({
                        left: 0
                    });
                    showImage(newCurentImage);
                    newImage.remove();
                    //возобюновим слайдшоу
                    if(isSlideshowStarted())
                    	slideshowInterval = setInterval(scrollImageSlideshow, SLIDESHOW_DURATION);
                    
                    isScrollImage = false;
                }
            );
            currentImage = newCurentImage;
        };
        
        var scrollImageSlideshow = function() {
        	var newCurentImage = parseInt(currentImage)+1;
            if (newCurentImage == galleryData.photos.length) {
                newCurentImage = 0;
            }
        	
            var image = new Image();
            image.onload = function() {
            	$('.b-gallery__view__image__wrapper img').css('opacity', 0);        	
                showImage(newCurentImage, image);
                $('.b-gallery__view__image__wrapper img').animate({opacity: 1});
            };
            image.src = options.data.photos[newCurentImage].src;        	
        };
        
        
        var slideshowInterval = false;
        var slideshow_isThumnails = true;
        
        var isSlideshowStarted = function() {
        	return slideshowInterval !== false;
        };
        
        var startSlideshow = function() {   
        	if(isSlideshowStarted()) {
        		clearInterval(slideshowInterval);
        	}         	
            $('.b-gallery__view__image__info').addClass('b-gallery__view__image__info_small').removeClass('b-gallery__view__image__info_full');
            showImage(currentImage);
            $('.b-actions__action_slideshow span.text').text('Stop');
            $('.b-actions__action_slideshow').addClass('stop');
            
            slideshow_isThumnails = !isScrollerHidden;
            if(slideshow_isThumnails)
            	animatedControls.hideScroller();
            $('.b-actions__action_show-thumbnails').hide();
            $('.b-actions__action_download').hide();            
            
            slideshowInterval = setInterval(scrollImageSlideshow, SLIDESHOW_DURATION);
            
        };
        
        var stopSlideshow = function() {
        	if(slideshow_isThumnails)
        		animatedControls.showScroller();
        	else
        		showImage(currentImage);
            $('.b-actions__action_show-thumbnails').show();
            $('.b-actions__action_download').show();
            $('.b-gallery__view__image__info').addClass('b-gallery__view__image__info_full').removeClass('b-gallery__view__image__info_small');            
            clearInterval(slideshowInterval);
            $('.b-actions__action_slideshow span.text').text('Slideshow');
            $('.b-actions__action_slideshow').removeClass('stop');
            slideshowInterval = false;
        };
        
        
        var lastMouseMovePos = {x:0, y:0};
        
        function getMouseMoveDelta(e) {
        	var dx = Math.abs(lastMouseMovePos.x - e.pageX);
    		var dy = Math.abs(lastMouseMovePos.y - e.pageY);
    		var delta = dx + dy;        		        		
    		lastMouseMovePos.x = e.pageX;
    		lastMouseMovePos.y = e.pageY;
    		return delta;
        }
        
        var onUserAction = function(e){
        	if(e.type == 'mousemove') {
        		var delta = getMouseMoveDelta(e);
        		if(delta < 1)
        			return;        		
        	}
        	
        	
            if (animatedControls.isHidden()) {
            	animatedControls.show();
            }
            clearTimeout(timer);
            
            if(isSlideshowStarted())
            	timer = setTimeout(animatedControls.hide, 3000);
            else
            	timer = setTimeout(animatedControls.hide, 10000);
        };

        options.images.click(function(){
            show($(this).find('img')[0]);
            return false;
        });
        $('.b-context-popup .js-image-full').click(function(){
            show($('#'+$(this).attr('rel'))[0]);
            return false;
        });
        $('.b-gallery__view__nav_next').click(function(e){
            scrollImage(1);
            e.preventDefault();
        });
        $('.b-gallery__view__nav_prev').click(function(e){
            scrollImage(-1);
            e.preventDefault();
        });
        $('.b-pane__back').click(function(){
            hide();
            return false;
        });
        var slideshowInterval;
        $('.b-actions__action_slideshow').click(function(){
            if (slideshowInterval) {
                stopSlideshow();
            } else {
                if (!shown) {
                    show($('#photo_0')[0]);    
                }
                startSlideshow();
            }
            return false;
        });
        var toggleInfo = function(e){
            if ($('.b-gallery__view__image__info').is(':visible')) {
                $('.b-gallery__view__image__info').hide();
                $('.b-actions__action_show-info span.text').text('Show info');
            } else {
                $('.b-gallery__view__image__info').show();
                $('.b-actions__action_show-info span.text').text('Hide info');
            }
            showImage(currentImage);
            e.preventDefault();
        };
        
        $('.b-actions__action_show-info').click(toggleInfo);
        $('.b-gallery__view__image__info__hide').click(toggleInfo);
        
        $('.b-actions__action_show-thumbnails').click(function(e){
            if (isScrollerHidden) {
            	animatedControls.showScroller();
            	$('.b-actions__action_show-thumbnails span.text').text('Hide thumbnails');
            } else {
            	animatedControls.hideScroller();
            	$('.b-actions__action_show-thumbnails span.text').text('Show thumbnails');
            }
            e.preventDefault();
        });
        $('.b-scroller__image img').live('click', function(){
            showImage(parseInt($(this).attr('rel').split('_').pop()));
        });
        var timer;        
        if (location.hash) {
            var hashImageIndex = parseInt(location.hash.substr(1));
            if(!isNaN(hashImageIndex)) 
            	show($('#photo_'+hashImageIndex)[0]);
        }
    };
})( jQuery );
