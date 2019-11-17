# vsPlayAudio

美观的音乐播放器
music player

## 简介
1.暂时不支持手机端（未测试）  
2.W3C关于自动播放的政策 Chrome v66版本开始限制了单位时间内打开同一网页时自动播放的次数 超过次数时自动播放会报错 手动开始播放正常

## 演示地址

![](https://github.com/iocdacc/vsPlayAudio/blob/master/demo.PNG?raw=true)

http://demo.iocdacc.com/d/vsPlayAudio

## 使用方法
```html
<head>

<script src="./dist/vsPlayAudio.min.js"></script>

</head>
<body>

...

<div id="vsPlayAudio"></div>

...

<script>
    var player = new vsPlayAudio({
        element: "vsPlayAudio",
        autoPlay: false,//自动播放
        random: false,//随机播放
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
    });
</script>
</body> 
```
