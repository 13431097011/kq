/**
 * Copyright (c) zmr8.com
 * Developer - 安凌志
 * Last modify - 2012.01.30
 * Info - 表单处理类
 */
define(function(){
	var Form = function(id,obj){
		var I = this;
		if(typeof id == 'object'){
			obj = id;
		}else{
			obj = obj ? obj : document.body;
			obj = $(id,obj);
		}
		I.mesType = C.formMsg;//check时消息提示类型：默认、alert、Msg
		I.mes = null;//错误提示文字配置
		I.value = '';//值
		I.tip = $(document.body);//消息提示层
		I.editor = {};//标记编辑器
		I.L = typeof L == 'object' ? L.form : {};

		//取值 N为true表示不对值转码
		I.getValue = function(){
			var t = '';
			I.load = {};//已取值对像
			I.data = {};//值对像
			I.input.each(function(i,o){
				t = o.name;
				if(!t) t = $(o).attr('name');//div编辑器
				if(!t || I.load[t]) return true;//若name不存在或已经取过值则continue
				if(t.indexOf('[]') > 0){//同一组用户名
					t = t.replace('[]','');
					if(!I.data[t]) I.data[t] = [];
					I.data[t].push($.trim($(o).val()));
				}else{
					I.data[t] = I.getVal($(o));
					I.load[t] = true;
				}
			});
			var arr = [];
			$.each(I.data, function(n,v){
				if(typeof v == 'object'){
					$.each(v, function(i,v2){
						arr.push(n +'[]='+ encodeURIComponent(v2));
					});
				}else{
					if(v) v = encodeURIComponent(v);
					arr.push(n +'='+ v);
				}
			});
			I.value = arr.join('&');
			return I.value;
		};

		//取单个值
		I.getVal = function(E){
			var v = '', n = E.attr('name');
			if(E.hasClass('EDITOR')){//编辑器
				I.editor[n] = 1;
				v = getEditor(n);
			}else{//取编辑器的内容
				switch(E.attr('type')){
					case 'radio':
						E = $('input[name="'+n+'"]:checked',obj);
						v = E[0] ? E.val() : '';
						break;
					case 'checkbox':
						E = $('input[name="'+n+'"]:checked',obj);
						$.each(E,function(i,o){v += o.value+','});
						v = v ? v.replace(/,$/,'') : '';
						break;
					case 'div':
						v = E.html();
						break;
					case 'button':break;
					default:
						v = E.val();
				}
			}
			return $.trim(v);
		};

		I.set = function(set){
			$.each(set, function(i,o){
				obj.find('[name="'+ o[0] +'"]').attr(o[1], o[2]);
			});
		};

		//输入检测
		I.check = function(lock){
			if(lock){
				Msg.err('数据暂未加载完成，提交锁定中！');
				return false;
			}
			I.suc = true;//复位检测状态
			I.e1 = null;//置位第一个文本类错误对象
			I.$e = null;//第一个错误对象
			$('.ckf').remove();
			var E = I.input, v = '', f = '', must;
			E.each(function(i,o){
				if(I.mesType != '' && !I.suc) return true;//mesType为空时，有错也继续判断；其它情况有错则停止
				o = $(o);
				I.now = o;//记录当前控件
				f = o.attr('fn');
				must = o.attr('must');
				if(!f && !must) return true;//无须检测的字段
				v = I.getVal(o);
				if(must){
					if(!v){
						I.err(must);
						return true;
					}else{
						I.show('Ok');
					}
				}
				if(!f) return true;
				try{
					if(typeof I[f] == 'function'){
						f = I[f];
					}else{
						eval('f='+ f);//自定义检测函数
						if(typeof f != 'function') return false;
					}
					var fc = f(v, o);
					if(fc !== true){
						I.err(fc);
						return true;
					}
				}catch(e){};
			});
			I.getValue();
			return I.suc;
		};

		//输出错误 及 错误处理
		I.err = function(n,addx){
			I.suc = false;
			var str = I.L;
			str = str[n] ? str[n] : n;
			var E = I.now, type = E[0].type;
			if(!I.$e) I.$e = E;//第一个错误
			if(!I.e1 && (type == 'text' || type == 'textarea')) I.e1 = E;//第一个文本框类错误
			if(typeof I.error == 'function'){
				I.error(str, I.e1);
			}else{
				switch(I.mesType){
					case 'Msg':
						Msg.err(str);
						break;
					case 'M':
						M.err(str);
						break;
					case 'alert':
						alert(str);
						break;
					default:
						I.show('Err',str,'',addx);
				}
			}
			if(I.e1) I.e1.focus();
		};

		I.show = function(css,str,obj,addx){
			if(I.mesType != '') return;
			str = str ? str : '';
			if(obj) I.clear();
			var E = obj ? obj : I.now;
			var type = E[0].type;
			var pos = E.offset();
			var l = pos.left;
			var w = E.outerWidth();
			var hh = E.outerHeight();
			var h = hh < 22 ? 22 : hh;
			h -= 2;
			h = h > 22 ? 22 : h;
			var t = pos.top;
			addx = addx ? addx : 0;
			if(type == 'radio' || type == 'checkbox'){
				var n = E.length - 1;
				var x = $(E[n]).offset().left;
				n = n ? (x-l)/n*(n+1) : 0;
				l += n;
			}else{
				l = l + w + 10;
			}
			l += addx;
			I.tip.append('<div class="ckf checkForm'+css+'" style="min-height:'+h+'px;height:auto!important;height:'+h+'px;left:'+(l-5)+'px;top:'+(t-1)+'px;font:normal 12px/'+h+'px Aria">'+str+'</div>');
		};

		I.end = function(ret,fn){//通过PHP处理后返回值处理
			try{eval('ret='+ret)}catch(e){return};
			if(ret.err){
				var s = I.L[ret.err] || ret.err;
				s = l(s, [ret.limit, ret.length]);
				if(ret.name){
					I.clear();
					var o = $('name='+ret.name+']',obj);
					if(o[0]){
						I.show('Err',s,o,ret.addx);
						o.focus();
						return;
					}
				}else{
					alert(s);
				}
				return;
			}else if(ret.ok && typeof fn == 'function'){
				fn();
			}
		};

		I.clear = function(c){
			$('.ckf').remove();
			if(!c) return;
			$('[name=checkcode]').val('');
			refcheckcode();
		};

		I.checkFun = function(re,v,key){
			if(v == '' || re.test(v)){
				if(v) I.show('Ok');
				return true;//通过测试
			}
			I.err(key);
			return false;
		};

		I.email = function(v, o){//邮箱格式检测
			if(o && !o.attr('must') && !v) return true;//非必填值输入为空时无须检测格式
			return I.checkFun(/^[\w\-\.]+@[\w\-]+\.[\w\-]+$/,v,'email');
		};

		I.mobile = function(v, o){//手机格式检测
			if(o && !o.attr('must') && !v) return true;//非必填值输入为空时无须检测格式
			return I.checkFun(/^0?(13|15|18)\d{9}$/,v,'mobile');
		};

		I.checkcode = function(v){//验证码检测
			if(!v || !/^[a-zA-Z0-9]{4}$/.test(v)){
				I.err('checkcode',150);
				return false;
			}else{
				return true;
			}
		};

		//内部使用成员属性
		I.suc = true;//检测状态
		I.now = null;//当前控件
		I.e1 = null;//第一个错误
		I.input = $(':input,[contenteditable=true]',obj);
	};
	return Form;
});