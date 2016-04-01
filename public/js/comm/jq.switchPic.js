//图片切换 安凌志 2012.03.13
define(function(require){
	$.fn.switchPic = function(p){
		var set = {
			'w':0,
			'h':0,
			'li':'li',		//切换元素
			'num':'div.bannerNum',//数字序号显示区域
			'numtpl':'<a>{i}</a>',
			'arrow': 'a.arrow', //切换箭头
			'left': 'arrow-lf',//左箭头样式
			'end': 'arrow-end',//左右切换结束样式
			'arrowhide': 1,	//默认隐藏，鼠标放上才显示
			'on':'on',		//当前序号样式
			'type':0,		//动画效果 0默认上下滚动、1无动画效果、lr左右滚动、fade渐显
			'time':5000,	//动画间隔
			'callback':''	//回调，返回一个方法，参数是i，可以跳到指定贞
		};
		if(p) $.extend(set, p);
		var i, s = '', o, t, I = $(this), li = $(set.li, I), w = set.w||li.width(), h = set.h||li.height(), ul = li.parent(), len = li.length, num = typeof set.num == 'object' ? set.num : $(set.num, I.parent()), arrow = $(set.arrow, I.parent()), alen = arrow.length;

		if(num[0]){//数字按纽显示
			for(i=1; i<=len; i++){
				s += set.numtpl.replace('{i}', i);
			}
			num.html(s);
		}else{
			num = false;
		}
		if(len < 2) return;//一张图片不继续

		if(num){
			num = $('a', num);//数字按纽
			num.eq(0).attr('class', set.on);
		}
		h = h || 100;
		I.height(h).css('overflow','hidden');
		ul.height(h).css('overflow','hidden');
		li.height(h).css({'overflow':'hidden','display':'block'});
		if(set.type == 'lr'){
			li.wrapAll('<div style="width:'+ len*w +'px"></div>');
			li.css('float', 'left');
		}

		i = 1;//初始后的下一张图片下标
		var fn = function(exec){//动画执行函数
			if(!exec) i = i >= len ? 0 : i;
			if(num) num.eq(i).addClass(set.on).siblings().removeClass(set.on);
			switch(set.type){//动画效果
				case 1:ul.scrollTop(i*h);break;
				case 'fade':li.siblings().hide().eq(i).fadeIn();break;
				case 'lr':ul.animate({'scrollLeft':i*w});break;
				default:ul.animate({'scrollTop':i*h});
			}
			if(!exec) i++;
		};
		ul.scrollTop(0).scrollLeft(0);
		o = setInterval(fn, set.time);//开始动画
		if(num) num.click(function(){//数字点击事件
			i = $(this).index();
			fn();
		});

		if(num && vars.bannerNumHide) num.hide();
		I.mouseenter(function(){//鼠标放上停止动画，移开后还原
			clearInterval(o);
			if(alen > 0 && set.arrowhide){
				t && clearTimeout(t);
				arrow.fadeIn();
			}
			if(num && vars.bannerNumHide) num.show();
		}).mouseleave(function(){
			o = setInterval(fn, set.time);
			if(alen > 0 && set.arrowhide){
				t && clearTimeout(t);
				t = setTimeout(function() {
					arrow.fadeOut(200);
				}, 300);
			}
			if(num && vars.bannerNumHide) num.hide();
		});

		if(alen > 0){//左右切换事件
			function status(){
				arrow.removeClass(set.end);
				if(i <= 0) arrow.eq(0).addClass(set.end);
				if(i >= len-1) arrow.eq(1).addClass(set.end);
			}
			arrow.show().click(function(){
				clearInterval(o);//停止自动
				if($(this).hasClass(set.left)){//左
					i--;
					if(i < 1) i = 0;
				}else{
					i++;
					if(i > len-1) i = len-1;
				}
				fn(true);
				status();
				o = setInterval(fn, set.time);//继续自动
			});
			i = 0;
			status();
		}

		if(typeof set.callback == 'function'){//默认切换
			set.callback(function(n){
				i = n;
				if(i < 1) i = 0;
				if(i > len - 1) i = len - 1;
				fn(true);
				status();
			});
		}
	};
});