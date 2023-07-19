import 'react-native-gesture-handler';
import YoutubePlayer, {YouTubeIframeref} from "react-native-youtube-iframe";
import { useState, useCallback, useRef, useEffect, Button, onPress } from "react"
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const VideoPlayer = ({video, styles, course, setVideos}) => {
const videourl = video.video
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef();
  const navigation = useNavigation()


  const handleChange = async () => {
    const currentTime = await playerRef.current?.getCurrentTime();
    const videoDuration = await playerRef.current?.getDuration();
  
    setTime(currentTime);
    setDuration(videoDuration);
    const margin = 0.9 * videoDuration
  
    if (currentTime >= margin) {
        const vidId= video._id
      const response = await fetch('http://100.76.5.223:19001/videos/' + vidId)
      const newVids = await response.json()
      if(response.status === 200){
        setVideos(newVids)
      }
    }
  }
  const navigateback = async () => {
    const response = await fetch('http://100.76.5.223:19001/course/videos/' + course._id)
    const newvids = await response.json()
    setVideos(newvids)
    navigation.navigate('VideoList')
  }

  return(
    <View style={styles.bg}>
      <View style={styles.videoplayers}>
        <Text onPress={navigateback}>Back to videos</Text>
          
          <YoutubePlayer
      height={260}
      play={false}
      videoId={videourl}
      ref={playerRef}
      onChangeState={handleChange}
    />
    <Text>{video.title}</Text>
      </View></View>
  )
}