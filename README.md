# vsPlayAudio v0.1.0

小体积美观的音乐播放器
mini music player

## 简介
1.暂时只支持网易云音乐之后添加本地音频  
2.暂时不支持手机端（未测试）

## 演示地址

![](https://github.com/iocdacc/vsPlayAudio/blob/master/demo.PNG?raw=true)

http://blog.pzroot.com/vsPlayAudio/src/

## 使用方法
```
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
```
