import 'react-native-gesture-handler';
import { View, Text, FlatList, ScrollView, Image, Pressable, Button } from "react-native"
import {styles} from './App.js'
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, useCallback, useRef } from "react"
import {createNativeStackNavigator, tabBarIcon} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CourseDetails } from './CourseDetails.js';
import { VideoPlayer } from './VideoPlayer.js';
import lockedic from './assets/icons8-lock-30.png'
import unlockedic from './assets/icons8-unlock-50.png'
import tick from './assets/icons8-tick-16.png'

const Tab = createMaterialTopTabNavigator()

const Course = ({videos, title, image, author, course, pressHandle}) => {

        const amount = videos?.length

    return(
         <View style={styles.course}>
        <Image source={{uri:image}} style={styles.photo}></Image>
        <View style={styles.phototext}>
        <Text style={styles.coursetext}>{title}</Text>
        <View style={styles.lists}>
        <Text style={styles.class}>{amount} CLASSES</Text>
        <Text>{author}</Text>
        </View>
        <View style={styles.btn}>
        <Button color='#2F2F2F' title="Take class" onPress={() => pressHandle(course)}></Button>
       </View> 
       </View>
    </View>
    )
   
}

export const Video = ({video, setVideo, styles}) => {
    const navigation = useNavigation()
    const[selected, setSelected] = useState(false)
    const content = video.content
    const [timestamp, setTimestamp] = useState('');

    const handlePress = () => {
            if(video.locked === true){
                console.log("Watch another video first")
            } else{
    
                    setVideo(video)
        console.log(video)
        navigation.navigate('VideoPlayer')
            }
    }

    useEffect(() => {
        const fetchDuration = async () => {
          try {
            const response = await fetch('http://100.76.5.223:19001/video-duration/' + video.video);
            const timestamp = await response.json();
            setTimestamp(timestamp.timestamp);
            console.log(timestamp)
          } catch (err) {
            console.log(err);
          }
        };
    
        fetchDuration();
      }, [video.video]);

    return(
        <View style={video.locked ? styles.videoslock : styles.videos}>
            <View style={styles.videoobj}>
            <Pressable onLongPress={handlePress} onPress={() => setSelected(!selected)}>
            <Text style={styles.videotext}>{video.title}</Text>
            </Pressable>
            <Text style={styles.videotexttime}>{timestamp}</Text>
            <Image style={styles.lockedicons} source={video.locked ? lockedic : unlockedic}></Image>
            </View>
            {selected && <Text>This video shows: </Text>}
            {selected && content.map((content, index) => <Text key={index}><Image style={styles.tabBarIcon} source={tick}></Image>  {content}</Text>)}
       </View>
    )
}

const VideoList = ({ videos, setVideo,course, setVideos, styles }) => {
    return (
      <ScrollView style={styles.videolist}>
        <Text style={styles.videolisttext}>{videos?.length} Videos</Text>
        {videos.map((video, index) => (
          <Video key={index} video={video} cours={course} setVideos={setVideos} styles={styles} setVideo={setVideo} />
        ))}
      </ScrollView>
    );
  };

const CourseVideos = ({course, styles, setVideo, video}) => {
    const [videos, setVideos] = useState(course.videos)
    const Stack = createStackNavigator()
    return(
        <Stack.Navigator>
      <Stack.Screen
        name="VideoList"
        options={{ headerShown: false }}
      >
        {() => <VideoList videos={videos} course={course} setVideos={setVideos} styles={styles} setVideo={setVideo} />}
      </Stack.Screen>
      <Stack.Screen
        name="VideoPlayer"
        options={{ headerShown: false }}>
            {(props) =>(
                <VideoPlayer
                {...props}
                styles={styles}
                video={video}
                course={course}
                setVideos={setVideos}
                />
            )}
        </Stack.Screen>
    </Stack.Navigator>
    )
}

export const CoursePage = ({course, styles})  => {
    const [video, setVideo] = useState({})

    return(
        <NavigationContainer independent={true}>
        <Tab.Navigator tabBar={() => null}>
                <Tab.Screen name="Course details" >
        {(props) => (
            <CourseDetails
            {...props}
            course={course}
            styles={styles}
            />
        )}
        </Tab.Screen>   
                <Tab.Screen name="Course Modules">
        {(props) => (
            <CourseVideos
            {...props}
            course={course}
            styles={styles}
            setVideo={setVideo}
            video={video}
            />
        )}
        </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    )
}


export const Courses = ({courses, styles, setCourse, coursefilter, setFilter, setfilteron, filteron}) => {

 const navigation = useNavigation();
    const [filteredCourse, setFilterCourse] = useState([])
    useEffect(()=> {

        const getFilterCourse = async () => {
            const response = await fetch('http://100.76.5.223:19001/filter/' + coursefilter)
            const filter = await response.json()
            setFilterCourse(filter)
        }
        if(coursefilter != ""){
            getFilterCourse()
            setfilteron(true)
        }
        
    }, [filteron])
    
    const pressHandle = (item) => {
        setCourse(item)
        navigation.navigate('Course details');
    }

    const removeFilter = () => {
        setFilter("")
        setfilteron(false)
    }

    const Filter = () => {
        return(
             <Pressable onPress={removeFilter}>
            <View style={styles.filterbtn}>
                
                <View style={styles.filterss}>
            <Text>{coursefilter}</Text>
            </View>
            </View></Pressable>
        )
    }

    switch(filteron){
        case true:
            return(
                <>
                
                <FlatList horizontal={true} style={styles.list} data={filteredCourse} renderItem={({item}) => {
                    return(
                        <Course title={item.title} author={item.author} image={item.image} videos={item.videos} course={item} pressHandle={pressHandle}/>
                    )
                }}>
                </FlatList>
                <Filter/>
                </>
                );
        default:
         return(
        <>
        <FlatList horizontal={true} style={styles.list} data={courses} renderItem={({item}) => {
            return(
                <Course title={item.title} author={item.author} image={item.image} videos={item.videos} course={item} pressHandle={pressHandle}/>
            )
        }}>
        </FlatList>
        </>
    );   
    }
    
}