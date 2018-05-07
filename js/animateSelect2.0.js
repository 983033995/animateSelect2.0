/***
 * 作者：zhangheteng
 * 邮箱：983033995@qq.com
 * 时间：2018-03-23
 * 名称：自定义下拉框插件
 * 功能介绍：可以在任意位置使用，可已自己选择或者定制样式，下拉框的展开和收起动画以及各自的动画时间，支持键盘的上下选择和回车选中功能，
 支持择键盘上下选择时是否可循环选择，支持表单name传值，下拉框选中的值储存在每一版块下的input中，可自定义下拉列表中选中内
 容的的提示样式
 * 注意点：最外层的div的class名称可以随意改动或者添加，但是下面的div元素和dl的class名称不能删除只能新增类名，样式中的宽高颜色可自改，
 但,我的动画采用的是animate.css中整理的大部分动画效果，可选择性使用或者自行补充定义
 * 调用方法：$("最外层div的class或者id").animateSelect({里面为参数配置（具体配置选择项代码备注）});
 * **/

(function($){
	$.fn.animateSelect = function(options){
		var defaults={
			displayAnim : 'fadeInDown',	//默认选项的显示动画
			hideAnim: 'fadeOutUp',			//默认选项的隐藏动画
			displayTime: '500',			//下拉框出现的动画时间
			hideTime: '500',			//下拉框收起的动画时间
			shadowClass: "select_shadow",		//选中元素的特殊样式，自定义样式的class名（这里必须用class）
			scrollLoop: true,			//是否能让键盘上下选择时循环选择（true：可循环）
			inputSearch: false			//是否使用带搜索的选择框
		}
		var opt = $.extend(defaults,options);
		return this.each(function(k,v){
			$(this).attr('data-id','select_box'+k);
			var marquee = $(v).children('dl');		//下拉内容区
			var marquee_dd = marquee.children('dd');
			var model_box = $(v).children('div.select_model');
			var select_val = model_box.children('input');
			var dd_h = marquee.children('dd').height();		//下拉框中每个选项的高度
			var num_value = marquee.children('dd').size();	//下拉框中选项的个数			
			var arrow_html = '<div class="select_arrow"></div>';
			$(v).height($(v).children().outerHeight());		//给下拉盒子赋予高度
			model_box.append(arrow_html);
			if(opt.inputSearch == false){
				select_val.attr('readonly','readonly');
			}
			if(select_val.attr('select-val') == '' || select_val.attr('select-val') == undefined){
				var marquee_dd_one = marquee_dd.eq(0);
				select_val.val(marquee_dd_one.html());
				select_val.attr('select-val',marquee_dd_one.attr('select-value'));
			}else{
				var initial_html = marquee.children('dd[select-value="'+select_val.attr('select-val')+'"]').html();
				select_val.val(initial_html);
//				marquee_dd.each(function(ko,vo){
//					var vo_html = $(vo).html();
//					if(vo_html == select_val.val()){
//						var start_val = $(vo).attr('select-value');
//						select_val.attr('select-val',start_val);
//					}
//				})
			}
			$(v).on('click',function(e){			//给该自定义下拉框的外盒子绑定点击事件
				var is_block = marquee.css('display');		//判断下拉区是否显示
				var select_top = $(v).offset().top;
				var select_val = $(v).children('div.select_model').children('.select_val').html();
				var ip = $(this).children('div.select_model').children('input').attr('select-val');
				var w_top = $(document).scrollTop();
				var w_height = $(window).height();
				var see_top = select_top-w_top;
				var see_bottom = w_height-see_top-$(v).height();
				if(is_block == 'none'){
					if(opt.inputSearch == true){
						$(v).children('div.select_model').children('.select_val').focus();		
						marquee_dd.show();
						$(v).children('div.select_model').children('.select_val').on('keyup',function(){
							var search_v = $(this).val();
							marquee_dd.hide();
							marquee_dd.each(function(z,j){
								var str = $(j).html();
								if(str.indexOf(search_v) != -1){
									$(j).show().addClass('select_search_true');
								}else{
									$(j).hide().removeClass('select_search_true');
								}
							});
							var select_show_inex = $("dd.select_search_true").size();
							if(select_show_inex == 0){
								$("#select_search_none").remove();
								marquee.append('<div id="select_search_none" style="width: 100%;height: 30px;line-height: 30px;text-indent: 2em;font-size: 12px;" select-value="暂无匹配项">暂无匹配项</div>');
							}else{
								$("#select_search_none").remove();
							}
							if(search_v == ''){
								var cur_num = $(v).children('dl').children('dd.'+opt.shadowClass).index();
								var marque_h = marquee.height();			//下拉框的高度
								if(cur_num*dd_h >= marque_h){				//判断所选内容是否超出
									marquee.scrollTop(cur_num*dd_h-(marque_h/2));
								}else{
									marquee.scrollTop(0);
								}
							}
						})
					}
					$(v).css('z-index','99999999');
					marquee.show().removeClass(opt.hideAnim).addClass(opt.displayAnim);			//下拉框的出现动画
					$('.'+opt.displayAnim).css('animation-duration',opt.displayTime+'ms');		//下拉框动画执行时间
					if(see_top > see_bottom){													//判断下拉框的出现位置
						marquee.css({"bottom":($(v).height())+"px","top":"","max-height":(see_top-70)+"px"});
					}else{
						marquee.css({"top":($(v).height())+"px","bottom":"","max-height":(see_bottom-70)+"px"});
					}
					$(v).children('div.select_model').children('.select_arrow').css({'transform':'rotate(134deg)'});		//箭头
					marquee.children('dd').on('click',function(){		//选择其中一个时执行
						evaluate(this);
					})
					marquee.children('dd').removeClass(opt.shadowClass);
					marquee.children('dd[select-value='+ip+']').addClass(opt.shadowClass);		//选中的内容添加背景标识
					var cur_num = $(this).children('dl').children('dd.'+opt.shadowClass).index();
					var marque_h = marquee.height();			//下拉框的高度
					if(cur_num*dd_h >= marque_h){				//判断所选内容是否超出
						marquee.scrollTop(cur_num*dd_h-(marque_h/2));
					}else{
						marquee.scrollTop(0);
					}
					var this_top = $(this).offset().top;
					var this_bottom = this_top + $(this).children('dl').outerHeight()+$(this).outerHeight();
					var this_left = $(this).offset().left;
					var this_right = this_left + $(this).outerWidth();
					$(document).on('click',function(e){
						var mouse_x = e.pageX;
						var mouse_y = e.pageY;
						if(mouse_x < this_left || mouse_x > this_right || mouse_y < this_top || mouse_y > this_bottom){
							cut();
						}
					});
				}else{
					cut();
				}
			});
			function cut(){			//关闭下拉框的方法
				marquee.removeClass(opt.displayAnim).addClass(opt.hideAnim);
				$(v).children('div.select_model').children('.select_arrow').css({'transform':'rotate(-46deg)'});
				$(v).css('z-index','999');
				setTimeout(function(){
					marquee.hide();
				},opt.hideTime-100);
				if(opt.inputSearch == true){
					$(v).children('div.select_model').children('.select_val').blur();
					var check_v = select_val.attr('select-val');
					var check_html = marquee.children('dd[select-value='+check_v+']').html();
					select_val.val(check_html);
				}
			};
			function evaluate(current){				//选择选项的方法
				var val = $(current).html();
				var value = $(current).attr('select-value');
				var ip = $(v).children('div.select_model').children('.select_val');
				ip.val(val);
				ip.attr('select-val',value);
				marquee.children('dd').removeClass(opt.shadowClass);
				$(current).addClass(opt.shadowClass);
			}
			$(document).keydown(function(event){ 			//监听键盘事件
				if(marquee.css('display') == 'block' && opt.inputSearch != true){
					event.preventDefault();
					var s_t = marquee.scrollTop();
					var cur_num = marquee.children('dd.'+opt.shadowClass).index();
					if(event.keyCode == 38){
						if(cur_num != 0){
							marquee.children('dd').removeClass(opt.shadowClass);
							marquee.children('dd').eq(cur_num-1).addClass(opt.shadowClass);
							if(cur_num*dd_h-dd_h < s_t){
								marquee.scrollTop(cur_num*dd_h-dd_h);
							}
						}else{
							if(opt.scrollLoop == true){
								marquee.children('dd').removeClass(opt.shadowClass);
								marquee.children('dd').eq(num_value-1).addClass(opt.shadowClass);
								marquee.scrollTop(num_value*dd_h);
							}
						}
					}
					if(event.keyCode == 40){
						if(cur_num != num_value-1){
							marquee.children('dd').removeClass(opt.shadowClass);
							marquee.children('dd').eq(cur_num+1).addClass(opt.shadowClass);
							var marque_h = marquee.height();			//下拉框的高度
							if(cur_num*dd_h+dd_h > marque_h){
								marquee.scrollTop(cur_num*dd_h+dd_h);
							}
						}else{
							if(opt.scrollLoop == true){
								marquee.children('dd').removeClass(opt.shadowClass);
								marquee.children('dd').eq(0).addClass(opt.shadowClass);
								marquee.scrollTop(0);
							}
						}
					}
					if(event.keyCode == 13){
						var this_val = marquee.children('dd.'+opt.shadowClass).attr('select-value');
						var t_input = marquee.children('dd.'+opt.shadowClass).parent().prev().children('input.select_val');
						var value = t_input.attr('select-val');
						if(this_val == value){
							t_input.attr('data-change','false');
						}else {
							t_input.attr('data-change','true');
						}
						marquee.children('dd.'+opt.shadowClass).click();
					}
				}
			});
			$("dl.select_check dd").on('click',function(){
				var this_val = $(this).attr('select-value');
				var t_input = $(this).parent().prev().children('input.select_val');
				var value = t_input.attr('select-val');
				if(this_val == value){
					t_input.attr('data-change','false');
				}else {
					t_input.attr('data-change','true');
				}
			});
		})
	}
})(jQuery)
