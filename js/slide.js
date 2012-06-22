function reposition(img) {
	img.css('left', ($(window).width() - img.width())/2);
	img.css('top', ($(window).height() - img.height())/2);
}

function print(str) {
	$("#console").append(str + "<br/>");
}

function status(str) {
	$("#status").text(str);
}
	
function slider(_index) {
	var canvas = $("#canvas");
	var list = $("#image_list");
	var size = list.find("li").size();
	var index = _index;
	
	//alert(index);
	//alert(nextIndex());
	//alert(preIndex());
	
	_init();
	
	function _init() {
		var container = loadContainer(index);
		container.data('left', 0);
		container.appendTo(canvas);
		
		var preContainer = loadContainer(preIndex());
		preContainer.data('left', -$(window).width());
		preContainer.css('left', -$(window).width()).prependTo(canvas);
		
		var nextContainer = loadContainer(nextIndex());
		nextContainer.data('left', $(window).width());
		nextContainer.css('left', $(window).width()).appendTo(canvas);
		
		$(document).click(function(e){
			var left;
			if (e.pageX < $(window).width() / 2) {
				left = false;
			} else {
				left = true;
			}
			slide(left);
		});
		
		$(document).drag(function(ev, dd) {
			canvas.find("div.image_container").each(function(index) {
				//status(dd.offsetX);
				$(this).css('left', $(this).data('left') + dd.offsetX );
			});
		}).drag("end", function(ev, dd) {
			if (Math.abs(dd.offsetX) < $(window).width()/3) {
				canvas.find("div.image_container").each(function(index) {
					$(this).stop().show().animate({left : $(this).data('left') }, 200, function() {					
					});
					$(this).css('left', $(this).data('left') + dd.offsetX );
				});
			} else if (dd.offsetX < 0) {
				slide(true);
			} else {
				slide(false);
			}
		});
		/*
		container.click(function(e){
			$( this ).css( event.shiftKey ? {
                        top: event.offsetY } : {
                        left: event.offsetX
                        });
                });
		*/
		$(document).keydown(function(e) {
			var code = e.keyCode || e.which;
			var arrow = {left: 37, up: 38, right: 39, down: 40 };

			switch (code) {
				case arrow.left:
				case arrow.up:
					slide(true);
				break;
				case arrow.right:
				case arrow.down:
					slide(false);
				break;
			}
		});
		
		$(window).resize(function() {
			var img = $("#canvas img");
			resize(img);
			//reposition(img, true);
		});
	}
	
	function nextIndex() {
		if (index < size) {
			return parseInt(index) + 1;
		} else {
			return 1;
		}
	}
	
	function preIndex() {
		if (index == 1) {
			return size;
		} else {
			return index - 1;
		}
	}
	
	function slide(left) {
		var browserwidth = $(window).width();
		var browserheight = $(window).height();
		
		if (left) {
			canvas.find("div.image_container:nth-child(1)").remove();
		} else {
			canvas.find("div.image_container:nth-child(3)").remove();
		}
		
		
		canvas.find(".image_container").each( function(idx){
			if (left) {
				$(this).stop().show().animate(
					{left : $(this).data('left') - browserwidth }, 
					{duration: 'fast', 
					 //easing: 'easeOutBack', 
					 complete: function() {					
						var leftPosition = $(this).data('left');
						$(this).data('left', leftPosition-browserwidth);
					}});
			} else {
				$(this).stop().show().animate({left : ($(this).data('left') + browserwidth) }, "fast", function() {
					var leftPosition = $(this).data('left');
					$(this).data('left', leftPosition+browserwidth);
				});
			}
		});
		
		if (left) {
			index = canvas.find("div:nth-child(2)").attr('id');
			var rightContainer = loadContainer(nextIndex());
			rightContainer.data('left', $(window).width());
			rightContainer.css('left', browserwidth).appendTo(canvas);
		} else {
			index = canvas.find("div:nth-child(1)").attr('id');
			var leftContainer = loadContainer(preIndex());
			leftContainer.data('left', -$(window).width());
			leftContainer.css('left', -browserwidth).prependTo(canvas);
		}
			

	}
	
	function loadContainer(index) {
		var container = $("<div class='image_container' id='" + index + "'></div>");
		loading(container);
		
		var img = loadImage(index);
		
		img.load(function() {
			$(this).data('origWidth', this.width).data('origHeight', this.height);	
			//$(this).css('top', ($(window).height() - this.height)/2);
			finishLoad(container);
			$(this).appendTo(container);
			resize($(this));
		}); 
		return container;
	}
	
	function loading(container) {
		var img = $("<img src='images/loading.gif'/>");
		img.load(function(){
			$(this).css('left', -this.width/2).css('top', -this.height/2)
		});
		var loading = $("<div class='loading'></div>");
		img.appendTo(loading);
		loading.appendTo(container);
	}
	
	function finishLoad(container) {
		container.find("div.loading").remove();
	}
	
	function loadImage(index) {
		var src = $("#image_list li:nth-child(" +  index + ")").html();
		var img = $('<img src="'+src+'"/>');
		img.addClass('image_init');

		return img;
	}
}


