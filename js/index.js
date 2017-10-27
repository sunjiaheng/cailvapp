// input实时监测  小插件
(function ($) {
    $.fn.watch = function (callback) {
        return this.each(function () {
            //缓存以前的值  
            $.data(this, 'originVal', $(this).val());

            //event  
            $(this).on('keyup paste', function () {
                var originVal = $.data(this, 'originVal');
                var currentVal = $(this).val();

                if (originVal !== currentVal) {
                    $.data(this, 'originVal', $(this).val());
                    callback(currentVal);
                }
            });
        });
    }
})(jQuery);
//自定义jq插件
(function($){
    	function LefttoRight(options){  //配置参数
    		var defaults = {"ajax":null} //默认参数
    		var settings = {};   //实际参数
    		var $this = this;
    		settings = $.extend(settings , defaults , options);
	        bbb()
	        function bbb(){
				settings.div.css({"z-index":"20"}).addClass('animated fadeInRightBig').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$(this).css({"z-index":"10"}).removeClass('animated fadeInRightBig').siblings('div:not(.loading)').css({"z-index":"1"});
    
                    
				});
                
	        }
    	}
   		function RighttoLeft(options){  //配置参数
    		var defaults = {"ajax":null };   //默认参数
    		var settings = {};   //实际参数
    		var $this = this;
    		settings = $.extend(settings , defaults , options);
	        bbb()
	        function bbb(){
				settings.div.css({"z-index":"20"}).addClass('animated fadeInLeftBig').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).css({"z-index":"10"}).removeClass('animated fadeInLeftBig').siblings('div:not(.loading)').css({"z-index":"1"})
				    
                    if(settings.div.hasClass('home')&&!$this.hasClass('login')){
                        //登录成请求两个红点数据
                        GetMyApplyList();//获取apply list
                        GetMyApproveList();//获取MyApproveList
                        GetInvoiceList()
                    }
                    if(settings.div.hasClass('MyApply')){
                        GetMyApplyList();//获取apply list
                    }
                    if(settings.div.hasClass('MyRatify')){
                         GetMyApproveList();//获取MyApproveList
                    }
                });
                
	        }
    	}
       
    	$.fn.extend({
    		LefttoRight : LefttoRight,
    		RighttoLeft : RighttoLeft
    	});

})(jQuery);

var address = "http://192.168.1.202:8085/";//服务器地址

