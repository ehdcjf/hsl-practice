const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')
const {create} = require('ipfs-http-client');
const ipfs = create("http://3.34.161.155:5001/수학강의");
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


app.get('/temp',(req,res)=>{
    res.redirect()
})


app.get('/hardcid',(req,res)=>{
    res.('https://ipfs.io/ipfs/QmUYcve9BYBThRVN5BipiyyAJK9vk2X2U551tqx3okne6F')
})


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

//// 첫번째

/*
app.post('/uploaddd',(req, res, next) => {
    const file = req.files.file; 
    const fileName = file.name;
    // const outputFilename = fileName.slice(0, fileName.length - 4);
    const outputFilename = 'test'


    const streamsPath = `/streams/${outputFilename}/${outputFilename}.m3u8`
    const outputDir = path.join(__dirname, `streams/${outputFilename}`)
    const outputFile = path.join(outputDir, `${outputFilename}.m3u8`)
 
     // check if outputDir exist
     if (fs.existsSync(outputDir)) {
       return res.send({ error: true, message: 'filename already exist, try changename to unique' })
     }
 
     // if not exist, create it
     fs.mkdirSync(outputDir, { recursive: true })
 
     const converOptions = [
       '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
       '-level 3.0', 
       '-codec: copy',
       '-s 640x360',          // 640px width, 360px height output video dimensions
       '-start_number 0',     // start the first .ts segment at index 0
       '-hls_time 10',        // 10 second segment duration
       '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
       '-f hls'               // HLS format
     ]
 
     const convert = ffmpeg(file, { timeout: 432000 })
     convert.format('hls')
     convert.output(outputFile)
 
     convert.on('start', (commandLine) => {
       console.log(`[${new Date()}] Convert of '${fileName}' started. Saved to ${outputFile}`)
     })
 
     convert.on('end', () => {
       console.log(`[${new Date()}] Convert '${fileName}' to ${outputFile} finished`)
       return res.send({ error: false, link: streamsPath })
     })
 
     // start convert
     convert.run();


  })




  app.post('/upload2',async(req,res)=>{

    const file = req.files.file; 
    const fileName = file.name;
    // const outputFilename = fileName.slice(0, fileName.length - 4);
    const outputFilename = 'test'



        
    
        const t = new Transcoder(file, `${__dirname}`+`${outputFilename}`, {showLogs: false});
        try {
            const hlsPath = await t.transcode();
            console.log('Successfully Transcoded Video');
        } catch(e){
            console.log('Something went wrong');
        }

  })

  */




const addFile = async (fileName,filePath)=>{
    const file = fs.readFileSync(filePath);
    const fileAdded  = await ipfs.add({path:fileName, content:file});
    console.log(fileAdded)
    const fileHash = fileAdded.cid;

    return fileHash; 
}

// const catFile = async() => {
//     const cid = "CID(QmaVuA55hJ9VihmX7kHpD7yhEv9QahfbPm3eDjb4EhYDUi)";
//     ipfs.get(cid, function (err, files) {
//         files.forEach((file) => {
//           console.log(file.path)
//           console.log(file.content.toString('utf8'))
//         })
//       })
// }

// catFile();

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
})
