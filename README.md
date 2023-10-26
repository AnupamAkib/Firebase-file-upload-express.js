# Firebase File Upload Using Node.js and Express.js
A simple express/node project to upload and delete file to firebase storage by calling REST API<br/>
<b>Author: </b> <a href="http://facebook.com/anupam.akib">AnupamAkib</a>
<h2>Upload a File/Image:</h2>
  Request Type: POST <br/>
  API endpoint: https://akibs-cloud.onrender.com/upload <br/>
  Parameter Name: <b>filename</b> (from form body) <br/>
  Parameter Type: File <br/>
  Response Type: JSON <br/>
  Response Example: <br/>
  {<br/>
    &#8195;"message": "success",<br/>
    &#8195;"filename": "yourfilename.jpg_2023-10-26 15:17:54",<br/>
    &#8195;"fileSize": "151.08 KB",<br/>
    &#8195;"fileSize_in_bytes": 154710,<br/>
    &#8195;"type": "image/jpeg",<br/>
    &#8195;"time": "03:17 PM",<br/>
    &#8195;"date": "26 October, 2023",<br/>
    &#8195;"downloadURL": "downloadUrlFromWhereYouCanDownloadOrViewTheUploadedImageOrFile"<br/>
  }<br/>

  <h2>Delete a File/Image</h2>
    Request Type: POST <br/>
    API endpoint: https://akibs-cloud.onrender.com/delete <br/>
    Request Type: JSON <br/>
    Request Example: (Send raw JSON data containing name of the file that you want to delete. You will get the filename after uploading the file) <br/>
    {<br/>
      &#8195;"filename": "WIN_20230522_15_11_38_Pro.jpg_2023-10-26 15:17:54"<br/>
    }<br/>
    Response Type: JSON <br/>
    Response Example: <br/>
    {<br/>
        &#8195;"message": "success",<br/>
        &#8195;"filename": "WIN_20230522_15_11_38_Pro.jpg_2023-10-26 15:17:54"<br/>
    }<br/>
