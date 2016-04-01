/**
 * Copyright (c) zmr8.com
 * Developer - 安凌志
 * Version - V2.0
 * Last modify - 2011.04.21
 * Info - 系统消息
 */

//操作提示
define(function(){
	var Msg = {
		out: $('#checkFormMes'),
		ok:function(str, opt){//正确提示
			this.show(str ? str : L.ok, opt, 'Suc');
		},
		err:function(str, opt){//错误提示
			str = str ? str.toString() : 'L.errpar';
			(str.indexOf('L.') == 0) && (str = eval(str));
			this.show(str ? str : L.err, opt, 'Fal');
		},
		show:function(str, opt, cls){//Msg.show('<pre>abc</pre>', {'keep':1,'lock':1,'height':500}, 'Suc');
			if(this.t) clearTimeout(this.t)
			cls = cls || 'Def';
			var ac = 1;
			if(opt && opt.keep){
				ac = 0;
				str = '<a onclick="Msg.clear()" style="float:right;font-size:18px">×</a>' + str;
			}
			if(opt && opt.lock) VAR.msgLock = 1;
			Msg.out.html('<div class="checkForm'+cls+'" style="display:none">'+ str +'</div>');
			var css = {'left':opt && opt.left ? opt.left : this.l()};
			if(opt && opt.height) css.height = opt.height;
			$('.checkForm'+cls, Msg.out).css(css).show();
			ac && this.clear(opt && opt.time ? opt.time : 3000);
		},
		l:function(){//内部函数
			var w = $('div', Msg.out).width();
			return ($(window).width() - w) / 2;
		},
		clear:function(t){//内部函数，提示框自动消失
			this.t = setTimeout(function(){
				$('div', Msg.out).fadeOut(500,function(){
					Msg.out.html('');
					VAR.msgLock = false;//锁定时，将不会消失，用来让用户点击提示语中的链接
				});
			}, t);
		},
		loading:function(){
			Msg.doing(L.loading);
		},
		doing:function(s,opt){//操作过程loading
			s = s ? s : L.doing;
			M.doing(s);
		},
		close:function(){//关闭自定义弹窗
			M.loadend();
		},
		formErr:function(F,name,mes){//表单错误提示
			F.now = $('[name='+ name +']', RIGHT);
			F.err(mes);
			F.now.focus();
			Msg.close();
		}
	};
	return Msg;
});