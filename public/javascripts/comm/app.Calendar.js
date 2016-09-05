/**
 * Copyright (c) boyaa.com
 * Developer - 安凌志
 * Last modify - 2015.03.25
 * Info - 日期选取控件 依赖$D
 */
define(function(require){
	window.$D = require('./app.Date');
	var D = {
		'init': function(my, s, par){
			var p = {};
			p.obj = $(my);
			p.value = my.value;
			if(s) p.format = s;
			if(par){
				if(typeof par == 'function') par = {'callback': par};
				$.extend(p, par);
			}
			if(!D.obj) D.obj = new Calendar(p);
		},
		'css': function(){
			return '.myCalendar{background:#41516b;border:1px solid #384760;border-collapse:collapse;position:absolute;z-index:99999;width:218px;color:#ced2e0}.myCalendar *{word-break:keep-all}.myCalendar a,.myCalendar b{cursor:pointer;padding:2px 5px;font-weight:normal}.myCalendar b.back,.myCalendar b.next{background:url('+ D.lang.cked +') no-repeat;text-indent:-999px;overflow:hidden;width:24px;height:24px;display:block}.myCalendar b.back{background-position:10px 7px}.myCalendar b.next{background-position:18px -30px}.myCalendar table{width:100%}.myCalendar select{margin:0 1px; padding:0 5px 0 0}.myCalendar a{cursor:pointer;border:1px solid #ccc;margin:0 5px}.myCalendar td,.myCalendar th{border-bottom:1px solid #384760;padding:5px;text-align:center;height:auto}.myCalendar th{background:#384760}.myCalendar .m0{color:#5a6c8a !important}.myCalendar .m1{cursor:pointer}.myCalendar .on{background:#4b97db;color:#fff !important}.myCalendar .today{color:#80c514;font-size:16px;padding:0}.myCalendar .wk0,.myCalendar .wk6{color:#ced2e0}.myCalendar .hover{background:#4b97db;color:#fff}.myCalendar input.err{border:1px solid red}.myCalendar tr.top_s th{border-bottom:1px solid #475771}';
		},
		'lang': {
			'cked': 'http://cdn.oa.com/img/skin/ico_arrow_w.png',
			'now': 'NOW',
			/*'close': '关闭',*/
			'ok': '确定',
			/*'today': '今日',*/
			'clear': '清空',
			'c0': '清零时间',
			'week': ['日','一','二','三','四','五','六']
		},
		pos: function(o){
			if(!o || !o[0]) return {left:0,top:0};
			if(D.offset){//有滚动条的情况，后台推荐使用
				return o.offset();
			}else{//使用offset有时候定位不准，具体原因不明，前台推荐使用
				return D.getPosition(o[0]);
			}
		},
		getPosition: function(e, e2){
			var x = 0, y = 0;
			while (e != null) {
				x += e.offsetLeft;
				y += e.offsetTop;
				e = e.offsetParent;
				if(e2 && e2 == e) break;
			}
			return {left: x, top:y};
		}
	};

	var Calendar = function(par){
		var L = D.lang, I = this, opt = {
			'obj': '',//值回写对象
			'format': 'Y-m-d H:i:s',//格式
			'value': '',//原值
			'min': 1960,//年范围
			'max': 2040,
			'callback': null//回调函数
		};

		I.$ = function(s, o){
			o = o ? o : document.body;
			return $(s, o);
		};

		I.init = function(){
			if(par) $.extend(opt,par);
			I.date = new Date();
			I.mn = {'Y': [opt.min, opt.max], 'y': [0, 99], 'm': [0, 11], 'H': [0, 23], 'i': [0, 59], 's': [0, 59]};//取值范围
			I.id = 'd'+ I.date.getTime();
			I.def();//默认值处理
			I.build();
		};

		I.def = function(){//默认值处理
			var s = opt.format, o = {'Y': 'yyyy', 'y': 'yy', 'm': 'mm', 'd': 'dd', 'H': 'HH', 'i': 'ii', 's': 'ss'}, arr = ['Y','y','m','d','H','i','s'], i;
			s = s.replace(new RegExp('Y|y|m|d|H|i|s','g'),function(k){return o[k]});
			$.each(arr, function(i,k){
				I[k] = opt.value.substring(s.indexOf(o[k][0]), s.lastIndexOf(o[k][0])+1);
				I[k]--;
				I[k]++;
				I['_'+ k] = I[k];
			});
			if(!I.Y && I.y) I.Y = I.date.getFullYear().toString().substring(0,2) + I.y;
			if(I.m >= 0){
				I.m--;
				I._m--;
			}
		};

		//设置各项值如： I.set('Y', 'FullYear');
		I.set = function(k, f){
			I[k] = parseInt(I[k]);
			if(isNaN(I[k]) || I[k] < I.mn[k][0] || I[k] > I.mn[k][1]) I[k] = I.date['get'+ f]();
			I.date['set'+ f](I[k]);
		};

		//建立日历对象
		I.build = function(){
			var t = I.date, s, r, ts;
			I.set('Y', 'FullYear');
			I.set('m', 'Month');
			I.set('H', 'Hours');
			I.set('i', 'Minutes');
			I.set('s', 'Seconds');
			t.setDate(1);//此月一号
			s = '<style>'+ D.css() +'</style><table><tr class="top_s"><th><b class="back" fn="back">&lt;</b></th><th colspan="5">'+ I.select('Y',t) +'-'+ I.select('m',t) +'</th><th><b fn="next" class="next">&gt;</b></th></tr><tr>';
			ts = opt.format.indexOf('H') > 0 ? '<tr><td colspan="7"><b fn="c0" title="'+ L.c0 +'">x</b>'+ I.select('H',t) +':'+ I.select('i',t) +':'+ I.select('s',t) +'<b fn="now">'+ L.now +'</b></td></tr>' : '';
			var d = I.date.getDay();//一号的星期
			I.num = new Date(I.Y, I.m+1, 0).getDate() + d;//下一月的前一天即此月份天数+第一周前几天
			if(d > 0) t.setDate(1-d);//本月第一个星期天
			$.each(L.week, function(i,o){
				s += '<th>'+ o +'</th>';
			});
			s += '</tr>';
			I.No = 0;
			r = I.builds();
			while(r){
				if(I.No > 140) break;
				if(r.w == 0) s += '<tr>';
				c = r.m == I.m ? 'm1' : 'm0';
				c += ' wk'+ r.w;
				s += '<td class="'+ c +'" d="'+ r.Y +'_'+ r.m +'_'+ r.d +'">'+ r.d +'</td>';
				if(r.w == 6) s += '</tr>';
				t.setDate(r.d + 1);//下一天
				I.No++;
				r = I.builds(r.w == 6);
			}
			s += ts;
			s += '<tr><td colspan="7"><b fn="clear">'+ L.clear +'</b><b class="ok" fn="ok">'+ L.ok +'</b></td></tr>';
			s += '</table>';
			I.obj = I.$('#'+ I.id);
			if(!I.obj[0]){//新打开
				$(document.body).append('<div class="myCalendar" id="'+ I.id +'">'+ s +'</div>');
				I.obj = I.$('#'+ I.id);
				var of = D.pos(opt.obj), wh = $(window).height(), ch = I.obj.outerHeight(), oh = opt.obj.outerHeight();
				if(of.top + ch - wh + oh > 0){
					oh = of.top - ch;
				}else{
					oh += of.top;
				}
				I.obj.css({
					'left': of.left,
					'top': oh
				});
				I.obj.mouseenter(function(){
					I.on = 1;//标记鼠标在日历上
				}).mouseleave(function(){
					I.on = 0;
				});
			}else{//年/月时间切换
				I.obj.html(s);
			}

			$('.m1', I.obj).click(function(){//选中事件
				I.ok($(this).attr('d'));//完成
			}).mouseenter(function(){
				$(this).addClass('hover');
			}).mouseout(function(){
				$(this).removeClass('hover');
			});

			$('a,b', I.obj).click(function(){//点击事件
				if(typeof I[$(this).attr('fn')]) I[$(this).attr('fn')](this);
			});

			$('select', I.obj).change(function(){//select切换时间
				I[this.name] = this.value;
				I.build();
			});

			$('[d="'+ I._Y +'_'+ I._m +'_'+ I._d+'"]', I.obj).addClass('on');
			t = new Date();//选中今日
			$('[d="'+ t.getFullYear() +'_'+ t.getMonth() +'_'+ t.getDate()+'"]', I.obj).addClass('today');
			setTimeout(function(){//全局关闭事件
				$(document.body).bind('click', I.closes);
			}, 100);
		};
		I.builds = function(br){
			var t = I.date;
			if(br && I.No >= I.num) return;//在换行(周六)且月份为下一月时中止
			var ret = {'Y':t.getFullYear(), 'm':t.getMonth(), 'd':t.getDate(), 'w':t.getDay()};
			return ret;
		};

		//加载时间选取的select，如：I.select('Y',t)
		I.select = function(s, t){
			var i, r = '<select name="'+ s +'">', def = $D.date(s,t), v;
			for(i=I.mn[s][0]; i<=I.mn[s][1]; i++){
				v = s == 'm' ? i+1 : i;
				if(v < 10) v = '0'+ v;
				r += '<option value="'+ i +'"'+ (v == def ? ' selected="true"' : '') +'>'+ v +'</option>';
			}
			return r +'</select>';
		};

		I.back = function(){//上一月
			I.m--;
			if(I.m < 0){
				I.Y--;
				I.m = 11;
			}
			I.build();
		};

		I.next = function(){//下一月
			I.m++;
			if(I.m > 11){
				I.Y++;
				I.m = 0;
			}
			I.build();
		};

		I.clear = function(){//清除
			opt.obj.val('');
			I.close();
		};

		I.today = function(){//今日
			I.date = new Date();
			I.Y = '';
			I.m = '';
			I.build();
		};

		I.now = function(){//现在
			I.date = new Date();
			I.Y = '';
			I.m = null;
			I.H = '';
			I.i = '';
			I.s = '';
			I.build();//console.log(I.build());
		};

		I.c0 = function(){//零点
			I.date = new Date();
			I.Y = '';
			I.m = null;
			I.H = 0;
			I.i = 0;
			I.s = 0;
			I.build();
		};

		I.ok = function(d){//确定
			d = d && typeof d == 'string' ? d : $('.on',I.obj).attr('d');
			if(!d){
				d = new $D.obj();
				d = d.Y+'_'+(d.m-1)+'_'+d.d;
			}
			d = d.split('_');
			var ret = $D.date(opt.format, new Date(d[0],d[1],d[2],I.H,I.i,I.s));
			opt.obj.val(ret);
			I.close();
			if(typeof opt.callback == 'function') opt.callback(ret);
		};

		I.closes = function(){//全局关闭
			if(I.on) return;
			$(document.body).unbind('click', I.closes);
			I.close();
		};

		I.close = function(){//点击关闭
			I.obj.remove();
			D.obj = null;
		};

		I.init();
	};

	return D;
});