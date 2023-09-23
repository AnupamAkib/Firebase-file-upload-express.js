const express = require("express");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject, listAll } = require("firebase/storage");
const multer = require("multer");

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express();

app.use(bodyParser.json());

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAXk_ITvaLrZokmA4HmqhY2AWl66uy8Fk",
    authDomain: "file-upload-8e593.firebaseapp.com",
    projectId: "file-upload-8e593",
    storageBucket: "file-upload-8e593.appspot.com",
    messagingSenderId: "768587090942",
    appId: "1:768587090942:web:3e5562f19ad96a253a0eaf"
};
  
  // Initialize Firebase
initializeApp(firebaseConfig);


// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started");
})

const path = "files/";

/*
send data in form file type
example:
filename : IMG_25425545.jpg (images/jpeg)
*/
app.post("/upload", upload.single("filename"), async (req, res) => { //filename is 'filename'
    try {
        const dateTime = giveCurrentDateTime(); //to uniquely identify files, add timedate besides it
        
        let date = getDateToday();
        let time = getTimeNow();

        const filename = req.file.originalname + "_" + dateTime;
        const fileSizeInBytes = req.file.size;
        const fileSizeInKilobytes = fileSizeInBytes / 1024;
        const fileSizeInMegabytes = fileSizeInKilobytes / 1024;

        if(fileSizeInMegabytes > 10){ //control file size (Max 10 MB here)
            return res.status(400).send({
                message: 'failed',
                details : 'file size is too large - MAX 10 MB'
            });
        }

        let fileSize;

        if(fileSizeInMegabytes >= 1){
            fileSize = `${fileSizeInMegabytes.toFixed(2)} MB`;
        }
        else if(fileSizeInKilobytes >= 1){
            fileSize = `${fileSizeInKilobytes.toFixed(2)} KB`;
        }
        else{
            fileSize = `${fileSizeInBytes} Bytes`;
        }

        const storageRef = ref(storage, `${path}${filename}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        // Grab the public URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');

        return res.status(200).send({
            message: 'success',
            filename: filename,
            fileSize : fileSize,
            fileSize_in_bytes : fileSizeInBytes,
            type: req.file.mimetype,
            time: time,
            date : date,
            downloadURL: downloadURL
        });
    } catch (error) {
        return res.status(400).send({
            message : "failed",
            details : error.message
        });
    }
});


/*
send JSON data including filename to delete the file
example:
{
  "filename": "nid.jpg_2023-9-23 22:15:23"
}
*/
app.post("/delete", function(req, res) {
    try {
        const fileName = req.body.filename;
        const filepath = `${path+fileName}`;
        console.log(filepath);

        const desertRef = ref(storage, filepath);
        // Delete the file
        deleteObject(desertRef).then(() => {
            // File deleted successfully
            console.log("File deleted successfully.");
            return res.status(200).send({
                message: 'success',
                filename: fileName
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
            return res.status(404).send({
                message: 'failed',
                details : error.message
            });
        });
    } catch (error) {
        return res.status(400).send({
            message : "failed",
            details : error.message
        });
    }
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
};

const getDateToday = () =>{
    const timedate = giveCurrentDateTime();
    let date = timedate.split(' ')[0];
    let ar = date.split('-');
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let d = ar[2]+" "+months[parseInt(ar[1])-1]+", "+ar[0];
      return d;
}

const getTimeNow = () =>{
    const datetime = giveCurrentDateTime();
    let time = datetime.split(' ')[1];
    time = time.split(':');
    let h = parseInt(time[0]);
    let m = parseInt(time[1]);
    let ampm = "AM";
    if(h >= 12){
        ampm = "PM"
    }
    h %= 12;
    if(h==0) h+=12;
    if(h < 10){h = "0"+h}
    if(m < 10){m = "0"+m}
    return h+":"+m+" "+ampm;
}

