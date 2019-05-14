import init from "./init.js";
import Tool from "./tool.js";
import template from "./template.js";
import imgMusic from "../img/music.png";
import "../css/style.css";
const baseUrl = 'http://120.79.36.48/';
let defaultOption;
let vsthis;
let bars;
let m = new Audio();
let volume;
let barNow;
let time;
let play;
let pause;
let bar;
let barLoading;
let cover;
let coverBox;
let coverImg;
let coverTitle;
let coverSinger;
let coverUl;
let coverVolume;
let coverVolumeLine;
let coverMenuIcon;
let coverVolumeIcon;
let coverRandomIcon;
let coverList;
let playFirst;
let vsOption;

class vsPlayAudio {
    constructor(option){
        init();

        defaultOption = {
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

        vsOption = option ? option : defaultOption;

        //未配置项填入默认配置
        for (let defaultKey in defaultOption) {
            if (!vsOption.hasOwnProperty(defaultKey)) {
                vsOption[defaultKey] = defaultOption[defaultKey];
            }
        }

        //载入模版
        document.getElementById(vsOption.element).innerHTML = template.body;
        vsthis = this;
        bars;
        m = new Audio();
        volume;
        barNow = document.getElementById(vsOption.element + "-barNow");
        time = document.getElementById(vsOption.element + "-time");
        play = document.getElementById(vsOption.element + "-play");
        pause = document.getElementById(vsOption.element + "-pause");
        bar = document.getElementById(vsOption.element + "-bar");
        barLoading = document.getElementById(vsOption.element + "-barLoading");
        cover = document.getElementById(vsOption.element + "-cover");
        coverBox = document.getElementById(vsOption.element + "-cover-box");
        coverImg = document.getElementById(vsOption.element + "-cover-img");
        coverTitle = document.getElementById(vsOption.element + "-title");
        coverSinger = document.getElementById(vsOption.element + "-singer");
        coverUl = document.getElementById(vsOption.element + "-ul");
        coverVolume = document.getElementById(vsOption.element + "-volume");
        coverVolumeLine = document.getElementById(vsOption.element + "-volume-line");
        coverMenuIcon = document.getElementById(vsOption.element + "-menu-icon");
        coverVolumeIcon = document.getElementById(vsOption.element + "-volume-icon");
        coverRandomIcon = document.getElementById(vsOption.element + "-random-icon");
        coverList;

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
                    playFirst = true;
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

        cover.onmousemove = function() {
            play.classList.remove('vsPlayAudio-play-none');
            pause.classList.remove('vsPlayAudio-play-none');
            document.getElementById("vsPlayAudio-msk-play").style.opacity = .2;
            document.getElementById("vsPlayAudio-control").classList.add("vsPlayAudio-control-show");
            clearTimeout(vsthis.leaveOut)
            vsthis.leaveOut = false

        };
        cover.onmouseleave = function() {
            vsthis.leaveOut = setTimeout(function() {
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

    init(musicVal = vsthis.music[0]) {
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

    inHtml(musicVal = vsthis.music[0]) {

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

    play() {
        playFirst = false;
        vsthis.onchangeVolume("play");
        play.style.display = 'none';
        pause.style.display = 'block';
        coverBox.style.animationPlayState = "running";
        vsthis.barStart();
    }

    pause() {
        vsthis.onchangeVolume();
        play.style.display = 'block';
        pause.style.display = 'none';
        coverBox.style.animationPlayState = "paused";
        vsthis.barStop();
    }

    next() {
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
        if (!playFirst || vsthis.autoPlay) {
            vsthis.play();
        }
    }

    clickAudio() {
        vsthis.init(vsthis.music[this.getAttribute("index")]);
        vsthis.play();
    }

    barStart() {
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

    barStop() {
        clearInterval(bar);
        bars = false;
    }

    clickBar() {
        let e = event || window.event;
        m.currentTime = m.duration * ((e.clientX - Tool.leftDistance(this)) / this.clientWidth);
        vsthis.play();
    }

    clickVolume() {
        let e = event || window.event;
        m.volume = ((e.clientX - Tool.leftDistance(this)) / this.clientWidth);
        //console.log(((e.clientX - Tool.leftDistance(this)) / this.clientWidth));
        coverVolumeLine.style.width = Tool.percentFormat(m.volume)
        //vsthis.play();
    }

    clickMenu() {
        if (coverUl.style.height == "206px") {
            coverUl.style.height = "0";
        } else {
            coverUl.style.height = "206px";
        }
    }

    clickVolumeIcon() {
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

    clickRandomIcon() {
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

    onchangeVolume(option) {
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
}

module.exports = vsPlayAudio;