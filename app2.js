const express = require('express');
const app = express();
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller =  require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const hls = require('hls-server'); 

app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.render('kill');
});



const PORT = 3002;
const server = app.listen(PORT,()=>{
    console.log(`server start port ${PORT}`)
});

new hls(server, {
    provider:{
        exists:(req,cb) => {
            const ext = req.url.split('.').pop();

            if(ext !== 'm3u8' && ext !== 'ts'){
                return cb(null,true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK,function(err){
                if(err){
                    console.log('File not exist');
                    return cb(null,false);
                }
                cb(null,true);
            });
        },
        getManifestStream: (req,cb)=>{
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null,stream);
        },
        getSegmentStream: (req,cb) =>{
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null,stream);
        }
    }
})



/* 
//
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

//
ffmpeg(`files/test.mp4`,{timeout:432000}).addOptions([
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 10',
    '-hls_list_size 0',
    '-f hls'
]).output('files/test.m3u8').on('end',()=>{
    console.log('end');
}).run();

//3. 끝났으면, files안에 m3u8이랑,.ts파일 생성된거 확인하고 주석처리 
// 따라 함수만들어서 라우팅해도됨. 
//4. kill.ejs로 이동
*/

