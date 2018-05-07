# animateSelect2.0
通过在实际开发中发现的问题对之前的第一套进行了优化，自定义下拉框插件

功能介绍：
①.样式多样美观，可以定义
②.多种下拉框的展开和收起动画，支持动画效果及时间自定义
③.包括默认的下拉效果及带搜索功能的下拉效果，默认下拉效果下支持上下方向键盘及回车键选择
④.下拉框的展开位置根据下拉框当前所在页面位置来判断上下方视野大的一方来展示
⑤.下拉框的高度根据页面窗口的可视区域自动赋值
⑥.下拉框中默认效果下可控制是否能让键盘上下选择时循环选择

缺点：
①.采用ajax联动时，下一级的联动的执行需要在上一个ajax请求的回调下接着执行
②.无法使用select标签的change事件，要监听下拉款的值是否发生变化需要获取data-change自定义属性，用法下文介绍
③.默认初始选中的赋值是在自定义标签的select-val来确认，为空默认选中第一个，有值会将当前的值的德容设为默认值
④.基本html结构框架不能改变


使用反法：
①.在script中使用
    $("自定义下拉框的父级元素的id或者class").animateSelect({
		  //此处根据需求进行配置，配置项如下
		});
②.自定义配置项：
			displayAnim : 'fadeInDown',	//默认选项的显示动画的class名
			hideAnim: 'fadeOutUp',			//默认选项的隐藏动画的class名
			displayTime: '500',			//下拉框出现的动画时间
			hideTime: '500',			//下拉框收起的动画时间
			shadowClass: "select_shadow",		//选中元素的特殊样式，自定义样式的class名（这里必须用class）
			scrollLoop: true,			//是否能让键盘上下选择时循环选择（true：可循环）
			inputSearch: false			//是否使用带搜索的选择框
③.监听下拉框值是否发生变化的方法：
			$('.select_box dl.select_check dd').on('click',function(){          //此处可在dd上使用onclick="方法名（this）"的方法使用
				var is_change = $(".select_box .select_val").attr('data-change');
				if(is_change == 'true'){      //值发生了变化
					$("#is_change").html('当前下拉框的值<span style="color: #AA0000;">发生</span>了变化');
				}else{                        //值未发生变化
					$("#is_change").html('当前下拉框的值<span style="color: #AA0000;">未发生</span>变化');
				}
				var select_html = $(this).html();     //文本内容
				$("#opt_html").html(select_html);
				var opt_value = $(this).attr('select-value');   //相当于option中的value
				$("#opt_value").html(opt_value);
			})
