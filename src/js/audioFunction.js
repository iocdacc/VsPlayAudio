class audioFunction{
    constructor(){
        audioFunction.prototype.injector = ['tool','vsOption','dom','template','m'];
    }

    init(){
        this.initAudioList();
        this.initBtn();
    }

    initBtn(){
        if (this.vsOption.random == false) {
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#fff");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#fff");
        }else{
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#03a9f4");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#03a9f4");
        }
    }

    initAudioList(){//初始化音频列表
        let ajaxUrl
        if (!this.vsOption.music.source) throw new Error('配置缺失');
        if (this.vsOption.music.type === 'cloud') {//网易云方式
            ajaxUrl = this.vsOption.baseUrl + 'playlist/detail?id=' + this.vsOption.music.source
        }else if(this.vsOption.music.type === 'manual'){//手动指定音频方式
            ajaxUrl = this.vsOption.music.source
        }
        this.tool.ajax({
            url: ajaxUrl,
            beforeSend: () => {
                //console.log('正在努力的拉取歌曲 ...');
            },
            success: (data) => {
                let musicVal = JSON.parse(data)

                if (musicVal.code) {
                    this.musicVal = musicVal.playlist.tracks
                }else{
                    this.musicVal = musicVal
                }

                this.music = (this.vsOption.random == true) ? this.musicVal[this.tool.randomNum(0,(this.musicVal.length - +1))] : this.musicVal[0]//放入第一首歌
                this.inHtml()//渲染列表
                this.initAudio()//装载音频
            },
            fail: (status) => {
                console.error('歌曲拉取失败！ 错误码：' + status)
            }
        });
        this.m.volume = .5
        document.getElementById(this.dom.coverVolumeLine).style.width = "50%"
    }

    initAudio() {//初始化音频
        if (this.vsOption.music.type === 'cloud') {//网易云方式
            this.tool.ajax({
                url: this.vsOption.baseUrl + 'music/url?id=' + (this.music.song_id || this.music.id),
                beforeSend: () => {
                    //console.log('正在努力的拉取歌曲 ...');
                },
                success: (data) => {
                    let url
                    let urlData = JSON.parse(data);

                    if (urlData.code) {
                        url = urlData.data[0].url
                    }else{
                        url = urlData.url
                    }

                    if (url != null) {
                        this.m.src = url;//将当前音频地址载入
                        document.getElementById(this.dom.coverImg).src = this.music.cover || this.music.al.picUrl;//更新音乐封面
                        document.getElementById(this.dom.coverTitle).innerHTML = this.music.name;//更新音乐名称
                        document.getElementById(this.dom.coverSinger).innerHTML = this.music.author || this.music.ar[0].name;//更新歌手名称
                        if (document.querySelectorAll(".vsPlayAudio-control-hover").length > 0) {
                            document.querySelectorAll(".vsPlayAudio-control-hover")[0].classList.remove("vsPlayAudio-control-hover");
                        }
                        document.querySelectorAll(this.dom.coverList)[this.music.html_index].classList.add("vsPlayAudio-control-hover");
                    } else {
                        //console.log('歌曲拉取失败！ 资源无效！');
                        console.log(this.music.name + ' 无版权，或VIP歌曲');
                        if (this.musicVal.length !== 1) {
                            this.next();
                        }
                    }
                },
                fail: (status) => {
                    console.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }else if(this.vsOption.music.type === 'manual'){//手动指定音频方式
            if (this.music.url != undefined) {
                this.m.src = this.music.url;//将当前音频地址载入
                document.getElementById(this.dom.coverImg).src = this.music.cover;//更新音乐封面
                document.getElementById(this.dom.coverTitle).innerHTML = this.music.name;//更新音乐名称
                document.getElementById(this.dom.coverSinger).innerHTML = this.music.author;//更新歌手名称
                if (document.querySelectorAll(".vsPlayAudio-control-hover").length > 0) {
                    document.querySelectorAll(".vsPlayAudio-control-hover")[0].classList.remove("vsPlayAudio-control-hover");
                }
                document.querySelectorAll(this.dom.coverList)[this.music.html_index].classList.add("vsPlayAudio-control-hover");
            } else {
                //console.log('歌曲拉取失败！ 资源无效！');
                console.log(this.music.name + ' 未设置文件地址');
                if (this.musicVal.length !== 1) {
                    this.next();
                }
            }
        }
    }

    inHtml() {
        var html = ""
        var element
        for (let index = 0; index < this.musicVal.length; index++) {
            element = this.template.list;
            element = element.replace("{{name}}", this.musicVal[index].name);
            element = element.replace("{{author}}", this.musicVal[index].author);
            element = element.replace("{{html_index}}", index);
            this.musicVal[index].html_index = index;
            html += element;
        }

        document.getElementById(this.dom.coverUl).innerHTML = html;

        let coverList = document.querySelectorAll(this.dom.coverList);
        for (let index = 0; index < coverList.length; index++) {
            coverList[index].onclick = this.clickAudio.bind({'_':this,index,'html_index':coverList[index]});
        }
    }

    clickAudio() {
        let _ = this._?this._:this;
        _.music = _.musicVal[this.index]
        if (document.querySelectorAll(".vsPlayAudio-control-hover").length > 0) {
            document.querySelectorAll(".vsPlayAudio-control-hover")[0].classList.remove("vsPlayAudio-control-hover");
        }
        this.html_index.classList.add("vsPlayAudio-control-hover");
        _.initAudio();
    }

    play() {
        this.m.play();
        this.barStart();
        document.getElementById(this.dom.play).style.display = 'none';
        document.getElementById(this.dom.pause).style.display = 'block';
        document.getElementById(this.dom.coverBox).style.animationPlayState = "running";
    }

    pause() {
        this.m.pause();
        this.barStop();
        document.getElementById(this.dom.play).style.display = 'block';
        document.getElementById(this.dom.pause).style.display = 'none';
        document.getElementById(this.dom.coverBox).style.animationPlayState = "paused";
    }

    next() {
        if (this.vsOption.random == true) {
            this.music = this.musicVal[this.tool.randomNum(0,(this.musicVal.length - +1))]
            this.initAudio();
        }else{
            if (this.musicVal.length == this.music.html_index) {
                this.music = this.musicVal[0];
                this.initAudio();
            } else {
                this.music = this.musicVal[this.music.html_index + +1];
                this.initAudio();
            }
        }
    }

    go(index) {
        this.music = index?this.musicVal[index - +1]:this.musicVal[0];
        this.initAudio();
    }

    time() {
        document.getElementById(this.dom.time).innerHTML = this.tool.timeFormat(this.m.currentTime) + " / " + this.tool.timeFormat(this.m.duration)
    }

    barStart() {
        let num
        let buff
        //更新进度条和时间
        this.bars = this.bars ? this.bars : (setInterval(() => {
            if (this.m.readyState && this.m.buffered.end(0) > 0) {
                this.time()
                num = this.m.currentTime / this.m.duration

                for (let index = 0; index < this.m.buffered.length; index++) {
                    if (this.m.buffered.start(index) < this.m.currentTime && this.m.currentTime < this.m.buffered.end(index)) {
                        buff = this.m.buffered.end(index) / this.m.duration
                    }
                }

                document.getElementById(this.dom.barNow).style.width = Number(num * 100).toFixed(2) + "%"
                document.getElementById(this.dom.barLoading).style.width = Number(buff * 100).toFixed(2) + "%"
            }
        }, 10))
    }

    barStop() {
        clearInterval(this.bars);
        this.bars = false;
    }

    clickBar() {
        let e = event || window.event;
        let bar = document.getElementById(this.dom.bar);
        this.m.currentTime = this.m.duration * ((e.clientX - this.tool.leftDistance(bar)) / bar.clientWidth);
        this.play();
    }

    clickVolume() {
        let e = event || window.event;
        let coverVolumeLine = document.getElementById(this.dom.coverVolumeLine);
        let coverVolumeIcon = document.getElementById(this.dom.coverVolumeIcon);
        let coverVolume = document.getElementById(this.dom.coverVolume);
        this.m.volume = ((e.clientX - this.tool.leftDistance(coverVolume)) / coverVolume.clientWidth);
        //console.log(((e.clientX - Tool.leftDistance(this)) / this.clientWidth));
        coverVolumeLine.style.width = this.tool.percentFormat(this.m.volume)
        coverVolumeIcon.classList.remove("volume-off");
        //vsthis.play();
    }

    clickMenu() {
        let coverUl = document.getElementById(this.dom.coverUl);
        if (coverUl.style.height == "206px") {
            coverUl.style.height = "0";
        } else {
            coverUl.style.height = "206px";
        }
    }

    clickVolumeIcon() {
        let coverVolumeIcon = document.getElementById(this.dom.coverVolumeIcon);
        let coverVolumeLine = document.getElementById(this.dom.coverVolumeLine);
        if (this.m.volume > 0) {
            this.volume = this.m.volume;
            this.m.volume = 0;
            coverVolumeIcon.classList.add("volume-off");
        } else {
            this.m.volume = this.volume ? this.volume : .5;
            coverVolumeIcon.classList.remove("volume-off");

        }
        coverVolumeLine.style.width = this.tool.percentFormat(this.m.volume)
    }

    clickRandomIcon() {
        if (this.vsOption.random == true) {
            this.vsOption.random = false;
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#fff");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#fff");
        }else{
            this.vsOption.random = true;
            document.querySelectorAll(".random-path")[0].setAttribute("fill", "#03a9f4");
            document.querySelectorAll(".random-path")[1].setAttribute("fill", "#03a9f4");
        }
    }
}


export default audioFunction;