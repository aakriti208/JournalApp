import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomHeader() {

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => {
          // Navigate to profile/account settings
          console.log('Profile pressed');
        }}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#25292e" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.activityButton}
        onPress={() => {
          // Navigate to activity/notifications
          console.log('Activity pressed');
        }}
      >
        <Ionicons name="notifications-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#25292e',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffd33d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityButton: {
    padding: 4,
  },
});
