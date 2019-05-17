export default {
    defaultOption: {
        element: "vsPlayAudio",
        autoPlay: false,
        music: {
            //必需项,音乐配置
            type: 'cloud',
            //必需项,网易云方式指定填'cloud'
            source: ''
            //必需项,网易云音乐歌单id
            //登录网易云网页版,在网页地址中拿到
            // ... playlist?id=2778782119
        },
        random: false,
        baseUrl: 'http://120.79.36.48/'
    },
    dom: (element) => {
        return {
            barNow: element + "-barNow",
            time: element + "-time",
            play: element + "-play",
            pause: element + "-pause",
            bar: element + "-bar",
            barLoading: element + "-barLoading",
            cover: element + "-cover",
            coverBox: element + "-cover-box",
            coverImg: element + "-cover-img",
            coverTitle: element + "-title",
            coverSinger: element + "-singer",
            coverUl: element + "-ul",
            coverVolume: element + "-volume",
            coverVolumeLine: element + "-volume-line",
            coverMenuIcon: element + "-menu-icon",
            coverVolumeIcon: element + "-volume-icon",
            coverRandomIcon: element + "-random-icon",
            coverList: "." + element + "-list"
        }
    }
}