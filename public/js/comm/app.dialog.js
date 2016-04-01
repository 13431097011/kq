/**
 * Copyright (c) huagu.com
 * Developer - 安凌志
 * Last modify - 2012.01.30
 * Info - 对话框插件
 */
define(function(){
	var M = {
		lan: {
			ok: '确定',
			cancel: '取消',
			close: '关闭',
			systit: '系统信息',
			confirm: '信息确认'
		},
		i: 0,
		lock: false,//锁定后无法使用按键操作对话框
		D: {},//所有对话框
		exec: function(opt,par){
			M.cssInit();
			var set = {};//默认设置
			if(opt){
				$.extend(set, opt);//默认扩展
				if(par) $.extend(set, par);//自定义扩展
			}
			var d = new Dialog(set);//新建对象
			M.D[d.id] = d;//将对象记录到M.D[]中，以便其它地方可能产生的回调，如：在对话框外关闭活动窗口操作
			M.positions();//
		},
		alert: function(c,opt){
			M.exec({
				type: 'alert',
				content: c
			},opt);
		},
		confirm: function(c,f,cf,opt){
			M.exec({
				type: 'confirm',
				title: opt && opt.title ? opt.title : '',
				content: c,
				callback: f,
				cancel: true,
				button: [
					{text: M.lan.ok, callback:'ok'},
					{text: M.lan.cancel, name:'dialog_y', callback:cf}
				]
			},opt);
		},
               
		ok: function(c,opt){//正确信息提示
			M.exec({
				type: 'ok',
				content: c
			},opt);			
		},
		err: function(c,opt){//错误信息提示
			M.exec({
				type: 'err',
				content: c
			},opt);
		},
		text: function(c,w,h,opt){//普通文本提示
			M.exec({
				type: 'text',
				content: c,
				width: w,
				height: h,
				button: '',
				style: 'padding:0 20px 40px;background: #f0f2f7;height:auto;'
			},opt);
		},
		tips:function(c, opt){//（成功）提示信息
			opt = opt || {};
			opt.time = opt.time || 2; //1秒自动消失
			M.exec({
				type: 'tips',
				content: c,
				mask: 0,
				button: '',
				width:674,
				style:'margin:0 auto; height:80px;',
				css: '#{id} .closeRight{display:none} #{id} .dialogBody{  box-shadow:none;background:none;height:218px;width:700px;  text-align: center; background:url('+M.$skin+'dialog_tips_bg.png) no-repeat !important}.dialogText_tips{font-size: 16px;color: #fff;}.dialogContent{margin-top: 40px;}'
			}, opt);
		},
		tipsErr:function(c, opt){//（失败）提示信息
			opt = opt || {};
			opt.time = opt.time || 2; //1秒自动消失
			M.exec({
				type: 'tips',
				content: c,
				mask: 0,
				button: '',
				width: opt.width || 674,
				style:'margin:0 auto; height:80px;',
				css: '#{id} .closeRight{display:none} #{id} .dialogBody{  box-shadow:none;background:none;height:218px;width:700px;  text-align: center; background:url('+M.$skin+'dialog_tips_bg.png) no-repeat !important}.dialogText_tips{font-size: 16px;color: #fff;}#{id} .dialogContent{margin-top: 40px;}p.dialog_img_tips{ background-position:0 -324px;}'
			}, opt);
		},
		show: function(c,opt){//纯文本显示
			M.exec({
				type: 'text',
				content: c,
				width: 0,
				button: '',
				style: 'margin:0;overflow:hidden;',
				head:true,
				css: '#{id} .dialogBody{border:0;box-shadow:0 0 0;border-radius:0;background: #f0f2f7;}'
			},opt);
		},
		load: function(u,w,h,opt){//jQuery.ajax与M.text组合
			$.ajax({
				url: u,
				success: function(s){
					M.text(s,w,h,opt);
				}
			});
		},
		open: function(u,opt){//jQuery.ajax与M.show组合
			$.ajax({
				url: u,
				success: function(s){
					M.exec({
						type: 'text',
						content: s,
						width: 0,
						button: '',
						style: 'margin:0;overflow:hidden;',
						head:true,
						css: '#{id} .dialogBody{background: #f0f2f7;}'
					},opt);
				}
			});
		},
		iframe: function(u,w,h,opt){//iframe方式调用一个对话框式的页面
			M.exec({
				type: 'url',
				url: u,
				width: w,
				height: h,
				button: '',
				style: ''
			},opt);
			
		},
		loading: function(c,opt){
			opt = opt || {};
			var loadLen= $('.dialog_img_loading').size();
			if (loadLen>=1) return;//防止多个loading加载
			M.exec({
				mask: opt.mask || false,
				content: false,
				type: 'loading',
				button: '',
				width: 0,
				head: false,
				style: 'margin:0',
				css: '#{id} .dialogBody{box-shadow:0 0 0;border-radius:0;background:none!important;}'
			},opt);
			
		},
		doing: function(c,opt){
			M.loading(c,{alpha:0});
			
		},
		loadend: function(){
			$.each(M.D, function(i,o){
				if(o.set.type == 'loading') o.close();
			});
		},
		time:0,//系统内部变量，记录时间状态
		keydown: function(){//对外兼容的keydown事件判断，若有对话框存在，则返回false，表示不要执行其它的keydown事件
			if(M.microtime() - M.time < 5) return false;//禁止5毫秒内重复触发，比如说一个对话关闭的同时，可能会触发另一个事件新开一个重复的对话框
			return !$('.dialogAll').length;//若没有对话框存在，返回true
		},
		yes: function(){//对外使用的确定函数，可以用在对话框的回调函数和文本的任何部分：M.yes();
			var lc = M.local();
			if(lc) lc.ok();
		},
		close: function(id){//对外使用的关闭函数，用法同上
			if(id && M.D[id]){
				M.D[id].close();
			}else{
				var lc = M.local();
				if(lc) lc.close();
			}
		},
		local: function(){//系统内部函数，获取当前活动对话框
			var r = 0;
			$.each(M.D, function(i,o){
				if(o.set.type != 'loading') r = o;
			});
			return r;
		},
		microtime: function(){
			return new Date().getTime();
		},
		$skin: __cdn__+'img/skin/',
		cssInit: function(){
			if(M._cssInit) return;
			M._cssInit = 1;
			var skin = M.$skin;
			

			$(document.body).append('<style>.dialogBg{width:100%}.dialogBody{overflow:hidden;}.dialogBody,.dialogBody input{font-size:12px}.dialogBody,.dialogBg{position:fixed;left:0;top:0;z-index:9999;}.dialogBody{left:50%;top:50%; border-radius: 5px;box-shadow: 0 1px 30px rgba(0,0,0,0.1);}.dialogTitle{background:url('+ skin +'dialogTitle.jpg) repeat-x;}.dialogTitle b{font-size:16px;text-align:left;display:block;height:49px;line-height:49px;color:#fff;padding-left:20px;}.dialogTitle a{filter:alpha(opacity=70);opacity:1;background:url('+ skin +'ico_dialog_cls.png?1.001) no-repeat;width:15px;height:15px;cursor:pointer;display:inline;position:absolute;right:20px;top:17px;}.dialogTitle a:hover{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);-moz-transform:rotate(90deg);-o-transform:rotate(90deg);-webkit-transform:rotate(90deg);transform:rotate(90deg)}.dialogTitle a:active{filter:alpha(opacity=80);opacity: 0.8;}.dialogContent{  overflow-y: auto; max-height: 700px;}.dialogContents iframe{width:100%;border:0;overflow:hidden;overflow-y:auto}.dialogButtons{text-align:center;margin: 40px 0 114px;}table.dialogContents{width:auto;border:0}table.dialogContents td{text-align:left;border:0}.dialogButtons input{cursor:pointer;margin:0 10px;width:80px;height:41px;color:#fff;display:inline-block;background-color:#80c414;line-height:41px;text-align:center;font-size:14px;font-weight:bold;}.dialogButtons input:hover{}.dialogButtons input.dialog_y{color:#282d37; background:#f0f2f7}.dialog_img{width:36px;padding:0}.dialog_img p{width:32px;height:32px;margin:0 auto;background:url('+ skin +'ico_dialog.png?1.003) no-repeat}p.dialog_img_confirm{background-position:0 3px}p.dialog_img_alert{background-position:0 -272px}p.dialog_img_tips{background-position:0 -380px}p.dialog_img_ok{background-position:0 -106px}p.dialog_img_err{background-position:0 -52px}.dialogText{margin:0}.dialogText_ok{color:green}.dialogText_err{}.dialogText_loading{color:#666;font-size:14px;display:none;}td.dialog_img_loading{width:40px}td.dialog_img_loading p{width:100px;height:100px}.dialog_img p.dialog_img_loading{background:url('+ skin +'loading.gif) no-repeat;color:#666;font-size:14px;opacity: 0.3;filter:alpha(opacity=30);}.dialogAll b{font-weight:bold;margin:0}.dialogText{font-size:18px;font-weight:bold;}#dialogbtn1{ margin-left:20px}</style>');
		},
		positions: function(){
			var _id = 'M_'+ (parseInt(M.i)-1),
				_obj = $("#"+ _id),			
				_body = $(".dialogBody",_obj);
			var bh=_body.height(),bw=_body.width();
			_body.css({//回调定位对话框
				marginTop:-bh/2,
				marginLeft:-bw/2
			});
		}
	};

	var Dialog = function(opt){
		var I = this,doc = $(document.body),ww = $(window).width(),wh = $(window).height();
		I.set = {
			type: 'alert',					//对话框类型：alert,confirm,url(iframe调用),mes(消息提示y/n),text(简单文本显示)
			url: '',						//iframe地址，适用type：url(iframe调用)
			title: '',			//标题
			content: '',					//内容，适用type：alert,confirm,mes,text
			closetit: M.lan.close,			//关闭按纽的title属性
			cancel: false,					//取消的同时执行关闭对话框操作，confirm默认为true
			width: 600,						//整个对话框宽度 - 为0表示自适应宽度
			height: 0,						//高度 - 为0表示自适应高度
			time: 0,						//执行倒计时，完成后会执行this.ok()
			timeObj: null,					//倒计时显示对象
			style: 'margin: 124px auto 0;',			//内容区域dialogContents样式
			success: '',					//窗口加载完毕的回调函数
			callback: '',					//确定操作的回调函数
			close: '',						//关闭回调函数
			mask: true,						//是否显示半透明蒙板层
			fade: 0,						//显示速度
			head: true,						//是否显示标题区
			img: '',						//指定提示图片
			top: 0,							//指定顶距
			top2: 0,						//顶距偏移
			left: 0,						//指定左距
			bgcolor: '#000',				//蒙板层背景色
			notBg: 0,						//框体无背景色
			alpha:	0.3,					//蒙板层透明度0 - 1
			skin: M.$skin,					//皮肤
			button: [						//自定义按纽及对应触发函数
				{text: M.lan.ok, callback:'ok'}
			],
			bTitleDrag:false, //弹框标题是否可拖动
			css: ''//本对话框特有样式 使用#{id}来控制CSS范围
		};

		if(opt) $.extend(I.set,opt);//加载用户设置

		I.init = function(){//显示对话框核心函数
			I.id = 'M_'+ M.i++;	//唯一化对话框ID
			I.top = $(document).scrollTop();//记录滚动条偏移
			//半透明蒙板效果层
			var bg = '';
			if(I.set.mask) bg = '<div class="dialogBg closeRight"></div>';
			var tt = I.set.head ? '<div class="dialogTitle closeRight"><a title="'+ I.set.closetit +'"></a><b>'+ I.set.title +'</b></div>' : '';//标题栏
			var css = I.set.css ? '<style>'+I.set.css.replace(new RegExp('{id}','g'),I.id)+'</style>' : '';
			var closeload = I.set.type == 'loading' ? '<a onclick="M.close(\''+ I.id +'\')" style="display:block;background-position:-56px -148px;width:9px;height:9px;position:absolute;right:3px;top:3px;"></a>' : '';
			var s = '<div class="dialogAll" id="'+ I.id +'" style="display:none">'+css+bg+'<div class="dialogBody"'+ (I.set.notBg?'':' style="background:#fff"') +'>'+ closeload + tt +'<div class="dialogContent">'+ I.getCon() +'</div>'+ I.getBtn() +'</div></div>';//对话框结构内容
			doc.append(s);							//加载对话框
			I.obj = $("#"+ I.id);					//整个对话框对象，包括半透明蒙板层
			I.bg = $(".dialogBg",I.obj);			//半透明蒙板层
			I.body = $(".dialogBody",I.obj);		//框体
			I.title = $(".dialogTitle", I.obj);		//标题区域
			I.titles = $("b", I.title);				//标题文本有效区域(不包括关闭按纽)
			I.content = $(".dialogContent", I.obj);	//内容区域
			I.buttons = $(".dialogButtons", I.obj);	//按纽区域
			if(I.set.mask){//设置半透明蒙板层样式
				I.bg.css({
					height: $(document).height(),
					backgroundColor: I.set.bgcolor,
					filter: "alpha(opacity="+I.set.alpha*100+")",//IE
					opacity: I.set.alpha//firefox
				});
			}
			if(I.set.width) I.body.width(I.set.width);	//设置对话框宽度
			I.obj.show(I.set.fade);
			if(I.set.height > 0){//若设置高度大于0，则设置高度，否则为自适应高度
				var ht = I.title[0] ? I.title.outerHeight() : 0,//标题栏目高度
					h = I.set.height - ht;//内容不含标题栏目的高度
					h = I.set.button ? h - I.buttons.outerHeight() : h;//若存在按纽，则需要减去按纽高度
				if(I.set.type == "url"){//若为iframe，则直接对iframe赋高度值
					$(".dialogContent iframe", I.obj).height(h);
				}else{//对内容（不包括按纽）赋高度值
					I.content.height(h);
				}
				$(".dialogText", I.obj).css("vertical-align","top");
			}
			var bw = I.body.outerWidth(),bh = I.body.outerHeight();
			var mH=parseInt(wh*0.8);
			I.content.css("maxHeight",mH);
			I.body.css({//定位对话框
				width: bw,
				height: I.body.height(),
				marginTop:-bh/2,
				marginLeft:-bw/2
			});
		};

		I.getCon = function(){//内容区
			var s, tag = 'div';
			switch(I.set.type){
				case "url":s = '<iframe frameborder="0" src="'+ I.set.url +'"></iframe>';break;
				case "text":s = I.set.content;break;
				default:
					tag = 'table';
					s = '<tr><td class="dialog_img dialog_img_'+ I.set.type +'">'+ (I.set.img||'<p class="dialog_img_'+ I.set.type +'"></p>') +'</td><td class="dialogText dialogText_'+ I.set.type+'">'+ I.set.content +'</td></tr>';
			}
			return '<'+tag+' class="dialogContents" style="'+ I.set.style +'">'+ s +'</'+tag+'>';
		};

		I.getBtn = function(){//按纽区
			if(!I.set.button) return '';
			var b = '';
			var btnC=['btnn green h40','btnn gray h40'];
			$(I.set.button).each(function(i,o){
				b += '<a  value="'+ o.text +'"class="'+btnC[i]+'" id="dialogbtn'+i+'"'+(o.name ? ' class="'+o.name+'"' : '')+'>'+ o.text +'</a>';
				//b += '<input type="button" value="'+ o.text +'"class="'+btnC[i]+'" id="dialogbtn'+i+'"'+(o.name ? ' class="'+o.name+'"' : '')+' />';
			});
			return '<div class="dialogButtons closeRight">'+ b + '</div>';
		};

		I.btnEvt = function(){//监听按纽事件
			$("a", I.buttons).click(function(){
				var i = this.id.replace("dialogbtn","");
				if(I.set.button[i] && I.set.button[i].callback){//为自定义按纽且有回调函数
					if(I.set.cancel) I.close();//若cencal设置为true，则同时执行关闭对话框操作
					if(typeof I.set.button[i].callback == 'function'){
						I.set.button[i].callback();//执行自定义回调函数
					}else{
						try{eval('I.'+I.set.button[i].callback+'()')}catch(e){}
					}
				}else{//默认为关闭对话框
					I.close();
				}
			});

			//屏蔽右键，提高用户体验
			$(".closeRight",I.obj).each(function(i,o){
				o.oncontextmenu = function(){return false};
				o.ondragstart = function(){return false};
				o.onselectstart = function(){return false};
				o.onbeforecopy = function(){return false};
			});
		};

		I.titEvt = function(){//标题栏目相关事件
			if(!I.title[0]) return;
			I.bg.click(function(){//点击蒙板
				I.title.fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50).fadeOut(50).fadeIn(50);//闪动标题栏，以提示用户页面为锁定状态
			});
			$(".dialogTitle a", I.obj).click(I.close);//监听关闭按纽
			if(I.set.bTitleDrag){
				I.titles.mousedown(function(e){	//拖动层
					var o = I.body.offset();			//对框话位置对象
					var a = e.clientX - o.left + 1;	//与鼠标位置的横向偏移
					var b = e.clientY - o.top + 1;	//与鼠标位置的纵向偏移
					var l = 0, t = 0;
					doc.bind("mousemove",function(e){
						l = e.clientX - a;				//当前left值为鼠标x位置与横向偏移差
						t = e.clientY - b;				//当前top值为鼠标y位置与纵向偏移差
						l = l < 0 ? 0 : l;				//防止左边超出页面边界
						t = t < 0 ? 0 : t;				//防止顶部超出页面边界
						I.body.css({left:l,top:t});
					}).mouseup(function(){
						doc.unbind("mousemove").unbind("mouseup");//删除事件
					});
				});
			}
		};

		I.timeEvt = function(){//倒计时
			if(I.set.time <= 0) return;
			var o,s;
			if(I.titles[0]){
				s = I.titles.text();
				if(s && s.indexOf('{time}') < 0) s += ' - [{time}]';
			}
			if(I.set.timeObj) o = $(I.set.timeObj,I.obj);
			function loop() {
				if(s) I.titles.html(s.replace("{time}", I.set.time));
				if(I.set.timeObj && o) o.html(I.set.time);
				if (I.set.time <= 0) {
					clearInterval(I.loopObj);
					I.ok();
				}
				I.set.time--;
			}
			loop();
			I.loopObj = setInterval(loop,1000);
		};

		I.ok = function(){//确定
			I.close();
			if(typeof(I.set.callback) == "function") I.set.callback();//执行确定回调函数
		};

		I.close = function(){//关闭
			if(I.set.time > 0) clearInterval(I.loopObj);//结束未执行完的倒计时
			I.obj.fadeOut(I.set.fade,function(){
				if(typeof(I.set.closebefore) == "function") I.set.closebefore();//执行关闭前回调函数
				I.obj.remove();
				delete M.D[I.id];
				if(typeof(I.set.close) == "function") I.set.close();//执行关闭回调函数
			});
		};
		

		I.init();
		I.timeEvt();
		I.titEvt();
		I.btnEvt();
		if(typeof(I.set.success) == "function") I.set.success();//执行窗口完成回调函数
		if(I.set.type != 'loading') M.loadend();
	};

	return M;
});