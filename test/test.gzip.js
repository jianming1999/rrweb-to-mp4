const zlib = require('zlib');

var b64Data   = 'H4sIAAAAAAAAAJ3UMQ7CMAwF0KugP2ewEzdpcxXUAbWAOiHUMqCqdyeVQAobfGXIYL8hP5ZXnEdkeNEk6vUgXTbLonC4zMjHFY/5Wm511ekdTsOCLKVp2rlIKOA2jTuBot/cr7BhobEwsbAloY8kDGyqoQ5H/oHsdwQ21cCmaspCz0L2jcYOgLHhNGw4TT1yVmBpuS9PZHWY35siqnxvimEvpE9FY4peQhfbhO0FDnuFqWAEAAA=';

// gzip 解压
zlib.unzip(Buffer.from(b64Data, 'base64'), (err, buffer) => {
   console.log(err, buffer.toString());

   // gzip 压缩
   zlib.gzip(buffer.toString(), (err, buffer) => {
      console.log(err, buffer.toString('base64'));
   })
})
