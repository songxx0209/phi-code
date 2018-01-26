(function () {
    //由前面获得发现的type
    var disparam = JSON.stringify(param);
    //解析参数
    var search = window.location.search;
    var arrsign = search.substr(1).split("&");
    var searchobj=new Object({});
    for(var i=0;i<arrsign.length;i++){
        searchobj[arrsign[i].split("=")[0]]=encodeURI(arrsign[i].split("=")[1]);
    }
    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else{
            return false;
        }
    }
    if(isWeiXin()){
        document.getElementsByClassName("headertop")[0].style.display='block'
    }else{
        if(searchobj.Shareflag.toString() === "1"){
                document.getElementsByClassName("footersticky")[0].style.display='flex'
        }
    }
    document.getElementsByClassName("callbackthis")[0].addEventListener("click", function() {
        window.location.href = "scheme://phicomm.phicare/awaken/html/scheme?type=discovery+"+disparam.type+"+&resourceId="+searchobj.resourceId;
        window.setTimeout(function() {
            window.location.href = "https://phiclouds.phicomm.com/ota/Service/App/downloadpage?appid=2017030031&channel=1NEW"
        }, 2E3)
    }, !1);
})();