$(function(){
    $('.b-gallery-slideshow').slideshow({
        images: $('.b-gallery a'),
        data: galleryData
    });
});

(function( $ ){
    $.fn.slideshow = function(options) {
        var slideshowCont = this;
        var currentImage;
        
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
        
        var show = function(element) {
            var imageIndex = parseInt($(element).attr('id').split('_').pop());
            slideshowCont.show();
            $('.b-scroller').show();
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
        }
        
        var showImage = function(imageIndex) {
            var imageSize = getImageSize(imageIndex, controlsHidden);
            slideshowCont.find('.b-gallery__view__image__img').attr({
                src: options.data.photos[imageIndex].src
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
            $('#photo_thumb_'+imageIndex).addClass('b-scroller__image_active');
            $('.b-actions__action_download').attr('href', galleryData.photos[imageIndex].src);
            $('.b-gallery__view__image__info__title').text(galleryData.photos[imageIndex].title);
            $('.b-gallery__view__image__info__description').text(galleryData.photos[imageIndex].description);
            $('.b-gallery__view__image__info__link').attr('href', galleryData.photos[imageIndex].src).text(galleryData.photos[imageIndex].src.split('/').pop());
        }
        this.showImage = showImage;
        
        var hide = function() {
            $('.b-scroller').hide();
            $('.b-gallery').show();
            $('.b-gallery-slideshow').hide();
            $('.b-footer').show();
            $('.b-layout').removeClass('b-layout_inner');
            $('.b-pane__counter').hide();
            $('.b-pane__back').hide();
            $('.b-pane__photos-count').show();
            $('.b-actions__action_show-thumbnails, .b-actions__action_show-info, .b-actions__action_download').show();
            
            $('body').unbind('mousemove', onUserAction).css('overflow', 'auto');
            $('body').unbind('click', onUserAction).css('overflow', 'auto');
            
            clearTimeout(timer);
            
            location.hash = null;
        }
        
        var getImageSize = function(imageIndex, withoutControls) {
            var windowSize = getWindowSize();
            var maxWidth = windowSize.width - 15*2;
            var maxHeight = windowSize.height - 15*2 - ($('.b-gallery__view__image__info').is(':visible') ? $('.b-gallery__view__image__info').outerHeight() : 0);
            if (!withoutControls) {
                maxWidth -= 150*2; 
                maxHeight -= ($('.b-pane').is(':visible') ? 62 : 0) + ($('.b-scroller').is(':visible') ? 129 : 0);
            }
            var width, height, vmargin;
            if (maxWidth / options.data.photos[imageIndex].width > maxHeight / options.data.photos[imageIndex].height)  {
                height = maxHeight;
                width = options.data.photos[imageIndex].width * (maxHeight / options.data.photos[imageIndex].height);
                vmargin = 0;
            } else {
                width = maxWidth;
                height = options.data.photos[imageIndex].height * (maxWidth / options.data.photos[imageIndex].width);
                vmargin = (maxHeight - height) / 2;
            }
            return {width: Math.round(width), height:  Math.round(height), vmargin: Math.round(vmargin)};
        }
        
        var showControls = function() {
            var imageSize = getImageSize(currentImage);
            slideshowCont.find('.b-gallery__view__image__img').animate({
                width: imageSize.width,
                height: imageSize.height
            },{
                step: function(now, obj){
                    var props;
                    for (control in animatedControls) {
                        props = animatedControls[control].properties;
                        for (property in props) {
                            animatedControls[control].element.css(property, props[property].end + (props[property].start - props[property].end) * obj.pos + (props[property].units ? props[property].units : 0 ));
                        }
                    }
                }    
            });
            $('.b-pane').show();
            $('.b-scroller').show();
            $('.b-gallery__view__nav').show();
            controlsHidden = false;
        }
        
        var hideControls = function() {
            var imageSize = getImageSize(currentImage, true);
            $('.b-scroller, .b-pane').css('overflow', 'hidden');
            animatedControls.pane.properties.height.start = $('.b-pane').height();
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
                    var props;
                    for (control in animatedControls) {
                        props = animatedControls[control].properties;
                        for (property in props) {
                            animatedControls[control].element.css(property, props[property].start + (props[property].end - props[property].start) * obj.pos + (props[property].units ? props[property].units : 0 ));
                        }
                    }
                }
            });
            $('.b-gallery__view__nav').hide();
            controlsHidden = true;
        }
        
        var scrollImage = function(delta) {
            var newCurentImage = parseInt(currentImage)+delta;
            if (newCurentImage == galleryData.photos.length) {
                newCurentImage = 0;
            } else if (newCurentImage < 0) {
                newCurentImage = galleryData.photos.length - 1;
            }
            var oldImage = $('.b-gallery__view__image__wrapper img');
            var newImage = $('<img/>');
            newImage.attr('src', galleryData.photos[newCurentImage].src);
            $('body').append(newImage);
            var imageSize = getImageSize(newCurentImage);
            var windowSize = getWindowSize();
            newImage.css({
                position: 'absolute',
                top: $('.b-gallery__view').position().top+imageSize.vmargin,
                left: (delta < 0 ? -imageSize.width+'px' : windowSize.width),
                'z-index': 1000,
                width: imageSize.width,
                height: imageSize.height
            }).animate({
                left: (windowSize.width - imageSize.width) / 2
            });
            oldImage.css('position', 'relative').animate({
                left: delta*(oldImage.position().left - windowSize.width)
            },{
                complete: function(){
                    oldImage.css({
                        left: 0
                    });
                    showImage(newCurentImage);
                    newImage.remove();
                }    
            });
            currentImage = newCurentImage;
        }
        
        var scrollImageSlideshow = function() {
            var newCurentImage = parseInt(currentImage)+1;
            if (newCurentImage == galleryData.photos.length) {
                newCurentImage = 0;
            }
            showImage(newCurentImage);
            $('.b-gallery__view__image__wrapper img').css('opacity', 0).animate({opacity: 1});
        }
        
        var startSlideshow = function() {
            $('.b-scroller').hide();
            $('.b-gallery__view__image__info').addClass('b-gallery__view__image__info_small').removeClass('b-gallery__view__image__info_full');
            showImage(currentImage);
            $('.b-actions__action_slideshow span.text').text('Stop');
            slideshowInterval = setInterval(scrollImageSlideshow, 3000)
        }
        
        var stopSlideshow = function() {
            $('.b-scroller').show();
            $('.b-gallery__view__image__info').addClass('b-gallery__view__image__info_full').removeClass('b-gallery__view__image__info_small');
            showImage(currentImage);
            clearInterval(slideshowInterval);
            $('.b-actions__action_slideshow span.text').text('Slideshow');
            slideshowInterval = false;
        }
        
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
        }
        
        var onUserAction = function(){
            if (controlsHidden) {
                showControls();
            }
            clearTimeout(timer);
            timer = setTimeout(hideControls, 10000);
        }

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
                $('.b-actions__action_show-info span.text').text('Hide info');
            } else {
                $('.b-gallery__view__image__info').show();
                $('.b-actions__action_show-info span.text').text('Show info');
            }
            showImage(currentImage);
            e.preventDefault();
        }
        $('.b-actions__action_show-info').click(toggleInfo);
        $('.b-gallery__view__image__info__hide').click(toggleInfo);
        $('.b-actions__action_show-thumbnails').click(function(e){
            if ($('.b-scroller').is(':visible')) {
                $('.b-scroller').hide();
                $('.b-actions__action_show-thumbnails span.text').text('Hide thumbnails');
            } else {
                $('.b-scroller').show();
                $('.b-actions__action_show-thumbnails span.text').text('Show thumbnails');
            }
            showImage(currentImage);
            e.preventDefault();
        });
        $('.b-scroller__image img').live('click', function(){
            showImage(parseInt($(this).attr('rel').split('_').pop()));
        });
        $('.b-gallery__view__image__info__hide').click(toggleInfo);
        var timer;
        var controlsHidden = false;
        if (location.hash) {
            var hashImageIndex = parseInt(location.hash.substr(1));
            show($('#photo_'+hashImageIndex)[0]);
        }
    };
})( jQuery );
