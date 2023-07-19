import express from 'express'
import cors from 'cors'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import ip from 'ip'
import axios from 'axios'
export const uri = "mongodb+srv://Guest:ABCabc123@courses.jsmmhg7.mongodb.net/?retryWrites=true&w=majority";

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express()
app.use(
    cors({
        origin: 'exp://10.80.76.36:19000', 
        origin: 'http://192.168.1.5'
    })
);
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});



const collection = client.db('Course-creater').collection('courses');

app.get('/courses', async (req, res) => {
    try {
        const cursor = collection.find();
        const courses = await cursor.toArray();
        console.log('Retrieved items:', courses);
        res.send(courses)
      } catch (error) {
        console.error('Error retrieving items:', error);
        res.sendStatus(404)
      }
})

app.get('/filter/:course', async (req, res) => {
  const course = req.params.course
  try{
    const cursor = collection.find({category: course})
    const filteredCourses = await cursor.toArray()
    res.send(filteredCourses)
  } catch(error) {
    console.log("Something went wrong", error)
    res.sendStatus(404)
  }
})

app.get('/video-duration/:id', async (req, res) => {
  const id = req.params.id
  const apiKey = 'AIzaSyBcK1fUm0N_6YQ7KSa74ymqHi1hhNVQ5PY'
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=contentDetails`;
  try{
    const response = await axios.get(apiUrl);
    const videoData = response.data;
    const duration = videoData.items[0].contentDetails.duration;

    const durationString = duration
    const durationRegex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const durationValues = durationString.match(durationRegex);

    if (durationValues) {
      const hours = durationValues[1] ? durationValues[1].slice(0, -1) : '';
      const minutes = durationValues[2] ? durationValues[2].slice(0, -1) : '0';
      const seconds = durationValues[3] ? durationValues[3].slice(0, -1) : '0';

      let timestamp
      if (hours !== '') {
        timestamp = `${hours}:${minutes}:${seconds}`;
      } else {
        if(seconds < 10){
          timestamp = `${minutes}:${'0'+seconds}`;
        } else {
          timestamp = `${minutes}:${seconds}`;
        }
      }

      res.json({ timestamp });
    }
  } catch(err){
    res.sendStatus(404)
  }
})

app.get('/course/videos/:id', async (req, res) => {
  const id = req.params.id
  try{
    const cursor= collection.find({_id: new ObjectId(id)})
    const course = await cursor.toArray()
    const videos = course[0].videos
    res.status(200).send(videos)
  }catch(err){
    console.log(err)
  }
})

app.get('/videos/:id', async (req, res) => {
  const id = req.params.id
  console.log(id)
  try{
    const currentVideo = await collection.findOne({ 'videos._id': new ObjectId(id) });
    if(currentVideo){
      const nextVideo = await collection.findOneAndUpdate(
        { 'videos._id': { $gt: new ObjectId(id) } },
        { $set: { 'videos.$.locked': false } }, 
        { returnOriginal: false }
      );
    }
    const cursor = collection.find({_id : id})
    const videos= await cursor.toArray()
    res.status(200).send(videos)
  } catch(err){
    console.log("Error", err)
    res.sendStatus(404)
  }
})

app.post('/course', async (req, res) => {
  const category = req.body.category
  const title = req.body.title
  const description = req.body.description
  const content = req.body.content
  const author = req.body.author
  let videos = req.body.videos


  console.log(videos)

  for(let i = 0; i < videos.length; i++){
    let url = videos[i].video
    const urlParts = url.split('?');
      if (urlParts.length === 2) {
      const params = urlParts[1].split('&');
      for (const param of params) {
    const [key, value] = param.split('=');
    if (key === 'v') {
      const vParam = value;
      videos[i] = { ...videos[i], video: vParam };
      break;
    }
  }
}
    
  }
  videos[0].locked = false

    const newCourse = {
      category: category,
      title: title,
      content: content,
      description: description,
      author: author,
      image: req.body.image,
      videos: [videos]
    }
    const success = await collection.insertOne(newCourse)
      if (!success) {
        console.error('Error inserting course:', err);
        res.sendStatus(500);
        return;
      }
      res.status(201).send("Hooray!");
    });

export  {app}