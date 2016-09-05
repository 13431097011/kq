/**
 * Copyright (c) zmr8.com
 * Developer - 安凌志
 * Last modify - 2013.10.12
 * Info - 分页相关
 */

define(function(){
	var Page = function(par, id){
		var I = this;
		I.id = id;
		I.$page = 1;//当前页
		I.$size = 15;//分页
		I.$group = 5;//分组页数,默认10
		I.$all = 0;//数据总量
		I.$url = 'P.go({page},'+ id +')';//地址模板{page}
		I.$callback = '';//分页回调函数

		I.set = function(k, v){//赋值
			if(typeof k == 'object'){
				$.each(k, function(i, o){
					I['$'+ i] = o;
				});
			}else{
				I['$'+ k] = v;
			}
		};

		if(par) I.set(par);

		I.ref = I.go = function(p){
			p = parseInt(p ? p : I.$page);
			if(isNaN(p)) p = 1;
			if(p < 0) return;//需要刷新因此去掉当前页限制
			if(typeof I.$callback == 'function') I.$callback(p);
		};

		I.getObj = function(s){//获取分页对象 //1常规分组 0分页居中
			s = s || 0;
			var gOn, begin, end, on = I.$page, url = I.$url, gsize = I.$group;//分组
			var p = {all:I.$all, size:I.$size, count:Math.ceil(I.$all/I.$size), on:on, first: '', back: '', next: '', last: '', change:'', body:[]};
			I.$count = p.count;//分页数
			if(s){//常规分组
				begin = Math.max(on-gsize/2, 1);
				end = Math.min(on+gsize/2, p.count);
			}else{//分页居中
				gOn = Math.ceil(on/gsize);
				begin = (gOn-1)*gsize+1;
				end = gOn*gsize;
			}
			//if(gOn && gOn > 1) p.body.push({'url':url.replace('{page}',on-gsize),'page':'...','css':' class="backgroup"'});//上一组
			for(i=begin; i<=end; i++){
				if(i > p.count) break;
				p.body.push({'url':url.replace('{page}',i),'page':i,'css':i == on ? ' class="on"' : ''});
			}
			if(gOn && gOn < Math.ceil(p.count/gsize)){//下一组
				n = on+gsize;
				n = n > p.count ? p.count : n;
				//p.body.push({'url':url.replace('{page}',n),'page':'...','css':' class="nextgroup"'});
			}
			if(on > 1){//上一页 首页
				p.first = url.replace('{page}',1);
				p.back = url.replace('{page}',on-1);
			}
			if(on < p.count){//下一页 尾页
				p.next = url.replace('{page}',on+1);
				p.last = url.replace('{page}',p.count);
			}
			if(typeof I.change == 'function') p.change += I.change();
			return p;
		};
	};

	var P = {
		i:0, o:{}, set:{},
		init: function(par, id){
			if(!id) id = P.i++;
			var o = new Page(par, id);
			P.o[id] = o;
			return o;
		},
		go: function(p,i){//跳转
			i = i || 0;
			P.o[i].go(p);
		},
		ref: function(p,i){//强制刷新
			i = i || 0;
			P.o[i].ref(p);
		},
		getObj: function(t,i){//获取分页对象 //1常规分组 0分页居中
			i = i || 0;
			if(i == 0) P.o[0].set(P.set);//兼容P.set.page直接赋值的写法
			return P.o[i].getObj(t);
		}
	};

	P.init();//初始化P.o[0]，兼容老写法
	return P;
});