function resize(img){
	thisSlide = img;
	var orig_height = thisSlide.data('origHeight');
	var orig_width = thisSlide.data('origWidth');
	var ratio = (orig_height/orig_width).toFixed(2);	// Define image ratio
	var browserwidth = $(window).width();
	var browserheight = $(window).height();
	
	var min_height = 200;
	var min_width = 200;
	var fit_landscape = true;
	var fit_portrait = true;
	var fit_always = true;
	
	/*-----Resize Image-----*/
	if (fit_always){	// Fit always is enabled
		if ((browserheight/browserwidth) > ratio){
			if (browserwidth < orig_width) {
				resizeWidth();
			}
		} else {
			if (browserheight < orig_height) {
				resizeHeight();
			}
		}
	} else {	// Normal Resize
		if ((browserheight <= min_height) && (browserwidth <= min_width)){	// If window smaller than minimum width and height
			if ((browserheight/browserwidth) > ratio){
				fit_landscape && ratio < 1 ? resizeWidth(true) : resizeHeight(true);	// If landscapes are set to fit
			} else {
				fit_portrait && ratio >= 1 ? resizeHeight(true) : resizeWidth(true);		// If portraits are set to fit
			}
						
		} else if (browserwidth <= min_width){		// If window only smaller than minimum width
						
			if ((browserheight/browserwidth) > ratio){
				fit_landscape && ratio < 1 ? resizeWidth(true) : resizeHeight();	// If landscapes are set to fit
			} else {
				fit_portrait && ratio >= 1 ? resizeHeight() : resizeWidth(true);		// If portraits are set to fit
			}
							
		} else if (browserheight <= min_height){	// If window only smaller than minimum height
						
			if ((browserheight/browserwidth) > ratio){
				fit_landscape && ratio < 1 ? resizeWidth() : resizeHeight(true);	// If landscapes are set to fit
			} else {
				fit_portrait && ratio >= 1 ? resizeHeight(true) : resizeWidth();		// If portraits are set to fit
			}
						
		} else {	// If larger than minimums
							
			if ((browserheight/browserwidth) > ratio){
				fit_landscape && ratio < 1 ? resizeWidth() : resizeHeight();	// If landscapes are set to fit
			} else {
				fit_portrait && ratio >= 1 ? resizeHeight() : resizeWidth();		// If portraits are set to fit
			}
							
		}
	}
	
	reposition();
	
	function resizeWidth(minimum){
		if (minimum){	// If minimum height needs to be considered
			if(thisSlide.width() < browserwidth || thisSlide.width() < min_width ){
				if (thisSlide.width() * ratio >= min_height){
					thisSlide.width(min_width);
					thisSlide.height(thisSlide.width() * ratio);
				}else{
					resizeHeight();
				}
			}
		}else{
			if (min_height >= browserheight && !fit_landscape){	// If minimum height needs to be considered
				if (browserwidth * ratio >= min_height || (browserwidth * ratio >= min_height && ratio <= 1)){	// If resizing would push below minimum height or image is a landscape
					thisSlide.width(browserwidth);
					thisSlide.height(browserwidth * ratio);
				} else if (ratio > 1){		// Else the image is portrait
					thisSlide.height(min_height);
					thisSlide.width(thisSlide.height() / ratio);
				} else if (thisSlide.width() < browserwidth) {
					thisSlide.width(browserwidth);
						thisSlide.height(thisSlide.width() * ratio);
				}
			}else{	// Otherwise, resize as normal
				thisSlide.width(browserwidth);
				thisSlide.height(browserwidth * ratio);
			}
		}
	};

	function resizeHeight(minimum){
		if (minimum){	// If minimum height needs to be considered
			if(thisSlide.height() < browserheight){
				if (thisSlide.height() / ratio >= min_width){
					thisSlide.height(min_height);
					thisSlide.width(thisSlide.height() / ratio);
				}else{
					resizeWidth(true);
				}
			}
		}else{	// Otherwise, resized as normal
			if (min_width >= browserwidth){	// If minimum width needs to be considered
				if (browserheight / ratio >= min_width || ratio > 1){	// If resizing would push below minimum width or image is a portrait
					thisSlide.height(browserheight);
					thisSlide.width(browserheight / ratio);
				} else if (ratio <= 1){		// Else the image is landscape
					thisSlide.width(min_width);
		    		thisSlide.height(thisSlide.width() * ratio);
				}
			}else{	// Otherwise, resize as normal
				thisSlide.height(browserheight);
				thisSlide.width(browserheight / ratio);
			}
		}
	};
	
	function reposition() {
		thisSlide.css('left', (browserwidth - thisSlide.width())/2);
		thisSlide.css('top', (browserheight - thisSlide.height())/2);
	}
}

