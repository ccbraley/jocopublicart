const express = require('express')
const path = require('path');
const app = express()
const cors = require('cors')
app.use(cors({credentials: true, origin: true}))
const mysql = require('mysql')
const port = process.env.PORT || 7000

app.get('/',function(request,response) {
  response.sendFile(path.join(__dirname+'/galleryAll.html'))
});
app.get('/galleryOne',function(request,response) {
  response.sendFile(path.join(__dirname+'/galleryOne.html'))
});
app.get('/recognition',function(request,response) {
  response.sendFile(path.join(__dirname+'/recognition.html'))
});

app.get('/map',function(request,response) {
  response.sendFile(path.join(__dirname+'/index.html'))
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/getAll', (request, response) => {

  //Set up SQL query.
  let queryText = 
    "SELECT `ArtPiece`.pieceID, `ArtPiece`.title, `ArtPiece`.info, `ArtPiece`.locationID, `Image`.*, `Artist`.artistID, `Artist`.firstName, `Artist`.lastName, `Address`.*, `Location`.locationID, `Location`.name, `Location`.addressID " +
    "FROM `ArtPiece`" +
    "LEFT JOIN Image ON Image.pieceID = ArtPiece.pieceID " +
    "LEFT JOIN Artist ON Image.artistID = Artist.artistID " +
    "LEFT JOIN Location ON Location.locationID = ArtPiece.locationID " +
    "LEFT JOIN Address ON Address.addressID = Location.addressID "
    "ORDER BY ArtPiece.pieceID DESC"


  //Set up connection to remote mySQL database
  const con = mysql.createConnection({
    host: "31.220.105.59",
    user: "carsenra_admin",
    password: "mycoolpassword",
    database: "carsenra_jocoarts"
  });

  //Query the databse with the query we built above, and return the results to the requester
  con.query(
    queryText,
    function(err, results, fields) {
      console.log(err)
      response.send(results)
      con.end()
    }
  );
  
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})