export default {
    hasClass: function(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    },
    //计算元素距离窗口左边的距离
    leftDistance: function(el) {
        let left = el.offsetLeft;
        let scrollLeft;
        while (el.offsetParent) {
            el = el.offsetParent;
            left += el.offsetLeft;
        }
        scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        return left - scrollLeft;
    },
    timeFormat: function(time) {
        let tempMin = parseInt(time / 60);
        let tempSec = parseInt(time % 60);
        let curMin = tempMin < 10 ? ('0' + tempMin) : tempMin;
        let curSec = tempSec < 10 ? ('0' + tempSec) : tempSec;
        return curMin + ':' + curSec;
    },
    percentFormat: function(percent) {
        return (percent * 100).toFixed(2) + '%';
    },
    //生成从minNum到maxNum的随机数
    randomNum: function(minNum,maxNum) {
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    },
    ajax: function(option) {
        option.beforeSend && option.beforeSend();
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    option.success && option.success(xhr.responseText);
                } else {
                    option.fail && option.fail(xhr.status);
                }
            }
        };
        xhr.open('GET', option.url);
        xhr.send(null);
    }
};