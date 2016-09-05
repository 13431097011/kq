/**
	css3的进度条动画<div id="demo"></div>
	var ld = new Loading($('#demo'));
	ld.run(50);
	ld.del();//移除
*/

var Loading = function(_obj, opt){
	var C = {
		'tag': '_circle_loading',
		'size': 50,
		'per': 0.8,
		'bg': '#eee',//背景色
		'color': '#999',//进度条色
		'text': {//中间部分样式
			bg: '#fff',
			color: '#999',
			size: '14px'
		}
	};
	if(opt) $.extend(C, opt);

	var I = {
		$: function(s){
			return $(s, _obj);
		},
		init: function(){
			var s = '';
			if(!window[C.tag]){//确保同tag的样式只加载一次
				s = '<style>'+ I.css() +'</style>';
				window[C.tag] = 1;
			}
			s += '<div class="'+ C.tag +'">';
			s += '<div class="_left"><div></div></div>';
			s += '<div class="_right"><div></div></div>';
			s += '<div class="_mask"><span>0</span>%</div>';
			s += '</div>';
			_obj.append(s);
			_obj = $('.'+ C.tag, _obj);

			var size = {
				'width': C.size,
				'height': C.size
			};
			_obj.css(size);
			I.$('div').css(size);

			I.$('div._right,div._right>div').css({
				'clip': 'rect(0,auto,auto,'+ C.size/2+'px)'
			});
			I.$('div._left,div._left>div').css({
				'clip': 'rect(0,'+C.size/2+'px,auto,0)'
			});
			I.$('._mask').css({
				'width': C.size*C.per,
				'height': C.size*C.per,
				'lineHeight': C.size*C.per+'px',
				'marginTop': -(C.size*C.per)/2,
				'marginLeft': -(C.size*C.per)/2
			});
			I.$('div._left>div,div._right>div').css('background', C.bg);
			I.$('div._left,div._right').css('background', C.color);
			_obj.css('background', C.bg);
		},
		css: function(){
			var s = [], fix = 'div.'+ C.tag, radius = 'border-radius:50%;', t = C.text;
			s.push(fix +'{position:relative;border-radius:50%}');
			s.push(fix +'>div._left,'+ fix +'>div._right{position:absolute;top:0;left:0;'+ radius +'}');
			s.push(fix +'>div._left>div,'+ fix +'>div._right>div{border-radius:50%;position:absolute;top:0;left:0}');
			s.push(fix +'>div._mask{'+ radius +'background:'+ t.bg +';font-size:'+ t.size +';color:'+ t.color +';text-align:center;font-weight:bold;position:absolute;left:50%;top:50%}');
			return s.join("\n");
		},
		run: function(n){
			I.$('div._mask').html(n+'%');
			var num = n * 3.6;
			if (num<=180) {
				I.$('div._right>div').css('transform', 'rotate(' + num + 'deg)');
			} else {
				I.$('div._right>div').css('transform', 'rotate(180deg)');
				I.$('div._left>div').css('transform', 'rotate(' + (num - 180) + 'deg)');
			};
		},
		del: function(){
			_obj.remove();
		}
	};
	I.init();
	return I;
};