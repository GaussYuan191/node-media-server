
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);//这个可以使用当前目录


const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send('index.html');
});

app.get('/video/:filename', function (req, res) {
  res.contentType('mp4');
  // make sure you set the correct path to your video file storage
  var pathToMovie = 'public/' + req.params.filename;
  var proc = ffmpeg(pathToMovie)
    // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
    .outputOptions('-movflags','frag_keyframe+empty_moov')
    .noAudio()
    .videoCodec('copy')
    .format('mp4')
    // setup event handlers
    .on('end', function () {
      console.log('file has been converted succesfully');
    })
    .on('error', function (err) {
      console.log('an error happened: ' + err.message);
    })
    // save to stream
    .pipe(res, { end: true });
});

app.listen(4000);


