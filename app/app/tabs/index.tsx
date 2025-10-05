import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

const PlaceholderImage = require('@/assets/images/background-1img.jpg');

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <ImageBackground
            source={PlaceholderImage}
            style={styles.heroSection}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Welcome to Journal App</Text>
              <Text style={styles.heroSubtitle}>
                Your personal space for thoughts, memories, and reflections
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/tabs/new-journal')}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="create-outline" size={32} color="#ffd33d" />
                </View>
                <Text style={styles.actionTitle}>New Entry</Text>
                <Text style={styles.actionSubtitle}>Start writing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/tabs/dashboard')}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="stats-chart-outline" size={32} color="#ffd33d" />
                </View>
                <Text style={styles.actionTitle}>View Stats</Text>
                <Text style={styles.actionSubtitle}>Track progress</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="pencil" size={24} color="#ffd33d" />
                <Text style={styles.featureText}>Write and organize your thoughts</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="phone-portrait" size={24} color="#ffd33d" />
                <Text style={styles.featureText}>Beautiful, intuitive interface</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="lock-closed" size={24} color="#ffd33d" />
                <Text style={styles.featureText}>Private and secure</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="folder-open" size={24} color="#ffd33d" />
                <Text style={styles.featureText}>Easy navigation and organization</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  heroSection: {
    height: 250,
    marginBottom: 24,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 41, 46, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd33d',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1a1d21',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  featuresSection: {
    paddingHorizontal: 20,
  },
  featuresList: {
    backgroundColor: '#1a1d21',
    padding: 20,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
});
