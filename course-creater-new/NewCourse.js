import { Text, View, TextInput, Pressable, Button, Image } from "react-native";
import { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import addpost from './assets/icons8-add-48.png'

export const NewCourse = ({ styles, setCourses }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [photolink, setPhoto] = useState("");
  const [content, setcontent] = useState("");
  const [contents, setContents] = useState([]);
  const [video, setvideo] = useState({ title: "", content: "", video: "", locked: true });
  const [videos, setVideos] = useState([]);
  const categories = ['Barre', 'Adagio', 'Pointe', 'Jumps', 'Turns']
  const [errorspan, seterrorspan] = useState("");
  const [selected, setSelected] = useState('')

  const navigation = useNavigation();

  const handleVideos = () => {
    setVideos([...videos, video]);
    setvideo({ title: "", content: "", video: "", locked: true });
  };

  const createCourse = async () => {
    let err = false;

    if (
      title === "" ||
      category === "" ||
      description === "" ||
      author === "" ||
      photolink === ""
    ) {
      seterrorspan("All fields must be filled out!");
      err = true;
      setTimeout(() => {
        seterrorspan("");
      }, 2000);
    } else {
      for (let j = 0; j < videos.length; j++) {
        if (videos[j].title === "" || videos[j].video === "") {
          seterrorspan("All fields must be filled out!");
          setTimeout(() => {
            seterrorspan("");
          }, 2000);
          err = true;
          break;
        }
      }
    }

    if (!err) {
      const newCourse = {
        category: category,
        title: title,
        content: contents,
        description: description,
        author: author,
        image: photolink,
        videos: videos,
      };
      const options = {
        method: "POST",
        body: JSON.stringify(newCourse),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://100.76.3.199:19001/course", options);
      if (response.status === 201) {
        try{
          const fetchedcourse = await fetch("http://100.76.3.199:19001/courses");
        const courses = await fetchedcourse.json();
        setCourses(courses);
        navigation.navigate("All courses");
        }catch(err){
          throw err;
        }
        
      }
    }
  };

  const handleAddContent = () => {
    if(content != ''){
      setContents([...contents, content]);
    setcontent("");
    }
    
  };

  const RadioBtn = ({ category, selected, setSelected }) => {
    const handlePress = () => {
      setSelected(category) 
      setCategory(category);
    };
  
    return (
      <View style={styles.radiolist2}>
        <Pressable onPress={handlePress}>
        <View style={[styles.radiobtn, selected === category && styles.radiobtnpink]} />
        </Pressable>
        <Text>{category}</Text>
      </View>
    );
  };

  return (
    <View style={styles.newcoursestyle}>
      <Text style={styles.header}>Create new course</Text>
      <Text>Title</Text>
      <TextInput style={styles.TextInput} value={title} onChangeText={(text) => setTitle(text)} />
      <Text>Description</Text>
      <TextInput
        multiline
        style={styles.TextInput}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Text>Author</Text>
      <TextInput style={styles.TextInput} value={author} onChangeText={(text) => setAuthor(text)} />
      <Text>Image</Text>
      <TextInput style={styles.TextInput} value={photolink} onChangeText={(text) => setPhoto(text)} />
      
    <Text>Add contents</Text>
    <View style={styles.list}>
      <TextInput style={styles.TextInput} value={content} onChangeText={(text) => setcontent(text)} />
       <Pressable onPress={handleAddContent}>
        <Image source={addpost} style={styles.add}></Image>
      </Pressable>
      </View>
      {contents.map((content, index) => (
        <Text key={index} style={styles.content}>{content}</Text>
      ))}
     
      <Text>Pick a category</Text>
      <View style={styles.radiolist2}>
        {categories.map((category, index) => (
          <RadioBtn style={styles.radiolist2} key={index} styles={styles} category={category} selected={selected} setSelected={setSelected} />
        ))}
      </View>
      <View>
        <View style={styles.list}>
        <Text style={styles.header}>Add videos</Text>
        <Pressable onPress={handleVideos}>
        <Image source={addpost} style={styles.add2}></Image>
      </Pressable>
      </View>
        <Text>Title</Text>
        <TextInput
          style={styles.TextInput}
          value={video.title}
          onChangeText={(text) => setvideo({ ...video, title: text })}
        />
        <Text>Video link</Text>
        <TextInput
          style={styles.TextInput}
          value={video.video}
          onChangeText={(text) => setvideo({ ...video, video: text })}
        />
        <Text>Course content</Text>
        <TextInput
        multiline
          style={styles.TextInput}
          value={video.content}
          onChangeText={(text) => setvideo({ ...video, content: [text] })}
        />
        {videos.map((video, index) => (
          <Text key={index} style={styles.content}>{video.title}</Text>
        ))}
      </View>
      <Text>{errorspan}</Text>
      <Button color='#2F2F2F' title="Create course" onPress={createCourse} />
    </View>
  );
};
