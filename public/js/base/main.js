$(document).ready(function(){
	var _on=0;
	$(".btn").click(function(){
		if(_on==0){
			if (confirm("你确定要参加篮球比赛？"))  {
				var _this=$(this);
				$.ajax({     
				url:'ajax.php',     
				type:'post',        
				async : false, //默认为true 异步     
				error:function(){     
				   alert('error');     
				},     
				success:function(data){     
					switch(data){
						case "0":
							alert("报名失败！");
							break;
						case "1":
							alert("报名成功！");
							_this.addClass('btnclick').removeClass('btn');
							_on=1;
							break;
						case "2":
							alert("你已报过名！");
							break;
						default:
							break;   
					}   
				}  
			
		});}else{}  
		}
	});
});