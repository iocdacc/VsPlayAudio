# vsPlayAudio

美观的音乐播放器
music player

## 简介
1.暂时不支持手机端（未测试）  
2.W3C关于自动播放的政策 Chrome v66版本开始限制了单位时间内打开同一网页时自动播放的次数 超过次数时自动播放会报错 手动开始播放正常

## 演示地址

![](https://github.com/iocdacc/vsPlayAudio/blob/master/demo.PNG?raw=true)

http://demo.iocdacc.com/vsPlayAudio

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
new vsPlayAudio({
    element: "vsPlayAudio",
    autoPlay: false,//自动播放
    music: {
        //必需项,音乐配置
        type: 'cloud',
        //必需项,网易云方式指定填'cloud'
        source: 2778782119
        //必需项,网易云音乐歌单id
        //登录网易云网页版,在网页地址中拿到
        // ... playlist?id=317921676
    },
    random: false//随机播放
});
</script>
</body> 
```
