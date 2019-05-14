import tool from "./tool";

class vsFunction {
    inHtml() {
        const template = `
                            <li class="vsPlayAudio-list" index={{index}}>
                                <span class="vsPlayAudio-name">{{name}}</span>
                                <span class="vsPlayAudio-author">{{author}}</span>
                            </li>
                        `;

        var html = "";
        var element;

        for (let index = 0; index < this.music.length; index++) {
            element = template;
            element = element.replace("{{name}}", this.music[index].name);
            element = element.replace("{{author}}", this.music[index].author);
            element = element.replace("{{index}}", index);
            this.music[index].index = index;
            html += element;
        }
        this.dom.coverUl.innerHTML = html;

        this.dom.coverList = this.dom.coverList(this.vsOption.element);

        // for (let index = 0; index < coverList.length; index++) {
        //     coverList[index].onclick = this.clickAudio;
        // }
    }
    
    init(musicVal = this.music[0]) {
        if (this.vsOption.music.type === 'cloud') {
            this.nowAudio = musicVal.index;
            tool.ajax({
                url: this.vsOption.baseUrl + 'music/url?id=' + musicVal.song_id,
                beforeSend: () => {
                    //console.log('正在努力的拉取歌曲 ...');
                },
                success: (data) => {
                    let url = JSON.parse(data).url;
                    if (url !== null) {
                        //console.log('歌曲拉取成功！');
                        this.audio = {
                            src: url
                        }
                        this.m.src = this.audio.src;
                        //this.inHtml(musicVal);

                        this.dom.coverImg.src = musicVal.cover;
                        this.dom.coverTitle.innerHTML = musicVal.name;
                        this.dom.coverSinger.innerHTML = musicVal.author;

                        if (document.querySelector(".vsPlayAudio-control-hover")) {
                            document.querySelector(".vsPlayAudio-control-hover").classList.remove("vsPlayAudio-control-hover")
                        }
                        this.dom.coverList[musicVal.index].classList.add("vsPlayAudio-control-hover");
                    } else {
                        //console.log('歌曲拉取失败！ 资源无效！');
                        // console.log(musicVal.name + ' 无版权，或VIP歌曲');
                        // if (this.music.length !== 1) {
                        //     this.next();
                        // }
                    }
                },
                fail: (status) => {
                    console.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }
    }

    next() {
        if (this.random == true) {
            this.init(this.music[Tool.randomNum(0,(this.music.length - +1))]);
        }else{
            if (this.music.length != 1) {
                if (this.music.length == this.nowAudio) {
                    this.init(this.music[0]);
                } else {
                    this.init(this.music[this.nowAudio + +1]);
                }
            }
        }
        this.play();
    }

    clickAudio() {
        this.init(this.music[this.getAttribute("index")]);
        this.play();
    }

    barStart() {
        let num;
        let buff;
        let _ = this;
        let m = this.dom;
        //更新进度条和时间
        this.bars = (this.paused == false) && this.bars ? this.bars : (setInterval(function() {
            if (m.readyState && m.buffered.end(0) > 0) {
                num = m.currentTime / m.duration;
                buff = m.buffered.end(0) / m.duration;
                _.dom.barNow.style.width = Number(num * 100).toFixed(2) + "%";
                _.dom.barLoading.style.width = Number(buff * 100).toFixed(2) + "%";
                m.time.innerHTML = tool.timeFormat(m.currentTime) + " / " + tool.timeFormat(m.duration);
            }
        }, 10));
    }

    barStop() {
        clearInterval(this.dom.bar);
        this.bars = false;
    }

    clickBar() {
        let e = event || window.event;
        this.m.currentTime = this.m.duration * ((e.clientX - Tool.leftDistance(this)) / this.clientWidth);
        this.play();
    }

    clickVolume() {
        let e = event || window.event;
        this.m.volume = ((e.clientX - Tool.leftDistance(this)) / this.clientWidth);
        //console.log(((e.clientX - Tool.leftDistance(this)) / this.clientWidth));
        coverVolumeLine.style.width = Tool.percentFormat(this.m.volume)
        //this.play();
    }

    clickMenu() {
        if (coverUl.style.height == "206px") {
            coverUl.style.height = "0";
        } else {
            coverUl.style.height = "206px";
        }
    }

    clickVolumeIcon() {
        if (this.m.volume > 0) {
            volume = this.m.volume
            this.m.volume = 0;
            coverVolumeIcon.classList.add("volume-off");
        } else {
            this.m.volume = volume ? volume : .8;
            coverVolumeIcon.classList.remove("volume-off");

        }
        coverVolumeLine.style.width = Tool.percentFormat(this.m.volume)
    }

    clickRandomIcon() {
        //coverRandomIcon

        if (this.random == true) {
            this.random = false;
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#fff");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#fff");
        }else{
            this.random = true;
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#03a9f4");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#03a9f4");
        }
    }

    onchangeVolume(option){
        var v = this.m.volume;
        if (option == "play") {
            this.m.play();
            this.m.autoplay = true;
            // this.m.volume = .8;
            // v = 0;
            // var t = setInterval(function() {
            //     v += 0.1;
            //     if (v <= 1) {
            //         this.m.volume = v;
            //     } else {
            //         clearInterval(t);
            //     }
            // }, 100);
        } else {
            this.m.pause();
            // var t = setInterval(function() {
            //     v -= 0.1;
            //     if (v > 0) {
            //         this.m.volume = v;
            //     } else {
            //         clearInterval(t);
            //         this.m.pause();
            //     }
            // }, 200);
        }
    }

    play(){
        this.onchangeVolume("play");
        this.dom.play.style.display = 'none';
        this.dom.pause.style.display = 'block';
        this.dom.coverBox.style.animationPlayState = "running";
        this.barStart();
    }

    pause(){
        this.onchangeVolume();
        this.dom.play.style.display = 'block';
        this.dom.pause.style.display = 'none';
        this.dom.coverBox.style.animationPlayState = "paused";
        this.barStop();
    }
}

export default vsFunction;