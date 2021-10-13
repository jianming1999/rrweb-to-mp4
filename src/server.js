const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const fs = require('fs');
// const upload = multer({ dest: './upload/' });
const storageWebm = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/webm/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // file.fieldname + '-' + 
    cb(null, uniqueSuffix + '.webm')
  }
})
const storageMp4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/mp4/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // file.fieldname + '-' + 
    cb(null, uniqueSuffix + '.mp4')
  }
})

const createServer = function () {
	app.use(express.static('./public'));

	// app.use(multer({ dest: './dist' }).array('file'));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../replay.html'))
  })

  app.post('/uploadWebm', multer({ storage: storageWebm }).array('file'), function (req, res) {   
    console.log('[uploadWebm] file.path:', req.files[0].path.replace(/^public/, ''));
    res.json({
      code: '000000',
      data: req.files[0].path.replace(/^public/, ''),
      msg: 'success'
    });   
  });
  app.post('/uploadMp4', multer({ storage: storageMp4 }).array('file'), function (req, res) {  	
    console.log('[uploadMp4] file.path:', req.files[0].path.replace(/^public/, ''));
  	res.json({
  		code: '000000',
  		data: req.files[0].path.replace(/^public/, ''),
  		msg: 'success'
  	});	  
  });
  
  const server = app.listen(8888, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("启动本地服务 http://127.0.0.1:%s", port)
  })
}

module.exports = {
  createServer
}