$(function(){
    // $(".home .header2 span").html($(window).width())//查看屏幕宽度
    //判断是否登录
    // localStorage.clear()
    if(localStorage.getItem("EmployeeId")){
        //加载发现存在用户，加载用户界面
        var temuser= template('user', {
            pic:localStorage.getItem("PersonalPhoto"),
            name:localStorage.getItem("EmployeeName"),
            yuangonghao:localStorage.getItem("EmployeeId"),
            bumen:localStorage.getItem("Department"),
            zhiwei:localStorage.getItem("LevelName")
        });
        $(".user").html(temuser);
        // 必须的数据
        GetMyApplyList();//获取apply list
        GetMyApproveList();//获取MyApproveList
        GetInvoiceList()
        //禁用4个按钮是否可用
        setTimeout(function(){
            ableinput()
        },500)
        
    }
    else{
        $(".home").LefttoRight({"div":$(".login")})
    }

    //登录
    $(".login button").click(function(){
        login()
    })
    //前往用户中心
    $(".home").on("click",".icon-ren",function() {
        $(".home").LefttoRight({"div":$(".user")})
       
    });

    //忘记秘密
    $(".login .main p").click(function(){
        $(".login").LefttoRight({"div":$(".PhoneCheck")})
    })
    //忘记秘密后退
    $(".PhoneCheck .icon-houtui").click(function(){
        $(".PhoneCheck").RighttoLeft({"div":$(".login")})
    })
    //发送验证码
    var sendOnoff = true;
    $(".PhoneCheck .send").click(function(){
        if(sendOnoff){
            sendPhoneCheck($(".PhoneCheck .tel input").val())//发送验证码

            sendOnoff = false;
            var $this = $(this);
            $this.removeClass("send").addClass("send2");
            var times = 5;//倒计时时间
            $this.html(times+"s");
            var sendTime = setInterval(function(){
                times--
                if(times == 0){
                    clearInterval(sendTime)
                    $this.addClass("send").removeClass("send2")
                    sendOnoff = true
                    $this.html("发送验证码");
                    $(".PhoneCheck .tel input").removeAttr('disabled')
                }
                else{
                    $this.html(times+"s");
                    $(".PhoneCheck .tel input").attr("disabled","disabled")
                }
                
            },1000)
        }
    })
    //发送ajax验证验证码
    $(".PhoneCheck .test").click(function(){
        var phone = $(".PhoneCheck .tel input").val();
        var msgID = localStorage.getItem('msgID');
        var verifyCode = $(".PhoneCheck .textnum").val();
        phoneCheck(phone,verifyCode,msgID)
        
    })


    $(".ResetPassword .icon-houtui").click(function(){
        $(".ResetPassword").RighttoLeft({"div":$(".PhoneCheck")})
    })
    $(".ResetPassword .test").click(function(){
        if($(".ResetPassword input").eq(0).val()==$(".ResetPassword input").eq(1).val()){
            ResetPassword(localStorage.getItem("UserID"),$(".ResetPassword .textnum").val())
        }
        else{
            errorInfo("两次密码不同！")
        }
        
       
    })


    //user 后退带  Home
    $(".user").on("click",".icon-houtui",function() {
        $(".user").RighttoLeft({"div":$(".home")})
    });
    //退出登录
    $(".user").on("click",".btn",function(){
        Logout()
    })
    //重置密码
    $(".user").on("click",".chongzhimima",function(){
        localStorage.clear();
        $(".user").LefttoRight({"div":$(".PhoneCheck")})
    })


    //报销申请
    $(".baoxiao").click(function(){
        $(this).LefttoRight({"div":$(".ExpenseApply")})
        GetInvoiceList()
    })
    $(".ExpenseApply").on("click",".icon-houtui",function() {
        $(this).RighttoLeft({"div":$(".home")})
    });
    $(".ExpenseApply").on("click",".list li",function(){
        if($(this).find(".right i").hasClass("icon-xuanzhong")){
            $(this).find(".right i").removeClass("icon-xuanzhong").addClass("icon-weixuanzhong")
        }
        else{
            $(this).find(".right i").removeClass("icon-weixuanzhong").addClass("icon-xuanzhong")
        }   
    })
    $(".ExpenseApply").on("click","button",function(){
        CreateAnonymousNewTaskByStartNode()
    })


    //我的申请  相关
    $(".home").on("click",".wode",function(){
        $(this).LefttoRight({"div":$(".MyApply")})
        GetMyApplyList()
    })
     $(".MyApply").on("click",".icon-houtui",function() {
        $(this).RighttoLeft({"div":$(".home")})
    });
    $(".MyApply").on("click",".title li",function(){
        $(this).addClass("active").siblings().removeClass('active')
        $(".MyApply").find(".box ul").eq($(this).index()).addClass("active").siblings().removeClass('active')
    })
    $(".MyApply").on("click",".box li",function(){
        
        $(".details").attr("taskId",$(this).attr("taskId"))
        $(".details").attr("workFlowNodeId",$(this).attr("workFlowNodeId"))
        $(".details").attr("travelId",$(this).attr("travelId"))
        $(".details").attr("BusinessId",$(this).attr("BusinessId"))
        $(".details").attr("work_state_code",$(this).attr("work_state_code"))

        //我的申请详情  ajax
        FormBuilding($(this).attr("workFlowNodeId"),$(this).attr("businessId"),$(this).attr("travelId"))
        localStorage.setItem(
            "shenqing_work_state_code",
            $(this).attr("work_state_code")==0?false: true
        )
    })
    $(".details").on("click",".icon-houtui",function(){
        $(".details").RighttoLeft({"div":$(".MyApply")})
    })
    $(".details").on("click",".btn2",function() {
        var fasong = true;
        $(".details").find(".true").each(function(){
            if($(this).html().indexOf("<input")>0){
                if($(this).find("input").val().length!=0){
                    // console.log("yes1:"+ $(this).parent().attr("class"))

                }
                else{
                    // console.log("no1:"+ $(this).parent().attr("class"))
                    fasong = false
                }
            }
            else if($(this).html().indexOf("<textarea")>0){
                if($(this).find("textarea").html().length!=0){
                    // console.log("yes2:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no2:"+ $(this).parent().attr("class"))
                    fasong = false
                }
            }
            else{
                if($(this).html().length!=0){
                    // console.log("yes3:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no3:"+ $(this).parent().attr("class"))
                    fasong = false 
                }
            } 
        })
        if(fasong){
            UserSubmitNewOrUpdateTaskByNodeId($(".details"),$(".details").attr("taskid"))
        }
        else{
            errorInfo("信息请填写完整")
        }
        
    })


    //我的审批
    $(".home").on("click",".shenpi",function(){
        $(this).LefttoRight({"div":$(".MyRatify")})
        GetMyApproveList();
    })
     $(".MyRatify").on("click",".icon-houtui",function() {
        $(this).RighttoLeft({"div":$(".home")})
    })
    $(".MyRatify").on("click",".title li",function(){
        $(this).addClass("active").siblings().removeClass('active')
        $(".MyRatify").find(".box ul").eq($(this).index()).addClass("active").siblings().removeClass('active')
    })
     $(".MyRatify").on("click",".box li",function(){
       
        $(".details2").attr("taskId",$(this).attr("taskId"))
        $(".details2").attr("workFlowNodeId",$(this).attr("workFlowNodeId"))
        $(".details2").attr("travelId",$(this).attr("travelId"))
        $(".details2").attr("BusinessId",$(this).attr("BusinessId"))
        $(".details2").attr("work_state_code",$(this).attr("work_state_code"))
        localStorage.setItem(
            "shenpi_work_state_code",
            $(this).attr("work_state_code")
            )
        
        FormBuilding2($(this).attr("workFlowNodeId"),$(this).attr("businessId"),$(this).attr("travelId"),$(this).attr("work_state_code"))
    })
    $(".details2").on("click",".icon-houtui",function(){
        $(".details2").RighttoLeft({"div":$(".MyRatify")})
    })
    $(".details2").on("click",".btn",function() {
        // console.log("审批！")
        var fasong = true;
        $(".details2").find(".true").each(function(){
            if($(this).html().indexOf("<input")>0){
                if($(this).find("input").val().length!=0){
                    // console.log("yes1:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no1:"+ $(this).parent().attr("class"))
                    fasong = false
                }
            }
            else if($(this).html().indexOf("<textarea")>0){
                if($(this).find("textarea").html().length!=0){
                    // console.log("yes2:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no2:"+ $(this).parent().attr("class"))
                    fasong = false
                }
            }
            else{
                if($(this).html().length!=0){
                    // console.log("yes3:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no3:"+ $(this).parent().attr("class"))
                    fasong = false 
                }
            } 
        })
        if(fasong){
            UserSubmitNewOrUpdateTaskByNodeId($(".details2"),$(".details2").attr("taskid")) 
        }
        else{
            errorInfo("信息请填写完整")
        }
        
    })


    //出差申请   TravelApply
    $(".chucai").click(function(){
        //出差申请  ajax
        FormBuilding()
    })
    $(".TravelApply").on("click",".icon-houtui",function() {
        $(".TravelApply").RighttoLeft({"div":$(".home")})
    });
    $(".TravelApply").on("change",".div1 input",function() {
        if($(this).prop("checked")){
            GetSubmitUserInfo()
        }
        else{
            cleatNewData()
        }
        
    });
    $(".TravelApply").on("blur",".Code_SQRGH input",function() {
        GetSubmitUserInfo($(this).val())
    });

    $(".TravelApply").on("click",".btn",function() {
        var fasong = true;
        $(".TravelApply").find(".true").each(function(){
            if($(this).html().indexOf("<input")>0){
                if($(this).find("input").val().length!=0){
                    // console.log("yes1:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no1:"+ $(this).parent().attr("class"))
                    fasong = false
                }
            }
            else if($(this).html().indexOf("<textarea")>0){
                if($(this).find("textarea").html().length!=0){
                    // console.log("yes2:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no2:"+ $(this).parent().attr("class"))
                    fasong = false
                }
            }
            else{
                if($(this).html().length!=0){
                    // console.log("yes3:"+ $(this).parent().attr("class"))
                }
                else{
                    // console.log("no3:"+ $(this).parent().attr("class"))
                    fasong = false 
                }
            } 
        })
        if(fasong){
            UserSubmitNewOrUpdateTaskByNodeId($(".TravelApply"))   
        }
        else{
            console.log("error")
            errorInfo("信息请填写完整")
        }
       
    })
    




    //单选
    var $selectThis;
    $(".TravelApply").on("click",".Select",function(){
        $(this).LefttoRight({"div":$(".selecta")})//是否异步？
        var lSindex = $(this).attr("class").indexOf(" ")
        var lSname = $(this).attr("class").substring(0,lSindex)

        var selectaArrData = JSON.parse(localStorage.getItem(lSname))
        var selectaData = {
            "title":$(this).find(".left").html(),
            "dataul":selectaArrData
        }
        var html = template("selecta", selectaData);
        $(".selecta").html(" ");
        $(".selecta").html(html);
    
       
        $selectThis = $(this);
    })
    $(".selecta").on("click","li",function(){
        $(".selecta").RighttoLeft({"div":$(".TravelApply")})
        $selectThis.find(".right").html($(this).html())
    })
    //单选带搜索
    var $select2This;
    $(".TravelApply").on("click",".Select2",function(){
        $(this).LefttoRight({"div":$(".selectb")})

        $(".selectb h2").html($(this).find(".left").html())

        var lSindex = $(this).attr("class").indexOf(" ")
        var lSname = $(this).attr("class").substring(0,lSindex)
        if(lSname == "Code_CCMDD"){
            $(".selectb ul").html(" ");
            setTimeout(function(){
                 $(".TravelApply").find(".Code_CCMDDS .right").html(" ")
             },1000)
           
            for(var key in shengshidata){
                $("<li></li>").html(key).appendTo($(".selectb ul"))
            }
            
        }
        else if(lSname == "Code_CCMDDS"){
            if($(".TravelApply").find(".Code_CCMDD .right").html() == "" ){
                $(".selectb").LefttoRight({"div":$(".TravelApply")})
                return;
            }
            $(".selectb ul").html(" ");
            for(var i=0;i<shengshidata[$(this).siblings('.Code_CCMDD').find(".right").html()].length;i++){
                $("<li></li>").html(shengshidata[$(this).siblings('.Code_CCMDD').find(".right").html()][i]).appendTo($(".selectb ul"))
            }
            
        }
        else{
            var selectbArrData = JSON.parse(localStorage.getItem(lSname))
            var selectbData = {
                "dataul":selectbArrData
            }
            var html = template("selectb", selectbData);
            $(".selectb ul").html(" ");
            $(".selectb ul").html(html);
        }
        $select2This = $(this)
    })
    $(".selectb").on("click","li",function(){
        $(".selectb").RighttoLeft({"div":$(".TravelApply")})
         $select2This.find(".right").html($(this).html())

    })
    //selectb 搜索功能
    $(".selectb input").watch(function(){
        console.log("111")
        for(var i=0;i<$(".selectb").find("li").size();i++){
            if($(".selectb").find("li").eq(i).html().indexOf($(".selectb input").val()) != -1){
                $(".selectb").find("li").eq(i).show()
            }else{
                $(".selectb").find("li").eq(i).hide()
            }
        }
    })
    //多选带搜索
    var $MultipleSelect2This;
    $(".TravelApply").on("click",".MultipleSelect2",function(e){
        if(e.target.nodeName == "DIV"){
            $("this").LefttoRight({"div":$(".MultipleSelect2c")})

            $(".MultipleSelect2c h2").html($(this).find(".left").html())

            var lSindex = $(this).attr("class").indexOf(" ")
            var lSname = $(this).attr("class").substring(0,lSindex)
            var selectcArrData = JSON.parse(localStorage.getItem(lSname))
            var selectcData = {
               
                "dataul":selectcArrData
            }
            var html = template("MultipleSelect2c", selectcData);
            $(".MultipleSelect2c ul").html(" ");
            $(".MultipleSelect2c ul").html(html);
            
            $MultipleSelect2This = $(this)
        }
    })
    //多选删除
    $(".MultipleSelect2 .right").on("click","i",function(e){
        var del = $(this).parent()
        del.remove()
    })
    //
    $(".MultipleSelect2c").on("click","li",function(){
        $(".MultipleSelect2c").RighttoLeft({"div":$(".TravelApply")})
        var span = $("<span></span>").html("<i class='iconfont icon-x'></i>"+$(this).html())
        $MultipleSelect2This.append(span)
    })

    //搜索功能
    $(".MultipleSelect2c").find("input").watch(function(){
        for(var i=0;i<$(".MultipleSelect2c").find("li").size();i++){
            if($(".MultipleSelect2c").find("li").eq(i).html().indexOf($(".MultipleSelect2c input").val()) != -1){
                $(".MultipleSelect2c").find("li").eq(i).show()
            }else{
                $(".MultipleSelect2c").find("li").eq(i).hide()
            }
        }
    })


    var Code_CCQSRQ,Code_CCJSRQ,allDate;
    $(".TravelApply").on("blur",".Code_CCQSRQ input",function(){
        if($(".TravelApply").find(".Code_CCQSRQ input").val() != ""){
            Code_CCQSRQ = new Date($(".TravelApply").find(".Code_CCQSRQ input").val())
        }
        else{
            $(".TravelApply").find(".Code_CCZTS .right input").val("")
        }
        if($(".TravelApply").find(".Code_CCJSRQ input").val() != ""){
            Code_CCJSRQ = new Date($(".TravelApply").find(".Code_CCJSRQ input").val())
        }
        else{
            $(".TravelApply").find(".Code_CCZTS .right input").val("")
        }
        if($(".TravelApply").find(".Code_CCQSRQ input").val() != ""
            &&$(".TravelApply").find(".Code_CCJSRQ input").val() != ""){
            allDate = Code_CCJSRQ - Code_CCQSRQ;
            if(allDate>0){
                $(".TravelApply").find(".Code_CCZTS .right input").val(allDate/(1000*60*60*24))
            }else{
                $(".TravelApply").find(".Code_CCZTS .right input").val("时间选取有误")
            }
        }
        
    })
    $(".TravelApply").on("blur",".Code_CCJSRQ input",function(){
        if($(".TravelApply").find(".Code_CCQSRQ input").val() != ""){
            Code_CCQSRQ = new Date($(".TravelApply").find(".Code_CCQSRQ input").val())
        }
        else{
            $(".TravelApply").find(".Code_CCZTS .right input").val("")
        }
        if($(".TravelApply").find(".Code_CCJSRQ input").val() != ""){
            Code_CCJSRQ = new Date($(".TravelApply").find(".Code_CCJSRQ input").val())
        }
        else{
            $(".TravelApply").find(".Code_CCZTS .right input").val("")
        }
        if($(".TravelApply").find(".Code_CCQSRQ input").val() != ""&&$(".TravelApply").find(".Code_CCJSRQ input").val() != ""){
            allDate = Code_CCJSRQ - Code_CCQSRQ;
            if(allDate>0){
                $(".TravelApply").find(".Code_CCZTS .right input").val(allDate/(1000*60*60*24))
            }else{
                $(".TravelApply").find(".Code_CCZTS .right input").val("时间选取有误")
            }
        }
    })

    
})


