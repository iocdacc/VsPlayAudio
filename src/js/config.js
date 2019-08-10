export default {
    defaultOption: {
        element: "vsPlayAudio",
        autoPlay: false,
        random: false,
        music: {
            //必需项,音乐配置
            type: 'manual',
            //必需项,网易云方式指定填'cloud',手动指定方式'manual'
            source: './source.json'
            //必需项,网易云音乐歌单id
            //登录网易云网页版,在网页地址中拿到
            // ... playlist?id=2778782119
            //当使用手动指定时,此为文件信息的JSON,当文件非同源注意对方是否开启跨域
            //JSON结构请看demo/source.json文件
        },
        //解析服务器 https://musicapi.leanapp.cn/  http://120.79.36.48/
        //需要自己搭建 提供的两个都是私人的 随时可能停用
        //有条件可以自己搭建解析服务器 软件包：https://binaryify.github.io/NeteaseCloudMusicApi/#/
        //或使用手动指定的方式
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