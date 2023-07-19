import { View, Text, TextInput } from "react-native"
import { Courses } from "./Courses"
import { useState } from "react"

export const Homepage = ({courses, setCourse, styles, coursefilter, setFilter, filteron, setfilteron}) => {
    return(
      <View style={styles.container}>
      <Courses filteron={filteron} setfilteron={setfilteron} setFilter={setFilter} courses={courses} setCourse={setCourse} styles={styles} coursefilter={coursefilter} />      
      </View>
    )
  }