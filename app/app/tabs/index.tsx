import { View, StyleSheet } from 'react-native';
import ImageViewer from '@/components/ImageViewer';


const PlaceholderImage = require('@/assets/images/background-1img.jpg');


export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 1200,
    height: 600,
    // borderRadius: 30,
  },
});
