const express = require("express");
const app = express.Router();
const multer = require("multer");
const chalk = require("chalk");
const stream = require("stream");
const upload = multer();
const { google } = require("googleapis");

function log() {
  console.log(
    chalk.bgCyanBright.bold(" [Router] Upload Successfully Booted ")
  );
}

setTimeout(log, 1000);

//   const KEYFILEPATH = 'service.json'
//   const SCOPES = ['https://www.googleapis.com/auth/drive'];

//   const auth = new google.auth.GoogleAuth({
//     keyFile: KEYFILEPATH,
//     scopes: SCOPES,
//   });

// const drive = google.drive({ version: 'v3', auth })

// app.get('/file/:fileName', async (req, res, next) => {
//   const { fileName } = req.params;

//   try {
//     const response = await drive.files.list({
//       q: `name = '${fileName}'`,
//       pageSize: 1,
//       fields: 'files(id)',
//     });

//     const files = response.data.files;
//     if (files.length === 0) {
//       res.status(404).send('File not found');
//       return;
//     }

//     const fileId = files[0].id;

//     const fileResponse = await drive.files.get({
//       fileId,
//       alt: 'media',
//     }, { responseType: 'stream' });

//     const mimeType = fileResponse.headers['content-type'];
//     res.setHeader('Content-Type', mimeType);

//     fileResponse.data
//       .on('end', () => res.end())
//       .on('error', (err) => {
//         console.error('Error fetching file from Google Drive:', err);
//         res.status(500).send('Internal Server Error');
//       })
//       .pipe(res);
//   } catch (error) {
//     console.error('Error fetching file from Google Drive:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// const uploadFile = async (fileObject, res, body) => {
//   const bufferStream = new stream.PassThrough();
//   bufferStream.end(fileObject.buffer);
//   const Filename = `${fileObject.originalname}`;

//   const fileSize = fileObject.buffer.length;

//   const media = {
//     mimeType: fileObject.mimeType,
//     body: bufferStream,
//   };

//   const fileMetadata = {
//     name: Filename,
//     parents: [`${body.id}`],
//   };

//   const upload = drive.files.create(
//     {
//       resource: fileMetadata,
//       media: media,
//       fields: 'id,name',
//     }
//   );

//   return upload; // Return the upload promise.
// };

// app.post('/', upload.any(), async (req, res, next) => {
//   try {
//     const { files } = req;

//     // Create an array to store the upload promises.
//     const uploadPromises = [];

//     // Loop through the files and start uploading each file.
//     for (const file of files) {
//       const uploadPromise = uploadFile(file, res, req.body);
//       uploadPromises.push(uploadPromise);
//     }

//     // Wait for all uploads to complete.
//     await Promise.all(uploadPromises);

//     // Send a response after all files have been uploaded.
//     res.status(200)
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     res.status(500).send('Error uploading files');
//   }
// });

// app.post('/deletefile', async (req, res, next) => {
//   const fileID = req.body.id
//   try {
//      drive.files.delete({
//       fileId: fileID,
//     },
//     (err, res) => {
//       if (err) return console.error('The API returned an error:', err.message);
//     }
//   );
//   } catch (f) {
//     console.log(f.message);
//   }
// });

module.exports = app;
