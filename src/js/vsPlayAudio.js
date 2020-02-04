import audioFunction from "./audioFunction";
import init from "./init";
import config from "./config";
import template from "./template";
import tool from "./Tool";
import injector from "./injector";
import coverImgSrc from "../img/music.png";
import "../css/style.css";

class vsPlayAudio{
    constructor(option){
        init()

        //创建音频对象
        this.m = document.createElement("AUDIO")

        //载入配置
        this.vsOption = option ? option : config.defaultOption;

        //未配置项填入默认配置
        for (let defaultKey in config.defaultOption) {
            if (!this.vsOption.hasOwnProperty(defaultKey)) {
                this.vsOption[defaultKey] = config.defaultOption[defaultKey];
            }
        }

        //载入模版
        document.getElementById(this.vsOption.element).innerHTML = template.body;
        
        //获取DOM
        this.dom = config.dom(this.vsOption.element);
        document.getElementById(this.dom.coverImg).src = coverImgSrc;
        
        //依赖注入
        injector.register("vsOption", this.vsOption);
        injector.register("dom", this.dom);
        injector.register("m", this.m);
        injector.register("tool", tool);
        injector.register("template", template);

        //装载方法
        this.af = injector.resolve(audioFunction);

        //初始化
        this.init();

        this.play = this.af.play.bind(this.af);
        this.pause = this.af.pause.bind(this.af);
        this.next = this.af.next.bind(this.af);
        this.go = this.af.go.bind(this.af);
    }

    init(){
        this.af.init()//初始化
        this.bindEvent()//初始化绑定
    }

    bindEvent(){//绑定事件
        document.getElementById(this.dom.play).onclick = this.af.play.bind(this.af);//播放事件
        document.getElementById(this.dom.pause).onclick = this.af.pause.bind(this.af);//暂停事件
        document.getElementById(this.dom.bar).onclick = this.af.clickBar.bind(this.af);//进度条点击事件
        document.getElementById(this.dom.coverVolume).onclick = this.af.clickVolume.bind(this.af);//音量调节事件
        document.getElementById(this.dom.coverMenuIcon).onclick = this.af.clickMenu.bind(this.af);//下拉栏隐藏事件
        document.getElementById(this.dom.coverVolumeIcon).onclick = this.af.clickVolumeIcon.bind(this.af);//禁音事件
        document.getElementById(this.dom.coverRandomIcon).onclick = this.af.clickRandomIcon.bind(this.af);//随机播放事件
        document.getElementById(this.dom.cover).onmousemove = () => {//菜单栏显示事件
            document.getElementById(this.dom.play).classList.remove('vsPlayAudio-play-none');
            document.getElementById(this.dom.pause).classList.remove('vsPlayAudio-play-none');
            document.getElementById("vsPlayAudio-msk-play").style.opacity = .2;
            document.getElementById("vsPlayAudio-control").classList.add("vsPlayAudio-control-show");
            clearTimeout(this.leaveOut)
            this.leaveOut = false
        };
        document.getElementById(this.dom.cover).onmouseleave = () => {//菜单栏延迟隐藏事件
            this.leaveOut = setTimeout(() => {
                document.getElementById(this.dom.play).classList.add('vsPlayAudio-play-none');
                document.getElementById(this.dom.pause).classList.add('vsPlayAudio-play-none');
                document.getElementById("vsPlayAudio-msk-play").style.opacity = 0;
                document.getElementById("vsPlayAudio-control").classList.remove("vsPlayAudio-control-show");
            }, 1000);
        };
        //播放结束时的事件
        this.m.onended = () => {
            this.af.pause();
            this.af.next();
        }
        //准备就绪时的事件
        this.firstPlay = true;
        this.m.oncanplaythrough = () => {
            if (this.firstPlay) {
                if (this.vsOption.autoPlay) {
                    this.af.play();
                }
            }else{
                this.af.play();
            }
            this.firstPlay = false;
        }
        //意外终止时停止播放
        setInterval(() => {
            if (this.m.paused == true) {
                this.af.pause();
            }
        }, 1000)
    }
}


export default vsPlayAudio;