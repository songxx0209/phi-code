
var windowWidth = document.body.clientWidth; //window 宽度;
var tabTitle = document.getElementById('tab_title');
var tabBox = document.getElementById('tab_box');

var tab = null;
var tabIndex = 0; // 当前展示tab的索引

var tabList = null;
var tabLength = null;
var tabData = null; // tab标题 - 列表数据

var tar = 0; // 记录手指按下时的接触点位置
var endX = 0; // 展示区-最后停留的位置
var dist = 0; // 手指滑动的距离
var pagesize = 21; // 每页展示多少条数据

// 请求首页数据
$.ajax({
    url: 'https://feixunbeta.yinyuetai.com/api/feixun/area',
    type: "GET",
    dataType: "application/json", //指定服务器返回的数据类型
    success: function (data) {

        tabData = JSON.parse(data).data;
        var titleList = '';
        var contentList = '';
        for (var i = 0; i < tabData.length; i++) {
            tabData[i].page = 0;
            titleList += '<li><a>' + tabData[i].name + '</a></li>';
            contentList += '<div class="tab_list"><div class="lists"></div></div>';
        }
        tabTitle.innerHTML = titleList;
        tabBox.innerHTML = contentList;

        tabList = tabBox.querySelectorAll('.tab_list');
        tabLength = tabList.length;

        for (var i = 0; i < tabLength; i++) {
            tabList[i].style.width = windowWidth + "px";
            tabList[i].style.position = "fixed";
            tabList[i].style.left = i*windowWidth + "px";
            tabList[i].style.bottom = 0;
        }

        tabBox.style.overflow = 'hidden';
        tabBox.style.width = windowWidth * tabLength + "px";
        tabBox.style.height = "100%";

        tab = new MulitpeTab($('#J_Tabs2'), {
            // tab之间的间距
            gap: 20
        });
        tab.go(0);

        tab.addEventListener("onChange", function (index, prevIndex, $element) {
            //当前选中的序号，上一次的序号，当前选中的元素
            tabIndex = index;
            init.translate(tabBox, windowWidth, tabIndex);
            if (tabData[tabIndex].page === 0) {

                setTimeout(function(){
                    $('.tab_list').eq(tabIndex).dropload({
                        // scrollArea: window,
                        loadDownFn: function(me) {
                            tabData[tabIndex].page++;

                            var pageStart = 1 + pagesize*(tabData[tabIndex].page - 1);
                            var pageEnd = pageStart + pagesize - 1;

                            // 拼接HTML
                            $.ajax({
                                type: 'GET',
                                url: 'https://feixunbeta.yinyuetai.com/api/feixun/get-videos?area='+tabData[tabIndex].id+'&offset='+pageStart+'&item='+pageEnd,
                                dataType: 'application/json',
                                success: function(data) {
                                    
                                    var movieData = JSON.parse(data).data;
                                    var tabContent = '';
                                    var arrLen = movieData.length;
                                    if (arrLen > 0) {
                                        for (var i = 0; i < arrLen; i++) {
                                            tabContent += '<div class="tab_list_item"><a href="./details.html?id='+movieData[i].id+'"><img src="'+movieData[i].thumbnail+'" onerror="this.style.display=\'none\';this.onerror=null"></a><p>'+movieData[i].artist+'</p><p>'+movieData[i].name+'</p></div>';
                                        }
                                    } else { // 如果没有数据
                                        // 锁定
                                        me.lock();
                                        // 无数据
                                        me.noData();
                                    }
                                    // 为了测试，延迟1秒加载
                                    setTimeout(function() {
                                        // 插入数据到页面，放到最后面
                                        tabList[tabIndex].getElementsByClassName('lists')[0].innerHTML += tabContent;
                                        // 每次数据插入，必须重置
                                        me.resetload();
                                    }, 1000);
                                },
                                error: function(xhr, type) {
                                    // alert('Ajax error!');
                                    // 即使加载出错，也得重置
                                    // me.resetload();
                                }
                            });
                        }
                    });
                }, 300);    
            }
            
        });

        tabBox.addEventListener('touchstart', chstart, false);
        tabBox.addEventListener('touchmove', chmove, false);
        tabBox.addEventListener('touchend', chend, false);
    }
});

//滑动处理
var startX, startY;