//封装各种ajax
function login(){
    $(".loading").show()
    $.ajax({
        url: address + 'api/User/Login',
        type: 'POST',
        dataType: 'json',
        data: { Id: $(".login input").eq(0).val(), Password: $(".login input").eq(1).val() },
        success: function (data) {
            $(".loading").hide()
           
            if(data.Success){
                localStorage.setItem("shenqing_work_state_code",true)
                localStorage.setItem("shenpi_work_state_code",true)
                localStorage.setItem("token",data.Result[0]);
                for(var key in data.Result[1]){
                    localStorage.setItem(key,data.Result[1][key]);
                }
                localStorage.setItem("MenuRoles",JSON.stringify(data.Result[1].MenuRoles))
                localStorage.setItem("telnum",data.Result[2].ServiceCenterHotline)
                //禁用4个按钮是否可用
                setTimeout(function(){
                    ableinput()
                },500)
                
                $(".login").RighttoLeft({'div':$(".home")});

                var temuser= template('user', {
                    pic:data.Result[1].PersonalPhoto,
                    name:data.Result[1].EmployeeName,
                    yuangonghao:data.Result[1].EmployeeId,
                    bumen:data.Result[1].Department,
                    zhiwei:data.Result[1].LevelName
                });
                $(".user").html(temuser);

                //登录成请求两个红点数据
                GetMyApplyList();//获取apply list
                GetMyApproveList();//获取MyApproveList
                GetInvoiceList()
            }

            else{
                errorInfo(data.Message)
            }
        },
        error: function (jqXHR, textStatus, err) {
            if(jqXHR.status == 401){
                errorInfo("身份过期，重新登录")
            }
            else{
                errorInfo("系统异常！")
                $(".loading").hide()
            }
            
        }
    });
}
//获取MyApplyList
function GetMyApplyList(){
    $(".loading").show()
    Myajax({
        url:'api/Form/GetMyApplyList',
        type:'GET',
        data:{"userId":localStorage.getItem("UserID")},
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                if(data.Result[0].length>0){
                    console.log("MyApplyList：" +data.Result[0].length)
                    $(".home .circle").eq(1).css({"display":"block"}).html(data.Result[0].length)
                    // $(".home").find(".wode1").addClass("wode").removeClass("wode1")
                }
                else{
                    $(".home .circle").eq(1).css({"display":"none"})

                    // $(".home").find(".wode").addClass("wode1").removeClass("wode")

                }
                
                var MyApplyData = {
                    data0:data.Result[0],
                    data1:data.Result[1]
                };

                var html = template("MyApply", MyApplyData);
                $(".MyApply").html(html)
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
}
//获取MyApproveList
function GetMyApproveList(){
    $(".loading").show()
    Myajax({
        url:'api/Form/GetMyApproveList',
        type:'GET',
        data:{"userId":localStorage.getItem("UserID")},
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                if(data.Result[0].length>0){
                    $(".home .circle").eq(2).css({"display":"block"}).html(data.Result[0].length)
                    // $(".home").find(".shenpi1").addClass("shenpi").removeClass("shenpi1")
                }
                else{
                    $(".home .circle").eq(2).css({"display":"none"})
                    // $(".home").find(".shenpi").addClass("shenpi1").removeClass("shenpi")
                }
                
                var MyRatifyData = {
                    data0:data.Result[0],
                    data1:data.Result[1]
                };
                // console.log(MyRatifyData)

                var html = template("MyRatify", MyRatifyData);
                $(".MyRatify").html(html)
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
    // $.ajax({
    //     url: address + 'api/Form/GetMyApproveList',
    //     type: 'GET',
    //     dataType: 'json',
    //     data: {"userId":localStorage.getItem("UserID")},
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             if(data.Result[0].length>0){
    //                 $(".home .circle").eq(2).css({"display":"block"}).html(data.Result[0].length)
    //                 // $(".home").find(".shenpi1").addClass("shenpi").removeClass("shenpi1")
    //             }
    //             else{
    //                 $(".home .circle").eq(2).css({"display":"none"})
    //                 // $(".home").find(".shenpi").addClass("shenpi1").removeClass("shenpi")
    //             }
                
    //             var MyRatifyData = {
    //                 data0:data.Result[0],
    //                 data1:data.Result[1]
    //             };
    //             // console.log(MyRatifyData)

    //             var html = template("MyRatify", MyRatifyData);
    //             $(".MyRatify").html(html)
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // });
}
function FormBuilding(workFlowNodeId,businessId,travelId){
    $(".loading").show()
    Myajax({
        url:'api/Form/FormBuilding',
        type:'get',
        data:{
            "userId":localStorage.getItem("UserID"),
            "workFlowNodeId":workFlowNodeId,
            "businessId":businessId,
            "travelId":travelId
        },
        success: function (data) {
            $(".loading").hide()
            if(data.Success){
                //二级菜单固定选项
                for(var i=0;i<data.Result[0][0].Forms[0].FormElements.length;i++){
                    if(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure.length!=0){
                        localStorage.setItem(
                            data.Result[0][0].Forms[0].FormElements[i].ColumnName,
                            JSON.stringify(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure)
                        )
                    }
                }
                if(data.Result[0][1]){
                    var fjdata  = data.Result[0][1].Forms
                }
                else{
                    var fjdata = null;
                }
                if(data.Result[0][3]){
                    var zcdata = data.Result[0][3].Forms
                }
                else{
                    var zcdata = null;
                }
                if(data.Result[0][2]){
                    var jddata = data.Result[0][2].Forms
                }
                else{
                    var jddata = null;
                }
               

                var TravelApplyData = {
                    FormBuildingdata:data.Result[0][0].Forms[0].FormElements,
                    TravelApplyName:localStorage.getItem("EmployeeName"),
                    WorkFlowNodeId:data.Result[0][0].WorkFlowNodeId,
                    work_state_code:$(".details").attr("work_state_code"),
                    feijidata:fjdata,
                    jiudiandata:zcdata,
                    zhuanchedata:jddata,
                    shenqing_work_state_code:localStorage.getItem("shenqing_work_state_code"),
                    telnum:localStorage.getItem("telnum")
                };
               
                console.log(TravelApplyData)
                if(workFlowNodeId){
                    $(".MyApply").LefttoRight({"div":$(".details")})
                    var html = template("details", TravelApplyData);
                    $(".details").html(html)
                }
                else{
                    $(".home").LefttoRight({"div":$(".TravelApply")})
                    var html = template("TravelApply", TravelApplyData);
                    $(".TravelApply").html(html)
                }
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
    // $.ajax({
    //     url: address + 'api/Form/FormBuilding',
    //     type: 'get',
    //     dataType: 'json',
    //     data: {
    //         "userId":localStorage.getItem("UserID"),
    //         "workFlowNodeId":workFlowNodeId,
    //         "businessId":businessId,
    //         "travelId":travelId
    //     },
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             //二级菜单固定选项
    //             for(var i=0;i<data.Result[0][0].Forms[0].FormElements.length;i++){
    //                 if(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure.length!=0){
    //                     localStorage.setItem(
    //                         data.Result[0][0].Forms[0].FormElements[i].ColumnName,
    //                         JSON.stringify(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure)
    //                     )
    //                 }
    //             }
    //             if(data.Result[0][1]){
    //                 var fjdata  = data.Result[0][1].Forms
    //             }
    //             else{
    //                 var fjdata = null;
    //             }
    //             if(data.Result[0][3]){
    //                 var zcdata = data.Result[0][3].Forms
    //             }
    //             else{
    //                 var zcdata = null;
    //             }
    //             if(data.Result[0][2]){
    //                 var jddata = data.Result[0][2].Forms
    //             }
    //             else{
    //                 var jddata = null;
    //             }
               

    //             var TravelApplyData = {
    //                 FormBuildingdata:data.Result[0][0].Forms[0].FormElements,
    //                 TravelApplyName:localStorage.getItem("EmployeeName"),
    //                 WorkFlowNodeId:data.Result[0][0].WorkFlowNodeId,
    //                 work_state_code:$(".details").attr("work_state_code"),
    //                 feijidata:fjdata,
    //                 jiudiandata:zcdata,
    //                 zhuanchedata:jddata,
    //                 shenqing_work_state_code:localStorage.getItem("shenqing_work_state_code"),
    //                 telnum:localStorage.getItem("telnum")
    //             };
               
    //             console.log(TravelApplyData)
    //             if(workFlowNodeId){
    //                 $(".MyApply").LefttoRight({"div":$(".details")})
    //                 var html = template("details", TravelApplyData);
    //                 $(".details").html(html)
    //             }
    //             else{
    //                 $(".home").LefttoRight({"div":$(".TravelApply")})
    //                 var html = template("TravelApply", TravelApplyData);
    //                 $(".TravelApply").html(html)
    //             }
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // });

}
function FormBuilding2(workFlowNodeId,businessId,travelId,work_state_code){
    $(".loading").show()
    Myajax({
        url:'api/Form/FormBuilding',
        type:'get',
        data:{
            "userId":localStorage.getItem("UserID"),
            "workFlowNodeId":workFlowNodeId ,
            "businessId":businessId,
            "travelId":travelId
        },
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                for(var i=0;i<data.Result[0][0].Forms[0].FormElements.length;i++){
                    if(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure.length!=0){
                        localStorage.setItem(
                            data.Result[0][0].Forms[0].FormElements[i].ColumnName,
                            JSON.stringify(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure)
                        )
                    }
                }

                var TravelApplyData = {
                    FormBuildingdata:data.Result[0][0].Forms[0].FormElements,
                    TravelApplyName:localStorage.getItem("EmployeeName"),
                    WorkFlowNodeId:data.Result[0][0].WorkFlowNodeId,
                    work_state_code:$(".details").attr("work_state_code"),
                    shenpi_work_state_code:localStorage.getItem("shenpi_work_state_code")
                };
                $(".MyRatify").LefttoRight({"div":$(".details2")})
                var html = template("details2", TravelApplyData);
                $(".details2").html(html)
            }
            else{
                errorInfo(data.Message)
            }
            
        }
    })
    // $.ajax({
    //     url: address + 'api/Form/FormBuilding',
    //     type: 'get',
    //     dataType: 'json',
    //     data: {
    //         "userId":localStorage.getItem("UserID"),
    //         "workFlowNodeId":workFlowNodeId ,
    //         "businessId":businessId,
    //         "travelId":travelId
            
    //     },

    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             for(var i=0;i<data.Result[0][0].Forms[0].FormElements.length;i++){
    //                 if(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure.length!=0){
    //                     localStorage.setItem(
    //                         data.Result[0][0].Forms[0].FormElements[i].ColumnName,
    //                         JSON.stringify(data.Result[0][0].Forms[0].FormElements[i].DataTypeSoure)
    //                     )
    //                 }
    //             }

    //             var TravelApplyData = {
    //                 FormBuildingdata:data.Result[0][0].Forms[0].FormElements,
    //                 TravelApplyName:localStorage.getItem("EmployeeName"),
    //                 WorkFlowNodeId:data.Result[0][0].WorkFlowNodeId,
    //                 work_state_code:$(".details").attr("work_state_code"),
    //                 shenpi_work_state_code:localStorage.getItem("shenpi_work_state_code")
    //             };
    //             $(".MyRatify").LefttoRight({"div":$(".details2")})
    //             var html = template("details2", TravelApplyData);
    //             $(".details2").html(html)
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
            
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // });

}
function GetInvoiceList(){
    $(".loading").show()
    Myajax({
        url:'api/Form/GetInvoiceList',
        type:'get',
        data:{
            "userId":localStorage.getItem("UserID"),
        },
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                // $(".home .baoxiao .circle").html(data.Result.size())
                if(data.Result[0].length>0){
                    $(".home .circle").eq(0).css({"display":"block"}).html(data.Result[0].length)
                    // $(".home").find(".shenpi1").addClass("shenpi").removeClass("shenpi1")
                }
                else{
                    $(".home .circle").eq(0).css({"display":"none"})
                    // $(".home").find(".shenpi").addClass("shenpi1").removeClass("shenpi")
                }
                var ExpenseApplyDate = {
                    "ExpenseApplyDatelist":data.Result[0]
                }
                var html = template("ExpenseApply", ExpenseApplyDate);
                $(".ExpenseApply").html(html)
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
    // $.ajax({
    //     url: address + 'api/Form/GetInvoiceList',
    //     type: 'get',
    //     dataType: 'json',
    //     data: {
    //         "userId":localStorage.getItem("UserID"),
    //     },
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             // $(".home .baoxiao .circle").html(data.Result.size())
    //             if(data.Result[0].length>0){
    //                 $(".home .circle").eq(0).css({"display":"block"}).html(data.Result[0].length)
    //                 // $(".home").find(".shenpi1").addClass("shenpi").removeClass("shenpi1")
    //             }
    //             else{
    //                 $(".home .circle").eq(0).css({"display":"none"})
    //                 // $(".home").find(".shenpi").addClass("shenpi1").removeClass("shenpi")
    //             }
    //             var ExpenseApplyDate = {
    //                 "ExpenseApplyDatelist":data.Result[0]
    //             }
    //             var html = template("ExpenseApply", ExpenseApplyDate);
    //             $(".ExpenseApply").html(html)
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // })
}

function GetSubmitUserInfo(userId){
    $(".loading").show()
    var userIddata = userId?userId:localStorage.getItem("UserID")
    Myajax({
        url:'api/User/GetSubmitUserInfo',
        type:'POST',
        data: "=" + userIddata,
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                var newDate = data.Result;
                userNewData(newDate) 
            }else{
                errorInfo(data.Message)
            }              
        }
    })
    // $.ajax({
    //     url: address + 'api/User/GetSubmitUserInfo',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: "=" + userIddata,
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             var newDate = data.Result;
    //             userNewData(newDate) 
    //         }else{
    //             errorInfo(data.Message)
    //         }              
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // })
}




function userNewData(newDate){
    $(".TravelApply").find(".Code_SQRGH input").val(newDate.EmployeeID);
    $(".TravelApply").find(".Code_SQRXM input").val(newDate.UserName);
    $(".TravelApply").find(".Code_SQBM input").val(newDate.TowerGroupName);
    $(".TravelApply").find(".Code_SQRZW input").val(newDate.PositionLevelName);
    $(".TravelApply").find(".Code_CCRGH input").val(newDate.EmployeeID);
    $(".TravelApply").find(".Code_XM input").val(newDate.UserName);
    $(".TravelApply").find(".Code_CCRXSBM input").val(newDate.TowerGroupName);
    $(".TravelApply").find(".Code_CCRXSZW input").val(newDate.UserRoleName);
    $(".TravelApply").find(".Code_CCRGRZJ input").val(newDate.PositionLevelName);
    $(".TravelApply").find(".Code_CCRSJHM input").val(newDate.UserPhone);
    $(".TravelApply").find(".Code_CCSQSPR input").val(newDate.DirectManagerName);
}
function cleatNewData(){
    $(".TravelApply").find(".Code_SQRGH input").val("");
    $(".TravelApply").find(".Code_SQRXM input").val("");
    $(".TravelApply").find(".Code_SQBM input").val("");
    $(".TravelApply").find(".Code_SQRZW input").val("");
    $(".TravelApply").find(".Code_CCRGH input").val("");
    $(".TravelApply").find(".Code_XM input").val("");
    $(".TravelApply").find(".Code_CCRXSBM input").val("");
    $(".TravelApply").find(".Code_CCRXSZW input").val("");
    $(".TravelApply").find(".Code_CCRGRZJ input").val("");
    $(".TravelApply").find(".Code_CCRSJHM input").val("");
    $(".TravelApply").find(".Code_CCSQSPR input").val("");
}

function UserSubmitNewOrUpdateTaskByNodeId(page,taskId){
    var docJson = {};

    var $right = page.find(".travelpersoninfo .right")

    
    for(var i=0;i<$right.size();i++){
        var key = $right.eq(i).attr("tablename")+"."+$right.eq(i).attr("columnname")
       // console.log(key)
        if($right.eq(i).parent().attr("class") == 'Code_CCMDDS Select2' || $right.eq(i).parent().attr("class") == 'Code_CCMDD Select2'){
            var x = $right.eq(i).html().indexOf(" ")
            if(x>0){
                var value = $right.eq(i).html().substring(0,x)
            }
            else{
                var value = $right.eq(i).html()
            }
           
            
        }
        else if($right.eq(i).parent().hasClass('Select')){
            
            var classN = $right.eq(i).parent().attr("class").indexOf(" ")
            var arr = JSON.parse(localStorage.getItem($right.eq(i).parent().attr("class").substring(0,classN)))
            console.log(arr)
            for(var x=0;x<arr.length;x++){
                console.log(arr[x].Name == $right.eq(i).html())
                if(arr[x].Name == $right.eq(i).html()){
                    var value = arr[x].Value
                }
            }

        }
        else{
            var value = $right.eq(i).find("input").val()||$right.eq(i).find("textarea").html()||$right.eq(i).html()
        }
         docJson[key] = value;
        
    }

    $(".loading").show()

    Myajax({
        url:'api/WorkFlow/UserSubmitNewOrUpdateTaskByNodeId',
        type:'POST',
        data:{
            "taskId":taskId,
            "docJson":JSON.stringify(docJson),
            "workFlowNodeId": page.find(".travelpersoninfo").attr("workflownodeid"),
            "UserId": localStorage.getItem("UserID")
        },
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                page.RighttoLeft({"div":$(".home")})
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
    // $.ajax({
    //     url: address + 'api/WorkFlow/UserSubmitNewOrUpdateTaskByNodeId',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: {
    //         "taskId":taskId,
    //         "docJson":JSON.stringify(docJson),
    //         "workFlowNodeId": page.find(".travelpersoninfo").attr("workflownodeid"),
    //         "UserId": localStorage.getItem("UserID")
    //     },
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             page.RighttoLeft({"div":$(".home")})
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // })
}

function CreateAnonymousNewTaskByStartNode(){
    var dataArr =[];
    var $li = $('.ExpenseApply').find(".list li")
    
    for(var i=0;i<$li.size();i++){
        var dataJson = {}
        if($li.eq(i).find("i").hasClass("icon-xuanzhong")){
            dataJson["WorkFlowNodeId"] = $li.eq(i).attr("WorkFlowNodeId")
            dataJson["TravelId"] = $li.eq(i).attr("TravelId")
            dataJson["userId"] = localStorage.getItem("UserID")
            dataArr.push(dataJson)
        }
    }
    $(".loading").show()
    // contentType   独有
    $.ajax({
        url: address + 'api/WorkFlow/CreateAnonymousNewTaskByStartNode',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataArr),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
        },
        success: function (data) {
            $(".loading").hide()
            if(data.Success){
                GetInvoiceList()//
                $(".ExpenseApply").RighttoLeft({"div":$(".home")})
            }
            else{
                errorInfo(data.Message)
            }
           
        },
        error: function (jqXHR, textStatus, err) {
            if(jqXHR.status == 401){
                errorInfo("身份过期，重新登录")
                localStorage.clear()
                $(".home").LefttoRight({div:$(".login")})
            }
            else{
                errorInfo("系统异常！")  
            }
            $(".loading").hide()
        }
    })
}
//禁用4个按钮是否可用
function ableinput(){
   
    var data = JSON.parse(localStorage.getItem("MenuRoles"))
    
    if(!data[0]){
        $(".chucai").addClass("chucaidisable").removeClass("chucai")
    }
    else{
        $(".chucaidisable").addClass("chucai").removeClass("chucaidisable")
    }

    if(!data[1]){
        $(".baoxiao").addClass("baoxiaodisable").removeClass("baoxiao")
    }
    else{
        $(".baoxiaodisable").addClass("baoxiao").removeClass("baoxiaodisable")
    }

    if(!data[2]){
        $(".wode").addClass("wodedisable").removeClass("wode")
    }
    else{
        $(".wodedisable").addClass("wode").removeClass("wodedisable")

    }

    if(!data[3]){
        $(".shenpi").addClass("shenpidisable").removeClass("shenpi")
    }
    else{
        $(".shenpidisable").addClass("shenpi").removeClass("shenpidisable")

    }
}
//退出登录
function Logout() {
    $(".loading").show()
    Myajax({
        url:'api/User/Logout',
        type:'POST',
        data: '=' + localStorage.getItem("token"),
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                localStorage.clear();
                $(".user").RighttoLeft({"div":$(".login")})
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
    // $.ajax({
    //     url: address + 'api/User/Logout',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: '=' + localStorage.getItem("token"),
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem("token"));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             localStorage.clear();
    //             $(".user").RighttoLeft({"div":$(".login")})
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
            
    //         // $('#token').val("");
           
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // })
}

function sendPhoneCheck(phone){
    $.ajax({
        url: address + 'api/User/SendSMSCode?phoneNo=' + phone,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if(data.Success){
                localStorage.setItem("msgID",data.Result)
                
            }
            else{
                errorInfo(data.Message)
            }
            
        },
        error: function (jqXHR, textStatus, err) {
            errorInfo("系统异常！")
            $(".loading").hide()
        }
    })
}

function phoneCheck(phone,verifyCode,msgID){
     $.ajax({
        url: address + 'api/User/VerifySMSCode?phoneNo=' + phone + '&code=' + verifyCode + '&msgID=' + msgID,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if(data.Success){
                localStorage.setItem("UserID",data.Result[0])
                localStorage.setItem("token",data.Result[1])
                $(".PhoneCheck").LefttoRight({"div":$(".ResetPassword")})
            }
            else{
                errorInfo(data.Message)
            }
        },
        error: function (jqXHR, textStatus, err) {
            errorInfo("系统异常！")
            $(".loading").hide()
        }
    })
}

function ResetPassword(userId,password){
    $(".loading").show()
    Myajax({
        url:'api/User/ResetPassword',
        type:'POST',
        data:{Id: userId, Password: password,token:localStorage.getItem('token') },
        success:function (data) {
            $(".loading").hide()
            if(data.Success){
                $(".ResetPassword").RighttoLeft({"div":$(".login")})
            }
            else{
                errorInfo(data.Message)
            }
        }
    })
    // $.ajax({
    //     url: address +'api/User/ResetPassword',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: {Id: userId, Password: password,token:localStorage.getItem('token') },
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('token'));
            
    //     },
    //     success: function (data) {
    //         $(".loading").hide()
    //         if(data.Success){
    //             $(".ResetPassword").RighttoLeft({"div":$(".login")})
    //         }
    //         else{
    //             errorInfo(data.Message)
    //         }
    //     },
    //     error: function (jqXHR, textStatus, err) {
    //         errorInfo("系统异常！")
    //         $(".loading").hide()
    //     }
    // })
    
}

//错误提示
function errorInfo(info){
    $(".error").html(info).css({"z-index":200}).show()
    setTimeout(function(){
        $(".error").hide(200)
    },3000)
}

//二次封装ajax  带token 
function Myajax(info){ // url  type  data  success
    $.ajax({
        url: address + info.url,
        type: info.type,
        dataType: 'json',
        data: info.data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + localStorage.getItem('token'));
        },
        success: info.success,
        error: function (jqXHR, textStatus, err) {
            if(jqXHR.status == 401){
                errorInfo("身份过期，重新登录")
                localStorage.clear()
                $(".home").LefttoRight({div:$(".login")})
            }
            else{
                errorInfo("系统异常！")  
            }
            $(".loading").hide()
        }
    })
}

    // Myajax({
    //     url:,
    //     type:,
    //     data:,
    //     success:
    // })

