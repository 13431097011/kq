var M;
define(function(require){
	M = require('M');
	var I ={
		init:function(){
			I.ent();
		},
		ent:function(){
			$("a.face").click(function(){
				$(this).next().toggle();
			});
		}
		
	};
	I.init();
	
});