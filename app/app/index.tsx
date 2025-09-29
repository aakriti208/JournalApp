import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/background-1img.jpg');

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Journal App</Text>
          <Text style={styles.welcomeSubtitle}>
            Your personal space for thoughts, memories, and reflections
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} />
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✨ Write and organize your thoughts</Text>
            <Text style={styles.featureItem}>📱 Beautiful, intuitive interface</Text>
            <Text style={styles.featureItem}>🔒 Private and secure</Text>
            <Text style={styles.featureItem}>📂 Easy navigation with drawer menu</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd33d',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  featuresSection: {
    backgroundColor: '#1a1d21',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd33d',
    marginBottom: 15,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
});
