import template from "./template.js";
import init from "./init.js";
import imgMusic from "../img/music.png";
import "../css/style.css";

(function() {
    //工具
    const Tool = {
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

    //主体
    window.vsPlayAudio = function(option) {
        init();

        const defaultOption = {
            element: "vsPlayAudio",
            autoPlay: false,
            music: {
                //必需项,音乐配置
                type: 'cloud',
                //必需项,网易云方式指定填'cloud'
                source: 2778782119
                //必需项,网易云音乐歌单id
                //登录网易云网页版,在网页地址中拿到
                // ... playlist?id=317921676
            },
            random: false
        }

        let vsOption = option ? option : defaultOption;

        //未配置项填入默认配置
        for (let defaultKey in defaultOption) {
            if (!vsOption.hasOwnProperty(defaultKey)) {
                vsOption[defaultKey] = defaultOption[defaultKey];
            }
        }

        //载入模版
        document.getElementById(vsOption.element).innerHTML = template.body;

        let vsthis = this;
        let bars;
        let m = new Audio();
        let volume;
        let barNow = document.getElementById(vsOption.element + "-barNow");
        let time = document.getElementById(vsOption.element + "-time");
        let play = document.getElementById(vsOption.element + "-play");
        let pause = document.getElementById(vsOption.element + "-pause");
        let bar = document.getElementById(vsOption.element + "-bar");
        let barLoading = document.getElementById(vsOption.element + "-barLoading");
        let cover = document.getElementById(vsOption.element + "-cover");
        let coverBox = document.getElementById(vsOption.element + "-cover-box");
        let coverImg = document.getElementById(vsOption.element + "-cover-img");
        let coverTitle = document.getElementById(vsOption.element + "-title");
        let coverSinger = document.getElementById(vsOption.element + "-singer");
        let coverUl = document.getElementById(vsOption.element + "-ul");
        let coverVolume = document.getElementById(vsOption.element + "-volume");
        let coverVolumeLine = document.getElementById(vsOption.element + "-volume-line");
        let coverMenuIcon = document.getElementById(vsOption.element + "-menu-icon");
        let coverVolumeIcon = document.getElementById(vsOption.element + "-volume-icon");
        let coverRandomIcon = document.getElementById(vsOption.element + "-random-icon");
        let coverList;

        const baseUrl = 'http://120.79.36.48/';

        vsthis.random = vsOption.random;

        if (vsthis.random == false) {
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#fff");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#fff");
        }else{
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#03a9f4");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#03a9f4");
        }

        coverImg.src = imgMusic;

        if (vsOption.music.type === 'cloud') {
            m.volume = 0;
            Tool.ajax({
                url: baseUrl + 'playlist/detail?id=' + vsOption.music.source,
                beforeSend: () => {
                    //console.log('正在努力的拉取歌曲 ...');
                },
                success: (data) => {
                    //console.log('歌曲拉取成功！');
                    vsthis.nowAudio = 0;
                    vsthis.music = JSON.parse(data);
                    vsthis.inHtml();

                    if (vsOption.random) {
                        vsthis.init(vsthis.music[Tool.randomNum(0,(vsthis.music.length - +1))]);
                    }else{
                        vsthis.init();
                    }
                    
                    m.volume = .8;
                    coverVolumeLine.style.width = Tool.percentFormat(m.volume);
                },
                fail: (status) => {
                    console.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }

        //装载歌曲
        // if (!vsOption.audio[0].audioSrc == "") {
        //     m.src = vsOption.audio[0].audioSrc;
        // }

        vsthis.init = function(musicVal = vsthis.music[0]) {
            if (vsOption.music.type === 'cloud') {
                vsthis.nowAudio = musicVal.index;
                Tool.ajax({
                    url: baseUrl + 'music/url?id=' + musicVal.song_id,
                    beforeSend: () => {
                        //console.log('正在努力的拉取歌曲 ...');
                    },
                    success: (data) => {
                        let url = JSON.parse(data).url;
                        if (url !== null) {
                            //console.log('歌曲拉取成功！');
                            vsthis.audio = {
                                src: url
                            }
                            m.src = vsthis.audio.src;
                            //vsthis.inHtml(musicVal);

                            coverImg.src = musicVal.cover;
                            coverTitle.innerHTML = musicVal.name;
                            coverSinger.innerHTML = musicVal.author;

                            if (document.querySelector(".vsPlayAudio-control-hover")) {
                                document.querySelector(".vsPlayAudio-control-hover").classList.remove("vsPlayAudio-control-hover")
                            }
                            coverList[musicVal.index].classList.add("vsPlayAudio-control-hover");
                        } else {
                            //console.log('歌曲拉取失败！ 资源无效！');
                            console.log(musicVal.name + ' 无版权，或VIP歌曲');
                            if (vsthis.music.length !== 1) {
                                vsthis.next();
                            }
                        }
                    },
                    fail: (status) => {
                        console.error('歌曲拉取失败！ 错误码：' + status);
                    }
                });
            }
        }

        vsthis.inHtml = function(musicVal = vsthis.music[0]) {

            const template = `
                                <li class="vsPlayAudio-list" index={{index}}>
                                    <span class="vsPlayAudio-name">{{name}}</span>
                                    <span class="vsPlayAudio-author">{{author}}</span>
                                </li>
                            `;

            var html = "";
            var element;
            for (let index = 0; index < vsthis.music.length; index++) {
                element = template;
                element = element.replace("{{name}}", vsthis.music[index].name);
                element = element.replace("{{author}}", vsthis.music[index].author);
                element = element.replace("{{index}}", index);
                vsthis.music[index].index = index;
                html += element;
            }
            coverUl.innerHTML = html;

            coverList = document.querySelectorAll("." + vsOption.element + "-list");
            for (let index = 0; index < coverList.length; index++) {
                const element = coverList[index];
                coverList[index].onclick = vsthis.clickAudio;
            }
        }

        vsthis.play = function() {
            vsthis.onchangeVolume("play");
            play.style.display = 'none';
            pause.style.display = 'block';
            coverBox.style.animationPlayState = "running";
            vsthis.barStart();
        }

        vsthis.pause = function() {
            vsthis.onchangeVolume();
            play.style.display = 'block';
            pause.style.display = 'none';
            coverBox.style.animationPlayState = "paused";
            vsthis.barStop();
        }

        vsthis.next = function() {
            if (vsthis.random == true) {
                vsthis.init(vsthis.music[Tool.randomNum(0,(vsthis.music.length - +1))]);
            }else{
                if (vsthis.music.length != 1) {
                    if (vsthis.music.length == vsthis.nowAudio) {
                        vsthis.init(vsthis.music[0]);
                    } else {
                        vsthis.init(vsthis.music[vsthis.nowAudio + +1]);
                    }
                }
            }
            vsthis.play();
        }

        vsthis.clickAudio = function() {
            vsthis.init(vsthis.music[this.getAttribute("index")]);
            vsthis.play();
        }

        vsthis.barStart = function() {
            let num;
            let buff;
            //更新进度条和时间
            bars = (m.paused == false) && bars ? bars : (setInterval(function() {
                if (m.readyState && m.buffered.end(0) > 0) {
                    num = m.currentTime / m.duration;
                    buff = m.buffered.end(0) / m.duration;
                    barNow.style.width = Number(num * 100).toFixed(2) + "%";
                    barLoading.style.width = Number(buff * 100).toFixed(2) + "%";
                    time.innerHTML = Tool.timeFormat(m.currentTime) + " / " + Tool.timeFormat(m.duration);
                }
            }, 10));
        }

        vsthis.barStop = function() {
            clearInterval(bar);
            bars = false;
        }

        vsthis.clickBar = function() {
            let e = event || window.event;
            m.currentTime = m.duration * ((e.clientX - Tool.leftDistance(this)) / this.clientWidth);
            vsthis.play();
        }

        vsthis.clickVolume = function() {
            let e = event || window.event;
            m.volume = ((e.clientX - Tool.leftDistance(this)) / this.clientWidth);
            //console.log(((e.clientX - Tool.leftDistance(this)) / this.clientWidth));
            coverVolumeLine.style.width = Tool.percentFormat(m.volume)
            //vsthis.play();
        }

        vsthis.clickMenu = function() {
            if (coverUl.style.height == "206px") {
                coverUl.style.height = "0";
            } else {
                coverUl.style.height = "206px";
            }
        }

        vsthis.clickVolumeIcon = function() {
            if (m.volume > 0) {
                volume = m.volume
                m.volume = 0;
                coverVolumeIcon.classList.add("volume-off");
            } else {
                m.volume = volume ? volume : .8;
                coverVolumeIcon.classList.remove("volume-off");

            }
            coverVolumeLine.style.width = Tool.percentFormat(m.volume)
        }

        vsthis.clickRandomIcon = function() {
            //coverRandomIcon

            if (vsthis.random == true) {
                vsthis.random = false;
                document.querySelectorAll(".random-path")[0].setAttribute("fill", "#fff");
                document.querySelectorAll(".random-path")[1].setAttribute("fill", "#fff");
            }else{
                vsthis.random = true;
                document.querySelectorAll(".random-path")[0].setAttribute("fill", "#03a9f4");
                document.querySelectorAll(".random-path")[1].setAttribute("fill", "#03a9f4");
            }
        }

        vsthis.onchangeVolume = function(option) {
            var v = m.volume;
            if (option == "play") {
                m.play();
                m.autoplay = true;
                // m.volume = .8;
                // v = 0;
                // var t = setInterval(function() {
                //     v += 0.1;
                //     if (v <= 1) {
                //         m.volume = v;
                //     } else {
                //         clearInterval(t);
                //     }
                // }, 100);
            } else {
                m.pause();
                // var t = setInterval(function() {
                //     v -= 0.1;
                //     if (v > 0) {
                //         m.volume = v;
                //     } else {
                //         clearInterval(t);
                //         m.pause();
                //     }
                // }, 200);
            }
        }
        var leaveOut;
        cover.onmousemove = function() {
            play.classList.remove('vsPlayAudio-play-none');
            pause.classList.remove('vsPlayAudio-play-none');
            document.getElementById("vsPlayAudio-msk-play").style.opacity = .2;
            document.getElementById("vsPlayAudio-control").classList.add("vsPlayAudio-control-show");
            clearTimeout(leaveOut)

        };
        cover.onmouseleave = function() {
            leaveOut = setTimeout(function() {
                play.classList.add('vsPlayAudio-play-none');
                pause.classList.add('vsPlayAudio-play-none');
                document.getElementById("vsPlayAudio-msk-play").style.opacity = 0;
                document.getElementById("vsPlayAudio-control").classList.remove("vsPlayAudio-control-show");
            }, 1000);
        };
        play.onclick = vsthis.play;
        pause.onclick = vsthis.pause;
        bar.onclick = vsthis.clickBar;

        coverVolume.onclick = vsthis.clickVolume;
        coverMenuIcon.onclick = vsthis.clickMenu;
        coverVolumeIcon.onclick = vsthis.clickVolumeIcon;
        coverRandomIcon.onclick = vsthis.clickRandomIcon;

        //播放结束时的事件
        m.onended = function() {
            vsthis.pause();
            vsthis.next();
        }

        //准备就绪时的事件
        m.oncanplaythrough = function() {
            //barNow.innerHTML = Tool.timeFormat(0) + " / " + Tool.timeFormat(m.duration);
            if (vsOption.autoPlay) {
                vsthis.play();
            }
        }

        //意外终止时停止播放
        setInterval(function() {
            if (m.paused == true) {
                vsthis.pause();
            }
        }, 1000)
    }
    //window.vsPlayAudio = vsPlayAudio;
})()