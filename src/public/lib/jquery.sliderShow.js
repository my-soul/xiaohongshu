///页面 某部分内容滑入

/* $("XXXX").sliderShow({'width':'80%','height':'80%','direction':'left'})
*direction:方向
*width 默认为80%
*height 默认为80%
*/
(function($){
	
	$.fn.sliderShow = function(cfg){
		var that=$(this);
		that.show();
		cfg=$.extend({
			"direction":"left"				
		},cfg);
		var defaults={
			"direction":"left"
		};
		var html=$('<div class="f_slider j_sliderShow"><div class="f_slider_mask j_sliderMask"></div></div>');
		var slideMain=$('<div class="f_slideMain j_slideMain"></div>').append($(this));
		html.append(slideMain); 
		$("body").append(html);
		
		var sBox=$(".j_sliderShow");
		//初始
		sBox.show(); 
		var wH=window.screen.availHeight;
		var bW=$("body").width(); 
		var boxH=slideMain.height(); 
		var direction=cfg.direction; 
		slideMain.css({"width":cfg.width});
		/*$("body,html").height(boxH>wH?boxH:wH).css('overflow','hidden');		*/
		//$("body,html").scrollTop(0).height(wH).css('overflow','hidden');		 
		slideMain.height(wH);
		$(".j_sliderMask").width(bW).height(wH);
		function initFn(){
			if(cfg.direction){
				var cfgWidth=cfg.width?cfg.width:"80%";
				var cfgHeight=cfg.height?cfg.height:"80%"; 
				switch (cfg.direction){
					case "left":						
						slideMain.css({"width":cfgWidth,"top":0,"left":'-'+cfgWidth}); 
						break;
					case "right":
						slideMain.css({"width":cfgWidth,"top":0,"right":'-'+cfgWidth}); 
						break;
					case "top":						
						slideMain.css({"height":cfgHeight,"width":'100%',"bottom":'-'+'100%'}); 
						break; 
					case "bottom":						
						slideMain.css({"height":cfgHeight,"width":'100%',"top":'-'+'100%'}); 
						break; 
				}
			}
		}	 
		initFn();
		setTimeout(function(){
			animateFn()
		},10)
		function animateFn(){
			if(cfg.direction){
				switch (cfg.direction){
					case "left":	
						slideMain.css("left",0); 
						break;
					case "right":
						slideMain.css("right",0); 
						break;
					case "top":
						slideMain.css("bottom",0); 
						break;
					case "bottom":
						slideMain.css("top",0); 
						break;
				}
			}
		}
		$(".j_sliderMask").bind("click",function(){
			initFn();
			$(this).hide();	
			setTimeout(function(){
						
				$("body").append(that);
				that.hide();	
				$("body,html").css({'height':'auto',"overflow":''})
				sBox.remove();

			},1000)
			
		});
	};


})(Zepto)