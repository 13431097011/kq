define(function(require){
	var I ={
		init:function(){
			$("#search_cname").autocomplete({
				source: function(request, response) {
					  
					  var result = [];
					   $.get("/search",{key:request.term},function(d){
						  
						   for(var i in d){
							   var row = {};
							   row.label = d[i].label;
							   row.value = d[i].value;
							   row.id = d[i].id;
							   result.push(row);
						   }
						   response(result);
					   },'json');
				   },
				response:function(event, ui ){
				   var text = $("#search_cname").val();
				   if(!isNaN(text)){
					   $('#search_code').val(text);
				   }
				},
				search: function( event, ui ) {

				},
				select:function(event,ui){
				   $("input[name='search[_id]']").val(ui.item.id);
				   $("input.btn_search").click();
				}
		   });
		   $("button.btn_search").click(function(){
			   $("#searchfrom").submit();
		   });
		}
	};
	return I;
	
});
