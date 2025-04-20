import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import UrlPicker from './UrlPicker';

export default function HomeScreen({navigation}) {

  const [complete, setComplete] = useState(false);
  const [structure, setStructure] = useState(null);
  const [chair, setChair] = useState(null);
  const [teacher, setTeacher] = useState(null);
  
  useEffect(() => {
    setComplete(structure !== null && chair !== null && teacher !== null);    
  }, [structure, chair, teacher]);

  return (
    <View style={styles.home}>
        <Text>Виберіть викладача</Text>

        <UrlPicker 
          enabled={true}
          url="https://mkr.sergkh.com/structures"
          onItemPicked={item => {
            setStructure(item); 
            setChair(null);
            setTeacher(null);
          }}
        />

        <UrlPicker 
          enabled={structure !== null}
          url={`https://mkr.sergkh.com/structures/${structure}/chairs`}
          onItemPicked={item => {
            setChair(item);
            setTeacher(null);
          }}
        />

        <UrlPicker 
          enabled={chair !== null}
          url={`https://mkr.sergkh.com/structures/${structure}/chairs/${chair}/teachers`}
          onItemPicked={setTeacher}
        />

      <Button 
        enabled={complete}
        title="До розкладу" 
        onPress={() => navigation.navigate('Schedule', {
          structure: structure,
          chair: chair,
          teacher: teacher
        })} 
      />
    </View>
  );
};


const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
