import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Ionicons name="journal" size={64} color="#ffd33d" style={styles.icon} />
          <Text style={styles.title}>About Journal App</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is Journal App?</Text>
          <Text style={styles.description}>
            Journal App is a personal journaling application designed to help you capture your thoughts,
            memories, and daily experiences in a beautiful and intuitive interface. Whether you&apos;re
            documenting your journey, reflecting on your day, or simply organizing your thoughts,
            this app provides a private space for your own personal expression.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            <FeatureItem
              icon="create"
              title="Easy Writing"
              description="Simple and distraction-free writing experience"
            />
            <FeatureItem
              icon="folder"
              title="Organization"
              description="Keep your entries organized and easily accessible"
            />
            <FeatureItem
              icon="lock-closed"
              title="Privacy"
              description="Your thoughts remain private and secure"
            />
            <FeatureItem
              icon="phone-portrait"
              title="Mobile-First"
              description="Designed specifically for mobile devices"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built With</Text>
          <Text style={styles.description}>
            This app is built using React Native with Expo, providing a smooth and native experience
            across both iOS and Android platforms. The navigation system uses React Navigation
            with a modern drawer-based interface for easy access to all features.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for using Journal App. We hope it helps you on your journaling journey.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ icon, title, description }: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color="#ffd33d" style={styles.featureIcon} />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd33d',
    textAlign: 'center',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
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
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#1a1d21',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#ffd33d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});