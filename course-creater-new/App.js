import 'react-native-gesture-handler';
import { NavigationContainer, useScrollToTop } from '@react-navigation/native';
import {createNativeStackNavigator, tabBarIcon, HeaderBackButton} from '@react-navigation/native-stack'
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View, Modal, SafeAreaView, Image, Pressable } from 'react-native';
import {Courses, VideoPlayer} from './Courses'
import {CoursePage} from './Courses'
import { Homepage } from './Homepage';
import { Filter } from './Filter';
import filter from './assets/filter.png'
import * as Font from 'expo-font'
import addpost from './assets/icons8-add-64.png'
import { NewCourse } from './NewCourse';

const Stack = createNativeStackNavigator();

const loadCustomFont = async () => {
  await Font.loadAsync({
    'ChocolatesMedium': require('./assets/fonts/TTChocolatesTrialMedium.otf')
  });
};

export default function App() {

  const [courses, setCourses] = useState([])
  const [course, setCourse] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [coursefilter, setFilter] = useState("")
  const [filteron, setfilteron] = useState(false)

  useEffect(() => {
    loadCustomFont();
    if(loadCustomFont){
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://100.76.5.223:19001/courses`)
        const courses = await response.json();
        setCourses(courses)
      } catch (error) {
        console.error('Fetch error:', error);
      }
      
    }
    fetchCourses()}
  }, [])

  const Headerbtn = () => {
    const navigation = useNavigation()
    return(
      <Pressable onPress={() => navigation.navigate('NewPost')}>
      <Image source={addpost} style={styles.add}></Image>
      </Pressable>
    )
  }

  return(
    <>
    {showModal && <Filter setFilter={setFilter} setShowModal={setShowModal} styles={styles} filteron={filteron} setfilteron={setfilteron}></Filter>}
    <NavigationContainer>
    
      <Stack.Navigator>
        
      <Stack.Screen name="All courses" options={{
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerLeft: () => (<Headerbtn></Headerbtn>),
        headerRight: () => (<Pressable onPress={() => setShowModal(true)}><Image source={filter} style={styles.filter} /></Pressable>)
      }}>
            {(props) => (
              <Homepage
                {...props}
                courses={courses}
                setCourse={setCourse}
                styles={styles}
                coursefilter={coursefilter}
                showModal={showModal}
                setFilter={setFilter}
                setfilteron={setfilteron}
                filteron={filteron}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Course details" options={{headerTransparent: true, headerTitle: ""}}>
            {(props) => (
              <CoursePage
                {...props}
                course={course}
                styles={styles}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="NewPost" options={{headerTransparent: true, headerTitle: ''}}>
            {(props) => (
              <NewCourse
              {...props}
              styles={styles}
              setCourses={setCourses}
              />
            )}
          </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  )
};


 export const styles = StyleSheet.create({
 
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efd3d7',
    height: '100%'
  },
  videoplayers:{
    marginTop: 100,
  },
  bg: {
    backgroundColor: '#f8edeb',
    height: '100%'
  },
  course: {
    width: 410,
    borderRadius: 10,
    marginRight: 20,
  },
  photo: {
    width: '100%',
    height: '99%',
    borderRadius: 20,
  },
  phototext:{
    backgroundColor: '#D1D2F9',
    marginTop: '-50%',
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  photodet: {
    width: '100%',
    height: 700,
    borderRadius: 20
  },
  desc:{
    width: 400,
    padding: 20,
    fontFamily: 'ChocolatesMedium',
  },
  coursetext: {
    marginLeft: 20,
    marginTop: 20,
    fontFamily: 'ChocolatesMedium',
    fontSize: 22,
    color: '#32373B',
    width: 250
  },
  coursetextaut: {
    marginLeft: 20,
    marginTop: 20,
    fontFamily: 'ChocolatesMedium',
    fontSize: 13,
    color: '#32373B'
  },
  filter: {
    width: 25,
    height: 25
  },
  modal: {
    width: '100%',
    height: '100%',
    paddingTop: 100,
    paddingLeft: '27%'    
  },
  scroll: {
    width:"100%",
    backgroundColor: '#f8edeb',
    borderRadius: 10
  },
  header : {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10
  },
  radiolist: {
    flexDirection: 'row',
    textAlign: 'center',
    marginBottom: 20,
  },
  radiolist2:{
    flexDirection: 'row',
    marginBottom: 20,
    marginRight: '2%',
    marginTop: '2%'
  },
  radiobtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: 'pink',
    borderWidth: 1,
    marginRight: 10,
  },
  radiobtnpink: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: 'pink',
    backgroundColor: 'pink',
    borderWidth: 1,
    marginRight: 10,
  },
  filterbtn: {
    flexDirection: 'row'
  },
  videos: {
    marginBottom: 15,
    backgroundColor: '#2F2F2F',
    padding: 20,
    borderRadius: 20
  },
  videoslock:{
    marginBottom: 15,
    borderColor: 'grey',
    borderWidth: 2,
    padding: 20,
    borderRadius: 20
  },
  videoobj:{
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lockedicons:{
    height: 30,
    width: 30
  },
  videotext: {
    color: '#c0c0c0',
    fontSize: 18,
    width: 220
  },
  videotexttime:{
    color: '#c0c0c0',
    fontSize: 16,
    marginRight: '-20%'
  },
  lists: {
    flexDirection: 'row',
    marginTop: 20,
  },
  class: {
    marginRight: 20,
    marginLeft: 20
  },
  videolist:{
    paddingTop: 100,
    backgroundColor: '#f8edeb',
  },
  btn: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20
  },
  add:{
    width: 45,
    height: 45
  },
  add2:{
    width: 45,
    height: 45,
    color: 'black'
  },
  addpost: {
    height: '100%',
    paddingTop: 100
  },
  videolisttext:{
    textAlign: 'center',
    marginBottom: '10%'
  },
  filterbtn:{
    zIndex: 999999999
  },
  filterss:{
    position: 'absolute',
    flexDirection: 'row',
    transform: [{ translateX: 0 }, { translateY: -760 }],
    alignSelf: 'center',
    backgroundColor: '#2F2F2F',
    opacity: 0.5,
    padding: 20,
    borderRadius: 10
  },
  newcoursestyle:{
    paddingTop: '10%',
    width: '90%',
    alignSelf: 'center'
  },
  button:{
    backgroundColor: 'pink',
    width: '40%',
    padding: '2%',
    textAlign: 'center',
    borderRadius: 5,
    marginTop: '5%',
    marginBottom: '5%'
  },
  content:{
    backgroundColor: 'grey',
    padding: '2%',
    borderRadius: 3,
    marginBottom: '2%',
    marginTop: '2%',
    alignSelf: 'flex-start'
  },
  TextInput:{
    backgroundColor: 'grey',
    opacity: 0.3,
    width: '90%',
    color: 'black'
  },
  list: {
    flexDirection: 'row',
    alignSelf: 'center'
  }
})
