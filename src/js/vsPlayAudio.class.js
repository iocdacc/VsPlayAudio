import vsFunction from "./vsfunction.class";
import tool from "./tool";
import config from "./config";
import template from "./template";
import init from "./init";
import "../css/style.css";

class vsPlayAudio extends vsFunction{
    constructor(option){
        init();
        let _ = super();

        let m = _.m = new Audio();

        //载入配置
        let vsOption = _.vsOption = option ? option : config.defaultOption;

        //未配置项填入默认配置
        for (let defaultKey in config.defaultOption) {
            if (!vsOption.hasOwnProperty(defaultKey)) {
                vsOption[defaultKey] = config.defaultOption[defaultKey];
            }
        }

        //载入模版
        document.getElementById(vsOption.element).innerHTML = template.body;

        //获取DOM
        let dom = _.dom = config.dom(vsOption.element);

        //初始化按钮
        if (vsOption.random == false) {
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#fff");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#fff");
        }else{
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#03a9f4");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#03a9f4");
        }

        //初始化歌曲
        if (vsOption.music.type === 'cloud') {
            tool.ajax({
                url: vsOption.baseUrl + 'playlist/detail?id=' + vsOption.music.source,
                beforeSend: () => {
                    //console.log('正在努力的拉取歌曲 ...');
                },
                success: (data) => {
                    //console.log('歌曲拉取成功！');
                    _.nowAudio = 0;//设置从第一首歌播放
                    _.music = JSON.parse(data);//装载歌曲
                    _.inHtml();//填写歌曲信息
                    _.init();//开始播放
                    // playFirst = true;
                    // if (vsOption.random) {
                    //     _.init(_.music[Tool.randomNum(0,(_.music.length - +1))]);
                    // }else{
                    //     _.init();
                    // }
                    
                    //_.m.volume = .8;
                    //dom.coverVolumeLine.style.width = Tool.percentFormat(m.volume);
                },
                fail: (status) => {
                    console.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }


        //事件
        let leaveOut;
        dom.cover.onmousemove = function() {
            dom.play.classList.remove('vsPlayAudio-play-none');
            dom.pause.classList.remove('vsPlayAudio-play-none');
            document.getElementById("vsPlayAudio-msk-play").style.opacity = .2;
            document.getElementById("vsPlayAudio-control").classList.add("vsPlayAudio-control-show");
            clearTimeout(leaveOut)
            leaveOut = false

        };
        dom.cover.onmouseleave = function() {
            leaveOut = setTimeout(function() {
                dom.play.classList.add('vsPlayAudio-play-none');
                dom.pause.classList.add('vsPlayAudio-play-none');
                document.getElementById("vsPlayAudio-msk-play").style.opacity = 0;
                document.getElementById("vsPlayAudio-control").classList.remove("vsPlayAudio-control-show");
            }, 1000);
        };
        dom.play.onclick = _.play;
        dom.pause.onclick = _.pause;
        dom.bar.onclick = _.clickBar;

        dom.coverVolume.onclick = _.clickVolume;
        dom.coverMenuIcon.onclick = _.clickMenu;
        dom.coverVolumeIcon.onclick = _.clickVolumeIcon;
        dom.coverRandomIcon.onclick = _.clickRandomIcon;

        //播放结束时的事件
        m.onended = function() {
            _.pause();
            _.next();
        }

        //准备就绪时的事件
        m.oncanplaythrough = function() {
            //barNow.innerHTML = Tool.timeFormat(0) + " / " + Tool.timeFormat(m.duration);
            if (vsOption.autoPlay) {
                _.play();
            }
        }

        //意外终止时停止播放
        setInterval(function() {
            if (m.paused == true) {
                _.pause();
            }
        }, 1000)
    }
}

module.exports = vsPlayAudio;