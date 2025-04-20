import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

function getIcon(type) {
  switch (type) {
    case 'lection':
    case 'lection_in_absentia':
      return 'book';
    case 'practice':
    case 'practice_in_absentia':
      return 'computer';
    case 'exam':
      return 'flag-checkered';
    default:
      return 'question';
  }
}

// Групування подій за днем
function groupByDay(events) {
  const groupObj = events.reduce((acc, event) => {
    const day = event.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});

  return Object.keys(groupObj).map((day) => ({
    day,
    data: groupObj[day]
  }));
}

export default function ScheduleScreen({route}) {
  const [schedule, setSchedule] = useState([]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(
        `https://mkr.sergkh.com/structures/${route.params.structure}/chairs/${route.params.chair}/teachers/${route.params.teacher}/schedule`
      );
      const data = await response.json();
      // Додати поле day до кожного елемента
      data.map((item) => {
        item.startDate = new Date(item.start)
        item.day = item.startDate.toLocaleDateString('uk-UA', { weekday: 'long', month: "long", day: "numeric", });
        item.time = item.start.split(' ')[1];
        item.icon = getIcon(item.type);
        return item;
      });
    
      setSchedule(groupByDay(data));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, [route.params.structure, route.params.chair, route.params.teacher]);

  return (
    <View style={styles.schedule}>
      <SectionList
        sections={schedule}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>            
            <View style={styles.mainRow}>
              <Text style={styles.itemText}>{item.time + ' ' + item.name + ' '}</Text> 
              <FontAwesome6 name={item.icon} size={14} color="black" />
            </View>
            <Text style={styles.subText}>{item.group}</Text>     
            
          </View>
        )}
        renderSectionHeader={({section: {day}}) => (
          <View style={styles.day}>
            <FontAwesome6 name="calendar" size={20} color="white" style="style.dayIcon"/>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  schedule: {
    flex: 1,
    backgroundColor: '#EEF1DA',
    alignItems: 'left',
    justifyContent: 'center',
  },
  day: {
    flexDirection: 'row',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    backgroundColor: '#ADB2D4',
    color: 'white',
    padding: 10,
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomColor: '#C7D9DD',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  subText: {    
    paddingLeft: 5,
  }
});
