/*
	JS时间控制库

	$D.timezone = 'ETC/GMT-8';
	$D.date('Y-m-d H:i:s', 1274826591); //2010-05-26 06:29:51
	$D.date('Y-m-d H:i:s', new Date()); //当前时间
	$D.date('Y-m-d H:i:s'); //当前时间
	$D.diff(-1, 'Y-m-d');//前一天
	$D.diff(-1, 'Y-m-d', '2013-07-30');//指定时间前一天
*/
define(function(){
	var $D = {
		timezone: '',//时区 ETC/GMT-8
		_diff: 0,//与服务器时差
		date: function(str, d, local){
			var tz;
			if(typeof d == 'undefined' || !d){//默认使用当前时间
				d = new Date();
				tz = 1;
			}else if(typeof d != 'object'){//当时间戳处理
				d = new Date(parseInt(d)*1000);
				tz = 1;
			}
			if(tz && $D.timezone && !local){//时区处理
				tz = d.getTimezoneOffset() - $D.timezone.replace('ETC/GMT','')*60;
				d.setMinutes(d.getMinutes() + tz);
			}
			d = new $D.obj(d);
			function f(k){
				var i = d[k];
				return new RegExp('m|d|H|i|s').test(k) && i < 10 ? '0'+ i : i;
			}
			return (str||'Y-m-d H:i:s').replace(new RegExp('Y|y|m|d|H|i|s|w','g'), f);
		},
		time: function(m, d){//m表示返回毫秒
			d = d ? d : new Date();
			var t = d.getTime()/1000;
			if(!m) t = parseInt(t);
			return t + $D._diff;
		},
		diff: function(n, s, def){//$D.diff(-1, 'Y-m-d', '2015-03-03')上一天
			var t = def ? new Date(def.replace(/-/g,'/')) : new Date();
			if(typeof t != 'object') return t;
			t.setDate(t.getDate() + n);
			return $D.date(s, t);
		},
		strtotime: function(str, set, retdate, timezone){//字符时间转时间格式或时间戳$D.strtotime('2013-01-04 12:12:12', 'Y-m-d H:i:s')
			set = set || 'Y-m-d H:i:s';
			set = set.replace('Y', 'YYYY').replace('y', 'YY').replace('m', 'mm').replace('d', 'dd').replace('H', 'HH').replace('i', 'ii').replace('s', 'ss');
			if(!str || str.length != set.length) return '';
			var i, l = set.length, o = {'Y':'','m':'','d':'','H':'','i':'','s':''}, k;
			for(i=0; i<l; i++){
				k = set.charAt(i);
				if(typeof o[k] != 'undefined') o[k] += str.charAt(i);
			}
			var y = new Date().getFullYear().toString();
			if(!o.Y){
				o.Y = y;
			}else if(o.Y.length == 2){
				o.Y = y.substr(0,2) + o.Y;
			}
			if(o.m) o.m -= 1;
			var d = new Date(o.Y, o.m, o.d, o.H, o.i, o.s);
			if($D.timezone && timezone){//时区处理
				var tz = d.getTimezoneOffset() - $D.timezone.replace('ETC/GMT','')*60;
				d.setMinutes(d.getMinutes() - tz);
			}
			if(retdate) return d;//返回时间
			return $D.time(0,d);//返回时间戳
		},
		obj: function(d){//date
			d || (d = new Date());
			this.Y = d.getFullYear();
			this.y = d.getFullYear().toString().substr(2,2);
			this.m = d.getMonth()+1;
			this.d = d.getDate();
			this.H = d.getHours();
			this.i = d.getMinutes();
			this.s = d.getSeconds();
			this.w = d.getDay();
		},
		back: function(str, now, Y, m, d, H, i, s){//获取到指定时间段的倒计时，参数：输出格式,当前时间,年,月,日,时,分,秒
			if(now && typeof now == 'object') return $D.format(str, now);//格式化输出对象
			var t = now < 1356969600 ? now : Date.parse(new Date(Y,m-1,d,H||0,i||0,s||0))/1000 - now;//2013-01-01前表示倒数秒数，否则认为是指定目标时间
			var r = {};
			if(t <= 0) return t;
			r.d = parseInt(t/86400);//天
			t %= 86400;
			r.H = parseInt(t/3600);//时
			t %= 3600;
			r.i = parseInt(t/60);//分
			r.s = t % 60;//秒
			if(!str) return r;//直接返回对象，灵活应用
			return $D.format(str, r);
		},
		format: function(s, r){//按格式输出时间字符串
			if(!s) return '';
			return s.replace(/d|H|i|s/g, function(k){
				if(k != 'd' && r[k] < 10) r[k] = '0'+ r[k];
				return r[k];
			});
		}
	};
	return $D;
});