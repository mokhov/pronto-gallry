$(function(){
    $('.b-gallery').gallery({
        maxWidth: 300,
        minWidth: 100,
        maxHeight: 180,
        minHeight: 90,
        interval: 10,
        data: galleryData
    });
});

(function( $ ){
    $.fn.gallery = function(options) {
        
        var getGalleryContWidth = function(){
            return galleryCont.width();
        };
        
        var obeyConstraints = function() {
            for (var i=0, n=data.photos.length, photos=data.photos; i<n; i++) {
            	var width = photos[i].thumb_width * .9;
            	var height = photos[i].thumb_height * .9;
            	//�������� �� ������
            	if(height > options.maxHeight) {
	            	width *= options.maxHeight / height;
	            	height = options.maxHeight;
            	}
            	//���� ������� �� ������������ ������ - ��������� ������
            	if(width > options.maxWidth) {
            		height = height * options.maxWidth / width;    		
            		width = options.maxWidth;
            	}
            	
            	if(height < options.minHeight) {
        			var newHeight = photos[i].thumb_height > options.minHeight ? options.minHeight : photos[i].thumb_height;  
        			photos[i].thumb_cont_width = options.maxWidth;
        			
        			width *= newHeight / height; 
        			height = newHeight;
        		}
            	//���� ����� ���� ����������� ������ ���������� ������ ����������� - ������ ������
            	if(width < options.minWidth) {
            		if(photos[i].thumb_width > options.minWidth) {
            			var newWidth = options.minWidth;
            		} else {
            			var newWidth = photos[i].thumb_width;
            			photos[i].thumb_cont_width = options.minWidth;
            		}
            		height *= newWidth / width;
            		width = newWidth;
            	}
            	
            	//��������� ������ ����������
            	photos[i].thumb_cont_height = options.maxHeight;
            	
            	photos[i].thumb_fixed_width = width;
                photos[i].thumb_fixed_height = height;
            }
        };
        
        var splitByRows = function(){
            var curImagesWidth = 0;
            var firstInRow = 0;
            var j, k;
            for (var i=0, n=data.photos.length, photos=data.photos; i<n; i++) {
                photos[i].thumb_inrow_width = photos[i].thumb_fixed_width;
                photos[i].thumb_inrow_height = photos[i].thumb_fixed_height;
                photos[i].firstInRow = false;
                curImagesWidth += (photos[i].thumb_cont_width ? photos[i].thumb_cont_width : photos[i].thumb_fixed_width) + options.interval;
                if (curImagesWidth >= galleryContWidth) {
                    //k = (curImagesWidth - (i-firstInRow-1)*options.interval) / (galleryContWidth - (i-firstInRow+1)*options.interval);
                	k = (galleryContWidth - (i-firstInRow)*options.interval) / curImagesWidth;
                	
                    for (j=firstInRow; j<=i; j++) {
                    	
                        photos[j].thumb_inrow_width = Math.round(photos[j].thumb_fixed_width * k);
                        photos[j].thumb_inrow_height = Math.round(photos[j].thumb_fixed_height * k);
                        if (photos[j].thumb_cont_width) {
                            photos[j].thumb_cont_width = Math.round(photos[j].thumb_cont_width * k);
                        }
                        if (photos[j].thumb_cont_height) {
                            photos[j].thumb_cont_height = Math.round(photos[j].thumb_cont_height * k);
                        }
                    }
                    photos[firstInRow].firstInRow = true;
                    curImagesWidth = 0;
                    firstInRow = i + 1;
                }
            }
            photos[firstInRow].firstInRow = true;
        };
        
        var createImages = function(){
            var image, link;
            for (var i=0, n=data.photos.length, photos=data.photos; i<n; i++) {
                image = $('<img/>');
                link = $('<a/>');
                if(isCanvasSupported()) {
                	image.load(replaceImageToCanvas);
                }
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
            galleryCont.append('<div class="clearer"></div>');
            setInrowSizes();
        };
        
        var replaceImageToCanvas = function() {
        	var canvas = document.createElement('canvas');
        	canvas.width = this.width;
        	canvas.height = this.height;
        	$(canvas).css('margin-top', $(this).css('margin-top'));
        	
        	var ctx = canvas.getContext('2d');
        	ctx.drawImage(this, 0, 0, this.width, this.height);
        	$(this).after(canvas);
        	$(this).hide();
        };
        
        var setInrowSizes = function(updateCanvas){
            var photos = galleryData.photos;
            galleryCont.find('img').each(function(i){
                $(this).attr({
                    width: data.photos[i].thumb_inrow_width,
                    height: data.photos[i].thumb_inrow_height
                });
                if (photos[i].thumb_cont_width || photos[i].thumb_cont_height) {
                    $(this).parent().css('width', photos[i].thumb_cont_width);
                    $(this).parent().css('height', photos[i].thumb_cont_height);
                    if (photos[i].thumb_cont_height > photos[i].thumb_inrow_height) {
                        $(this).css('margin-top', (photos[i].thumb_cont_height - photos[i].thumb_inrow_height)/2);
                    }
                }
                if(updateCanvas && isCanvasSupported()) {
                	$(this).show();
                	$(this).parent().find('canvas').remove();
                	replaceImageToCanvas.call(this);
                }
                if(data.photos[i].firstInRow)
                	$(this).parent().before('<div class="clearer js_galery_clearer"></div>');
            });
        };
        
        var _isCanvasSupported = null;
        
        var isCanvasSupported = function() {
        	if(_isCanvasSupported === null) {
        		var canvas = document.createElement('canvas');
        		_isCanvasSupported = !!canvas.getContext && !!canvas.getContext('2d');
        	}
        	return _isCanvasSupported;
        };
        
        $(window).resize(function(){
        	$('.js_galery_clearer').remove();
        	
            galleryContWidth = getGalleryContWidth();
            obeyConstraints();
            splitByRows();
            setInrowSizes(true);
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
