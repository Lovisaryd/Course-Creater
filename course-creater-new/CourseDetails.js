import { Text, View, ScrollView, Image } from "react-native"
import tick from './assets/icons8-tick-16.png'

export const CourseDetails = ({course, styles}) => {
    const src = course.image
    const content = course.content
    
    return(
        
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.scroll}>
                <Image source={{uri:src}} style={styles.photodet}></Image>
                <Text style={styles.header}>{course.title}</Text>
                <Text style={styles.desc}>Course content</Text>
                <View>
                {content.map((text, index) =><Text key={index} style={styles.desc}><Image style={styles.tabBarIcon} source={tick}></Image>  {text}</Text> )}
                </View>
                <View>
                    <Text style={styles.desc}>Course description</Text>
                    <Text style={styles.desc}>{course.description}</Text>
                </View></View>
            </ScrollView>
            </View>
        
    )
}