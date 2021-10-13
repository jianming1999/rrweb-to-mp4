// const ffmpeg = require('fluent-ffmpeg');
// const stream = require('stream');
const events = require('events');
var ProgressBar = require('progress');
// const CWebp = require('cwebp').CWebp;
const WebMWriterClass = require('../webm-writer');
const fs = require('fs');
const path = require('path');

var videoWriter = null;
var fd = null


class Page extends events.EventEmitter {
  constructor (props) {
    super()
    this.page = props.page;  // 浏览器tab页对象
    // this.readAble = null; // stream.Readable 对象实例
    // this.ffmpeg = ffmpeg(); // ffmpeg 对象实例
    this.isPlaying = false; // 是否正在回放
    this.iframe = null; // 承载回放页面内容的iframe
    this.imgIndex = 0; // 当前截图的下标
    this.events = props.events || [];
    this.progressBar = null;
    this.timeLength = 0; // 视频时长，单位 ms
  }
  async init () {
    // this.readAble = new stream.Readable({
    //   read (size) {}
    // })
    // this.ffmpeg = this.ffmpeg.input(this.readAble)
    this.page.exposeFunction('pageLoaded', (e) => {
      // replay 页面 onload
      this.page.evaluate((data) => {
        window.replay(data);
      }, this.events)
    })
    this.page.exposeFunction('replayStart', (e) => {
      this.startCut()
    })
    this.page.exposeFunction('replayEnd', (e) => {
      this.stopCut()
    })
    if (this.events.length > 2) {
      try {
        this.timeLength = this.events[this.events.length - 1].timestamp - this.events[0].timestamp
        console.log('视频总时长为：', this.timeLength, ' ms')
      } catch (error) {
        console.log('计算视频时长出错')
      }
      
    }
    await this.page.goto('http://127.0.0.1:8888')
  }
  async startCut () {
    this.startTime = Date.now()
    this.progressBar = new ProgressBar('开始转换 [:bar] :percent', { total: this.timeLength, width: 50, complete: '=' });
    this.iframe = await this.page.$('iframe')
    this.isPlaying = true;
    this.imgIndex = 0
    this.updateCanvas()
    this.emit('start')
  }
  stopCut () {
    console.log('[stopCut] this.isPlaying:', this.isPlaying);
    let self = this;
    if (this.isPlaying === false) {
      return;
    }
    this.isPlaying = false;
    // this.readAble.push(null)
    // this.ffmpeg
    // .videoCodec('mpeg4')
    // .videoBitrate('1000k')
    // .inputFPS(50)
    // .on('end', () => {
    //   console.log('\n视频转换成功')
    //   console.log('耗时：', Date.now() - this.startTime, 'ms')
    // })
    // .on('error', (e) => {
    //   console.log('error happend:' + e)
    // })
    // .save(`./res_${Date.now()}.mp4`)
    // debugger;
    
    this.emit('end');

    // videoWriter.complete().then((webMBlob) => {
    //   // fs.closeSync(fd);
    //   // debugger;
    //   // webMBlob.arrayBuffer().then(res => {
    //     fs.writeFileSync('./output/output.webm', webMBlob.buffer)
    //     self.emit('end')
    //   // })
      
    // });
  }
  updateCanvas () {
    // console.log('[updateCanvas] imgIndex:', this.imgIndex);
    let self = this;
    if (this.isPlaying === false) {
      return;
    }
    // console.log('[updateCanvas] imgIndex:', this.imgIndex, ', timeLength:', this.timeLength);
    if (this.imgIndex * 20 > this.timeLength) {
      this.stopCut();
      return;
    }
    self.imgIndex++
    this.progressBar.tick(20)
    this.iframe.screenshot({
      type: 'jpeg',
      encoding: 'binary',
    }).then(async (buffer) => {
      if (this.isPlaying === false) {
        return;
      }
      console.log('[screenshot] imgIndex:', self.imgIndex);
      /* // webp 
      const encoder = new CWebp(buffer);
      encoder.toBuffer(async (err, tmpBuffer) => {
        // console.log('err:', err);
        // console.log('webp base64:', buffer.toString('base64'));
        await self.page.evaluate((data) => {
          window.addFrame(data.frameData);
          window.chromePlayer.pause(data.imgIndex * 20);
        }, {imgIndex: self.imgIndex, frameData: 'data:image/webp;base64,' + tmpBuffer.toString('base64')});
        self.updateCanvas();
      });
      */
      fs.writeFileSync(path.resolve(__dirname, `../output/${this.imgIndex}.jpeg`), buffer);
      await self.page.evaluate((data) => {
        window.addFrame(data.frameData);
        window.chromePlayer.pause(data.imgIndex * 20);
      }, {imgIndex: self.imgIndex, frameData: 'data:image/jpeg;base64,' + buffer.toString('base64')});
      self.updateCanvas();

      // this.readAble.push(buffer)
      
      // setTimeout(() => {
      //   this.updateCanvas(this.imgIndex++)  
      // });
      
      // setTimeout(() => {
      //   this.updateCanvas(this.imgIndex++)  
      // }, 1000)
    })
  }
  /**
   * 视频转换成功后，关闭tab页
   */
  async close () {
    try {
      await this.page.close()
    } catch (error) {
      console.log('关闭页面失败---', error)
    }
    
  }
}

module.exports = Page;