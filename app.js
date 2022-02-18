const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')
const {create} = require('ipfs-http-client');
const ipfs = create("http://3.34.161.155:5001");
const busboy = require('connect-busboy')
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// ffmpeg.setFfmpegPath(ffmpegPath);
// const {Transcoder} = require('simple-hls')


const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

// serve streams file as static
app.use('/streams', express.static(path.join(__dirname, 'streams')))

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/test',(req,res)=>{
    res.render('test');
});


app.post('/upload',(req,res)=>{
    const start = new Date();

    const  file = req.files.file;
    const fileName = req.body.fileName;
    const filePath = 'files/'+fileName;
    
    file.mv(filePath, async (err)=>{
        if(err) {
            console.log('Error:failed to download the file');
            return res.status(500).send(err);
        }
        const start = new Date();
        const fileHash = await addFile(fileName,filePath);
        fs.unlink(filePath,(err)=>{
            if(err) console.log(err);
        })
        const end = new Date();
        console.log(end-start);
        res.render('upload',{fileName,fileHash});
    })

});

const addFile = async (fileName,filePath)=>{
    const file = fs.readFileSync(filePath);
    const fileAdded  = await ipfs.add({path:fileName, content:file});
    console.log(fileAdded)
    const fileHash = fileAdded.cid;

    return fileHash; 
}

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
})
