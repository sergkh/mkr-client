import { Picker } from '@react-native-picker/picker';
import { act, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

export default function UrlPicker({url, onItemPicked, enabled}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true); 

    try {
      const response = await fetch(url);
      const data = await response.json();
      setItemsList(data);
      setSelectedItem(data[0]?.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { if (enabled) fetchItems(); }, [url, enabled]);
  useEffect(() => { onItemPicked(selectedItem); }, [selectedItem]);

  return (
    <Picker
        enabled={enabled}
        selectedValue={selectedItem}
        onValueChange={(itemValue) => setSelectedItem(itemValue)}
        style={styles.picker} 
        testID='url-picker'     
      >
        {
        itemsList.map((item) => (
          <Picker.Item 
            key={item.id} 
            label={item.name} 
            value={item.id} 
          />
          ))
        }
      </Picker>
  )
}


const styles = StyleSheet.create({
  picker: { 
    height: Platform.OS == 'ios' ? 200 : 80, 
    width: '100%' 
  }
});
