function nextImage(left) {
	var size = $("#image_list li").size();
	var index = $("#canvas img").attr("alt");
	if (left) {
		if (index == 1) {
			index = size;
		} else {
			index--;
		}
	} else {
		if (index == size) {
			index = 1;
		} else {
			index++;
		}
	}
	loadImage(index, left);
}

function reposition(img) {
	img.css('left', ($(window).width() - img.width())/2);
	img.css('top', ($(window).height() - img.height())/2);
}
	
function slide(img, left) {
	var browserwidth = $(window).width();
	var browserheight = $(window).height();
	var left_init;
	if (left) {
		left_init = -browserwidth;
	} else {
		left_init = browserwidth;
	}
	img.stop().show().css({ "left" : left_init }).animate({left : (browserwidth - img.width())/2}, 900);
}
	
function slide2(left) {
	var browserwidth = $(window).width();
	var browserheight = $(window).height();
	var left_init;
	alert(browserwidth);
	$("#canvas img").each(function(index){
		var left = this.left();
		alert(left);
	});
	
}	
	
function loadImage(index, left) {
	$("#loading").show();
	$("#canvas img").remove();
	
	//alert("ASF");

	//var img = new Image();
	//img.src = $("#image_list li:nth-child(" +  index + ")").html();
	//img.alt = index;
	
	var src = $("#image_list li:nth-child(" +  index + ")").html();
	var img = $('<img src="'+src+'" alt="' + index + '"/>');
	img.addClass('image_init');
	img.hide();
	img.appendTo("#canvas");
	/*
	img.load(function() {
		$(this).data('origWidth', this.width).data('origHeight', this.height);	
		resize($(this));
		$(this).css('top', ($(window).height() - img.height())/2);
		//$(this).show();
		//slide($(this), left);
		$("#loading").hide();
	});
*/

//	var imgText = '<img src="' + $("#image_list li:nth-child(" +  index + ")").html() + '"/>'; 
//	$("#canvas").html(imgText);
//	var img = $("#canvas img");
//	alert(img.height());
//	img.data('origWidth', img.width()).data('origHeight', img.height());
//	alert(img.data('origWidth'));
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
	
	//reposition();
	
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

