export default {
    defaultOption: {
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
        random: false,
        baseUrl: 'http://120.79.36.48/'
    },
    dom: (element) => {
        return {
            barNow: document.getElementById(element + "-barNow"),
            time: document.getElementById(element + "-time"),
            play: document.getElementById(element + "-play"),
            pause: document.getElementById(element + "-pause"),
            bar: document.getElementById(element + "-bar"),
            barLoading: document.getElementById(element + "-barLoading"),
            cover: document.getElementById(element + "-cover"),
            coverBox: document.getElementById(element + "-cover-box"),
            coverImg: document.getElementById(element + "-cover-img"),
            coverTitle: document.getElementById(element + "-title"),
            coverSinger: document.getElementById(element + "-singer"),
            coverUl: document.getElementById(element + "-ul"),
            coverVolume: document.getElementById(element + "-volume"),
            coverVolumeLine: document.getElementById(element + "-volume-line"),
            coverMenuIcon: document.getElementById(element + "-menu-icon"),
            coverVolumeIcon: document.getElementById(element + "-volume-icon"),
            coverRandomIcon: document.getElementById(element + "-random-icon"),
            coverList: (element) => {
                return document.querySelectorAll("." + element + "-list")
            },
        }
    }
}