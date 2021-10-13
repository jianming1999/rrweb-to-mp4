const CWebp = require('cwebp').CWebp;
const encoder = new CWebp('./input.jpeg');
encoder.toBuffer((err, buffer) => {
  console.log('err:', err);
  console.log('buffer:', buffer);
});
