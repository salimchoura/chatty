/** Author: Salim Choura
*   Course: csc337
*   Description: This file is the server for our chatty website
*/

const express = require('express')
const mongoose = require('mongoose')

const port = 80;
const app = express()
app.use(express.static('public_html'))
app.use(express.json());

// Connecting to our DB database and collection and making the schema
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1:27017/chat';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

var Schema = mongoose.Schema;
var ChatMessageSchema = new Schema({
  time: Number,
  alias: String,
  message: String
});
var ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);



// upon getting this post request, the server saves a new object to our
// collection with the alias and message sent in the post request. The
// time field will be the length of the database.
app.post('/chats/post', (req, res) => {
  let data = req.body
  // getting all the documents to check the length of the collection
  // then making the new oject and saving it.
  let p = ChatMessage.find({}).exec();
  p.then((documents) => {
    let newMessage = new ChatMessage({ time: documents.length, alias: data['alias'], message: data['message'] })
    return newMessage.save()
  })
    .then(() => {
      console.log('message saved to the database');
    })
    .catch((error) => {
      console.error('Error saving message:', error);
    })
    .catch((error) =>
    {
      console.error('Error getting documents from DB:', error);
    });
})


// upon getting this get request, the server returns all objects in our
// collection sorted by time, to the user
app.get('/chats', (req, res) => {
  let p = ChatMessage.find({}).exec();
  p.then((documents) => { res.end(JSON.stringify(documents.sort((a,b) => a['time'] - b['time']))) })
    .catch((error) => {
      console.error('Error loading data:', error);
    });
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