//按下
function chstart(ev) {
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;

    ev.preventDefault;
    var touch = ev.touches[0];
    tar = touch.pageX;
    tabBox.style.webkitTransition = 'all 0s ease-in-out';
    tabBox.style.transition = 'all 0s ease-in-out';
}

//滑动
function chmove(ev) {
    ev.preventDefault;
    var touch = ev.touches[0];
    var distance = touch.pageX - tar;
    dist = distance;

    var _endX, _endY;
    _endX = ev.changedTouches[0].pageX;
    _endY = ev.changedTouches[0].pageY;
    var direction = GetSlideDirection(startX, startY, _endX, _endY);
    switch (direction) {
        case 3:
            init.touchs(tabBox, windowWidth, tar, distance, endX);
            break;
        case 4:
            init.touchs(tabBox, windowWidth, tar, distance, endX);
            break;

        default:
    }
}

//离开
function chend(ev) {
    var str = tabBox.style.transform;
    var strs = str.split(",", 1);
    endX = Number(strs[0].slice(10, -2));

    if (endX > 0) {
        init.back(tabBox, windowWidth, tar, 0, 0, 0.3);
        endX = 0
    } else if (endX < -windowWidth * tabLength + windowWidth) {
        endX = -windowWidth * tabLength + windowWidth;
        init.back(tabBox, windowWidth, tar, 0, endX, 0.3);
    } else if (dist < 0) {
        if (dist > -windowWidth / 4) {
            endX = -windowWidth * tabIndex;
            init.back(tabBox, windowWidth, tar, 0, endX, 0.3);
        } else if (dist < -windowWidth / 4) {
            ++tabIndex;
            init.translate(tabBox, windowWidth, tabIndex);
            endX = -tabIndex * windowWidth;
            tab.go(tabIndex);
        }

    } else if (dist > 0) {
        if (dist < windowWidth / 4) {
            endX = -windowWidth * tabIndex;
            init.back(tabBox, windowWidth, tar, 0, endX, 0.3);
        } else if (dist > windowWidth / 4) {
            --tabIndex;
            init.translate(tabBox, windowWidth, tabIndex);
            endX = -tabIndex * windowWidth;
            tab.go(tabIndex);
        }
    }
}

var init = {
    translate: function (obj, windowWidth, star) {
        endX = -star * windowWidth;
        obj.style.webkitTransform = 'translate(' + -star * windowWidth + 'px,0)';
        obj.style.transform = 'translate(' + -star * windowWidth + 'px,0)';
        obj.style.webkitTransition = 'all 0.3s ease-in-out';
        obj.style.transition = 'all 0.3s ease-in-out';
    },
    touchs: function (obj, windowWidth, tar, distance, endX) {
        obj.style.webkitTransform = 'translate(' + (distance + endX) + 'px, 0)';
        obj.style.transform = 'translate(' + (distance + endX) + 'px, 0)';
    },
    lineAnme: function (obj, stance) {
        obj.style.webkitTransform = 'translate(' + stance + 'px, 0)';
        obj.style.transform = 'translate(' + stance + 'px, 0)';
        obj.style.webkitTransition = 'all 0.1s ease-in-out';
        obj.style.transition = 'all 0.1s ease-in-out';
    },
    back: function (obj, windowWidth, tar, distance, endX, time) {
        obj.style.webkitTransform = 'translate(' + (distance + endX) + 'px,0)';
        obj.style.transform = 'translate(' + (distance + endX) + 'px,0)';
        obj.style.webkitTransition = 'all ' + time + 's ease-in-out';
        obj.style.transition = 'all ' + time + 's ease-in-out';
    }
};

function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}

//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动  
function GetSlideDirection(startX, startY, endX, endY) {
    var dy = startY - endY;
    var dx = endX - startX;
    var result = 0;

    //如果滑动距离太短
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
    }

    var angle = GetSlideAngle(dx, dy);
    if (angle >= -30 && angle < 30) {
        result = 4;
    } else if (angle >= 30 && angle < 150) {
        result = 1;
    } else if (angle >= -150 && angle < -30) {
        result = 2;
    }
    else if ((angle >= 150 && angle <= 180) || (angle >= -180 && angle < -150)) {
        result = 3;
    }

    return result;
}