var rcmdContainer = document.getElementById('rcmdContainer');
var apiUrl = 'https://test.phicomm.com:3442/blood-pressure-meter/health/discovery/recommend';
var params = JSON.stringify(param);

_ajax('post', apiUrl, params, 'application/json', function(res) {
    if (res.success && JSON.parse(res.data).status === 0) {
        var data = JSON.parse(res.data).data;
        var newEle = '';

        for(var i = 0; i < data.length; i++) {
            newEle += '<div class="rcmd-item"><div class="rcmd-pic"> <img src="' + data[i].coverUrl + '"></div> <div class="introduce"><h3>' + data[i].title + '</h3><p>#' + data[i].tags + '</p></div></div>';
        }
        rcmdContainer.innerHTML = newEle;
    }
});


function _ajax(type, url, param, contentType, callback) {
    if (typeof param == "undefined" && typeof callback == "undefined") {
        param = {};
        callback = null;
    } else if (typeof callback == "undefined") {
        if (typeof param == "function") {
            callback = param;
            param = {};
        } else {
            param = param || {};
            callback = null;
        }
    } else if (typeof param == "undefined") {
        if (typeof callback == "function") {
            param = {};
        } else {
            param = callback || {};
            callback = null;
        }
    } else {
        if (typeof param == "function") {
            param = {};
        } else {
            param = param || {};
        }

        if (typeof callback != "function") {
            callback = null;
        }
    }
    var ct = contentType ? contentType : 'text/plain';
    var _xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        _xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        _xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    _xmlhttp.onreadystatechange = function() {
        if (_xmlhttp.readyState == 4 && _xmlhttp.status == 200) {
            callback && callback({
                success: true,
                data: _xmlhttp.response || _xmlhttp.responseText,
                msg: "异步加载成功!",
                type: null,
                code: 200
            });
        } else {
            console.log("异步加载ing _xmlhttp.status  :" + _xmlhttp.status + "  _xmlhttp.readyState  :" + _xmlhttp.readyState);
        }
    };
    // ajax处理请求超时
    _xmlhttp.ontimeout = function() {
        callback && callback({
            success: false,
            data: null,
            msg: "请求超时",
            type: null,
            code: 0
        });
    };
    //ajax 请求出错的时候
    _xmlhttp.onerror = function() {
        callback && callback({
            success: false,
            data: null,
            msg: "请求出错",
            type: null,
            code: 0
        });
    };
    //  处理 Get 或者Post
    if (type == "GET") {
        _xmlhttp.open("GET", url, true);
        _xmlhttp.setRequestHeader('Content-Type', ct + ';charset=UTF-8');
        _xmlhttp.send();
    } else {
        _xmlhttp.open("POST", url, true);
        _xmlhttp.setRequestHeader('Content-Type', ct + ';charset=UTF-8');
        _xmlhttp.send(param);
    }
};