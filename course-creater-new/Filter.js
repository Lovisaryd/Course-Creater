import { View, Text, Pressable } from "react-native"
import { useState } from "react"
import { styles } from "./App"

export const Filter = ({styles, setFilter, setShowModal, setfilteron}) => {
    //hard coded for now
    const categories = ['Barre', 'Adagio', 'Pointe', 'Jumps', 'Turns']
    const [selected, setSelected] = useState('')
    return(
      <View style={styles.modal}>
        <Text>What are you looking for today?</Text>
        {categories.map((category, index) => <RadioBtn selected={selected} setSelected={setSelected} setShowModal={setShowModal} setfilteron={setfilteron} setFilter={setFilter} key={index} styles={styles} category={category} />)}
        <Pressable onPress={() => setShowModal(false)}>
        <Text>Select</Text>
        </Pressable>
      </View>
    )
  }

  export const RadioBtn = ({category, setFilter, setfilteron, selected, setSelected}) => {
    
      
    const handlePress = () => {
      setSelected(category) 
      setFilter(category)
      setfilteron(true)
    }
  
    return(
      <View style={styles.radiolist}>
        <Pressable onPress={handlePress}>
        <View style={[styles.radiobtn, selected === category && styles.radiobtnpink]} />
        </Pressable>
        <Text>{category}</Text>
      </View>
    )
  }