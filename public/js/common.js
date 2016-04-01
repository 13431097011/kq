var M;
define(function(require){
    M = require('M');
    D = require('D');
    var I = {
        init: function () {
            //左侧TAB加上突显
            var sCurrUrl = location.href.replace(/\/$/, '');//当前url
            var arr = sCurrUrl.split('?');
            var preUrl = document.referrer;//前一个url
			
			var localUrl = '';
            if(arr.length > 1){
                localUrl = arr[0].substring(0, arr[0].length);
            }else{
                localUrl = arr[0];
            }
			
            var addStatus = true;
            $('a.app').each(function (i) {//所有左边菜单url
                var apreUrl = $(this).attr('href');
                if(apreUrl != undefined && apreUrl == localUrl){
                    $(this).addClass('on');
                    addStatus = false;
                }
            });

            if(addStatus){//不在左边菜单url,默认前一个url
                $('div.leftment a[href="'+ preUrl +'"]').addClass('on');
            }

			//ajax请求统一加上csrf头
			$.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name=_token]').attr('content')
				}
			});

			$(document).on('click', '.radio', function(){
                $(this).addClass('ed').siblings('label').removeClass('ed').find('input[type=radio]').prop('checked',false);
                $(this).find('input[type=radio]').prop('checked',true);
                return false;
            });
            
            I._mains();
            I._keyEvt();
			//I._notice();
			//I._showNoticeZpNum();//招聘系统红点提示
            //I._showNoticeNum();
        },

        _mains: function () {
            //标签拖动插件
            I._move();
            $('#edit_nav').sortable();

            //菜单选择
            var _menuH = $(".sel_box .wrap").height(),
                    _navState = 0;
            $(".nav .set_menu").hover(function () {
                if (_navState == 1)
                    return;
                $(this).find(".sel").addClass("on");
                $(".nav .sel_box").fadeIn(150);
                var _mask = '<div class="mask"></div>';
                $(".wrapper").append(_mask);
                $(".mask").height($(document).height());
                $(".mask").stop(true, false).animate({
                    opacity: 0.3,
                    filter: "alpha(opacity=30)"
                }, 400);
            }, function () {
                if (_navState == 1)
                    return;
                $(this).find(".sel").removeClass("on");
                $(".nav .sel_box").fadeOut(150);
                $(".mask").stop(true, false).animate({
                    opacity: 0,
                    filter: "alpha(opacity=0)"
                }, 400);
                setTimeout(function () {
                    $(".mask").remove();
                }, 400);
            });

            //导航菜单
            var tempArr = {"hr": 1, "fi": 1, "ls": 1, "mb": 1, "tr": 1, "pe": 0, "ks": 0, "it": 0, "as": 0, "ad": 0};
            //编辑菜单	

            $(".sel_box .btn_edit").click(function () {
                if ($(this).hasClass("on")) {
                    _navState = 0;
                    $("#edit_nav,.sel_box .tips").hide();
                    $("#view_nav").show();
                    $(this).removeClass("on");
                    $(".sel_box").removeClass('sel_edit');
                    var tempArr = {}, temArr2 = [];
                    $("#edit_nav a").each(function (index, val) {
                        var _id = $(this).attr("id"),
                                _ed = $(this).attr("value");
                        if (_ed == 1) {
                            tempArr[_id] = _ed;
                        } else {
                            temArr2[_id] = _ed;
                        }
                    });
                    $.extend(tempArr, temArr2);
                    $(".nav>li").each(function (index, el) {
                        if (!$(this).hasClass("set_menu")) {
                            $(this).remove();
                        }
                    });
                    var _html = "";
                    $.each(tempArr, function (i, v) {
                        (v == 1) && (_html += "<li><a key='" + i + "' href='" + menu[i][1] + "'>" + menu[i][0] + "</a></li>");
                    });
                    $(".set_menu").before(_html);

                    $.getJSON(I.api, {cmd: 'menu', menu: tempArr}, function (ret) {
                        if (ret && ret.ok && ret.flag) {
                            //显示菜单
                            I._moreNav(tempArr);
                            I._showNoticeNum();
                        } else {
                            M.err('网络故障，请重试');
                        }
                    });
                } else {
                    _navState = 1;
                    $("#edit_nav,.sel_box .tips").show();
                    $("#view_nav").hide();
                    $(this).addClass("on");
                    $(".sel_box").addClass('sel_edit');
                }
            });
            $(".user_info").click(function () {
                $(".user_info ul").toggle();
            });
            var _navNum = $("#edit_nav li.on").length;
            if (_navNum >= 5) {
                $("#edit_nav li").each(function (i) {
                    if (!$(this).hasClass("on")) {
                        $(this).addClass("not");
                    }
                    ;
                });
            }
            ;
            $(document).on('click', '#edit_nav li', function () {
                var _parA = $(this).find("a");
                if ($(this).hasClass('not'))
                    return false;
                if ($(this).hasClass("on")) {
                    _navNum--;
                } else {
                    _navNum++;
                }
				
                if (_navNum >= 5) {
                    if ($(this).hasClass('on')) {
                        _parA.attr("value", 0);
                        _navNum--;
                        $("#edit_nav li").removeClass("not");
                        $(this).toggleClass("on");
                        _parA.toggleClass("on");
                    } else {
                        _parA.attr("value", 1);
                        $(this).toggleClass("on");
                        _parA.toggleClass("on");
                        $("#edit_nav li").each(function (index, el) {
                            if (!$(this).hasClass("on")) {
                                $(this).addClass("not");
                            }
                        });
                    }
                } else {
                    if ($(this).hasClass('on')) {
                        _parA.attr("value", 0);
                    } else {
                        _parA.attr("value", 1);
                    }
                    $("#edit_nav li").removeClass("not");
                    $(this).toggleClass("on");
                    _parA.toggleClass("on");
                }
                return false;
            });

            //类型选择
            $(document).on("click", ".ipt-groups .st,.ipt_searchform .st", function () {
                if($(this).parent().hasClass('ipt_searchform')){
                    $(".ipt_searchform").find("ol,ul").hide();
                    $(this).parents(".ipt_searchform").find("ol,ul").width($(this).parents(".ipt_searchform").width());
                    $(this).parents(".ipt_searchform").find("ol").toggle();
                    if($(this).parents(".ipt_searchform").find("ol").is(".hide")){
                        //对报批页面的改变评级下拉特殊处理
                        $(this).parents(".ipt_searchform").find("ol").toggleClass("hide");

                    };
                }else{
                    var _I = $(this).closest(".ipt-groups");
                    _I.toggleClass("on");
                    _I.find("ol,ul").width(_I.width());
                    if(_I.hasClass('on')){
                        _I.find("ol").css('display','block');
                    }else{
                        _I.find("ol").css('display','none');
                    }
                    
                    if ($(this).closest(".ipt-groups").find("ol").is(".hide")) {
                        //对报批页面的改变评级下拉特殊处理
                        $(this).parents(".ipt-groups").find("ol").toggleClass("hide")
                    }
                }                
            });
            $(document).on("click", ".ipt-groups li>a[value]", function () {
                 var _I = $(this).closest(".ipt-groups");
                _I.removeClass("on");
                $(this).parents("ol").hide().find("ul").css('display','none');
                $(this).parents(".ipt-groups").find(".st").text($(this).text()).attr("title", $(this).text()).end().find('.st_val').val($(this).attr('value')).change();
               // $(this).parents(".set_time ").find(".btn_search").trigger("click");
            });
            $(document).on("click", function (evt) {
                if ($(evt.target).parents(".ipt-groups,.user_info,.ipt_searchform,.filter").length == 0) {
                    $('.list,.select_list,.user_info ul').hide();
                    $(".ipt-groups").removeClass("on").find("ul").css('display','none');
                }
            });

            //
            
            $(document).on("click", ".select .st", function () {
                var _I = $(this).closest(".select");
                $(this).toggleClass("on");
                _I.find("ul").toggle();
                if (_I.is(".filter")) {
                    var wli = _I.find("ul li").outerWidth();
                    var row = Math.floor(_I.find("ul li").size() / 5);
                    var _w = wli * row;
                    _I.find("ul").width(_w);
                };
            });

            $('.ipt-groups li>a').each(function() {
                var _I=$(this);
                if(_I.hasClass('on')){
                    _I.parent().parents(".ipt-groups").find(".st").text($(this).text()).attr("title", $(this).text()).end().find('.st_val').val($(this).attr('value')).change();
                }                
            });

            //复选框
            I._checkbox(".check input,.check");
            I._checkbox(".check_alls input,.check_alls");

            //全选
        $("#check_alls").click(function(){
            if($(this).prop('checked')!=false){
                $("#udata:checkbox").attr("checked", true);
                $("#udata .check").each(function(){
                    var s = $(this).find('input[type=checkbox]');
                    s.attr('checked',true);
                    $(this).addClass('ed');
                });
            }else{    
                $(".clock_list #udata:checkbox").attr("checked", false); 
                $("#udata .check").each(function(){
                    var s = $(this).find('input[type=checkbox]');
                    s.attr('checked',false);
                    $(this).removeClass('ed');
                });
            }
        });
		 //输入框
            I._input(".texta");
            I._input(".txt_ipt");

            //所有表格，hover特效
            $('.tbl tbody tr').hover(function () {
                $(this).addClass('ovr');
            }, function () {
                $(this).removeClass('ovr');
            });
			
            $.fn.extend({
                mytitle: function () {
                    var _me = $(this);
                    _me.mouseover(function (e) {
                        var _I = $(this);
                        var ico_title = "<div class='ico_title'></div>";
                        $("body").append(ico_title);
                        $(".ico_title").css({
                            "top": e.pageY + "px",
                            "left": e.pageX + "px"
                        });
                        _me.mouseout(function () {
                            $(".ico_title").remove();
                        });
                        _me.mousemove(function (e) {
                            $(".ico_title").css({
                                "top": (e.pageY - 56) + "px",
                                "left": (e.pageX - 20) + "px"
                            });
                        });
                        $(".btnn").mousemove(function (e) {
                            $(".ico_title").remove();
                        });
                    }).mouseout(function (event) {
                        $(".ico_title").remove();
                    }).click(function (event) {
                        $(".ico_title").remove();
                    });
                    $(document).click(function () {
                        $(".ico_title").remove();
                    });
                }
            });

            $.fn.extend({
                goBtn: function (opts) {
                    var set = {
                        Callback: function () {
                        }
                    };
                    $.extend(set, opts);
                    var tem = '<a href="javascript:;" class="go_back"></a>';
                    $('.go_box').append(tem);
                    var me = $('.go_back');
                    xy();
                    $(window).resize(function () {
                        xy();
                    });
                    function xy() {
                        if ($('.right').size() >= 1) {
                            _x = Number($('.right').offset().left) + 920;
                        }
                        ;
                        $(document).find('.go_back').css({
                            left: _x,
                        });
                    };
                    $(me).off().click(function (event) {
                        set.Callback();
                        OA.APP_PE.app('goback');
                    });
                }/*,
                 goBtn:function(fn,sign){
                 $.fn.goBack({Callback:function(){fn.call(null,sign);}});
                 }*/
            });

        },
        _showNoticeNum: function () {//为其他系统添加系统提示
            $.getJSON('/import/getCount', function(ret){
				if(ret && ret.count){
					$('#auditCount').append('<span class="num"><em>'+ret.count+'</em><b class="a1"></b><b class="a2"></b></span>');
				}
			});
        },
        _moreNav: function (tempArr) {
            $("#view_nav li").remove();
            var _viewHtml = '';
            $.each(tempArr, function (i, v) {
                (v == 0) && (_viewHtml += '<li><a key="' + i + '" target="_blank" class="ico_nav ' + i + '" href="' + menu[i][1] + '" title="' + menu[i][0] + '"></a></li>');
            });
            $("#view_nav").append(_viewHtml);
            $("#view_nav li").last().addClass("last");
        },
        _checkbox: function (_obj, _parent) {
            $(document).on("click", _obj, function (e) {
                if ($(this).is(":checked")) {
                    //选中显示
                    $(this).parents(_parent).addClass('ed');
                } else {
                    $(this).parents(_parent).removeClass('ed');
                }
            });
        },
        _input: function (iptObj) {
            //文本框焦点
            $(document).on('focus', iptObj, function () {
                $(this).css("color", "#282d37");
                $(this).removeClass('ic');
                if ($(this).val() == this.defaultValue) {
                    $(this).val("");
                }
            });
            $(document).on('blur', iptObj, function () {
                if ($(this).val() == "") {
                    $(this).val(this.defaultValue);
                    $(this).css("color", "#ced2e0");
                    $(this).addClass('ic');
                }
            });
        },
        _addClass: function (objso) {
            $(document).on('click', objso, function () {
                $(this).addClass("on").siblings().removeClass("on");
            });
        },
        _notice: function () {
            var o = $('.notice>div'), tq = '<iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=12" width="100%" height="50" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
            if (o.html()) {
                //o.append('<p style="height:50px;overflow:hidden">'+ tq +'</p>'); //应设计师需要，去掉天气插件
                o.switchPic({li: '>p'});
            } else {
                //o.html(tq);
            }
        },
        _keyEvt: function () {
            $(document).keydown(function (e) {
                switch (e.keyCode) {
                    case 27://Esc
                        M.close();
                        break;
                 }
            });
        },
        _move: function () {
            //标签拖动插件
            (function ($) {
                var dragging, placeholders = $();
                $.fn.sortable = function (options) {
                    options = options || {};
                    return this.each(function () {
                        if (/^enable|disable|destroy$/.test(options)) {
                            var items = $(this).children($(this).data('items')).attr('draggable', options == 'enable');
                            options == 'destroy' && items.add(this)
                                    .removeData('connectWith').removeData('items')
                                    .unbind('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
                            return;
                        }
                        var index, items = $(this).children(options.items), connectWith = options.connectWith || false;
                        var placeholder = $('<' + items[0].tagName + ' class="sortable-placeholder">');
                        var handle = options.handle, isHandle;
                        var bgPosition;
                        items.find(handle).mousedown(function () {
                            isHandle = true;
                        }).mouseup(function () {
                            isHandle = false;
                        });
                        $(this).data('items', options.items)
                        placeholders = placeholders.add(placeholder);
                        if (connectWith) {
                            $(connectWith).add(this).data('connectWith', connectWith);
                        }
                        items.attr('draggable', 'true').bind('dragstart.h5s', function (e) {
                            if (handle && !isHandle) {
                                return false;
                            }
                            isHandle = false;
                            var dt = e.originalEvent.dataTransfer;
                            dt.effectAllowed = 'move';
                            dt.setData('Text', 'dummy');
                            dragging = $(this).addClass('sortable-dragging');
                            index = dragging.index();
                        }).bind('dragend.h5s', function () {
                            dragging.removeClass('sortable-dragging').fadeIn();
                            placeholders.detach();
                            if (index != dragging.index()) {
                                items.parent().trigger('sortupdate');
                            }
                            dragging = null;
                        }).not('a[href], img').bind('selectstart.h5s', function () {
                            this.dragDrop && this.dragDrop();
                            return false;
                        }).end().add([this, placeholder]).bind('dragover.h5s dragenter.h5s drop.h5s', function (e) {
                            if (!items.is(dragging) && connectWith !== $(dragging).parent().data('connectWith')) {
                                return true;
                            }
                            if (e.type == 'drop') {
                                e.stopPropagation();
                                placeholders.filter(':visible').after(dragging);
                                return false;
                            }
                            e.preventDefault();
                            e.originalEvent.dataTransfer.dropEffect = 'move';
                            if (items.is(this)) {
                                dragging.hide();
                                $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
                                placeholders.not(placeholder).detach();
                            }
                            return false;
                        });
                    });
                };
            })(jQuery);
        },
		
    };
	
	I.init();    
});
