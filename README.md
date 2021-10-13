# rrweb-to-mp4
rrweb-to-mp4 是一个可以将 rrweb 录制的原始数据转换为mp4视频的项目。本项目是基于rrweb-to-video项目修改的，去掉了ffmpeg的依赖，改为mp4视频格式导出

## 背景
rrweb 录制的原始数据为 json 格式，json 里会保存页面中的一些静态资源，如图片、css等。  

当 rrweb 进行回放时，会加载这些静态资源。但是当项目不断的迭代后，这些静态资源的 hash 值早就变了，甚至已经被删除了，那么回访时就会有问题。  

所以最好的方式是将 json 转换成视频，做永久保存。

## 例子
命令行运行：node test/index.js


## 如何贡献
提交一个 Issue 或一个 Merge Request



