import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/CustomHeader';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Track your journaling journey</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="book-outline" size={32} color="#ffd33d" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={32} color="#ffd33d" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="flame-outline" size={32} color="#ffd33d" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart-outline" size={32} color="#ffd33d" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No journal entries yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button below to create your first entry
              </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd33d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1d21',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  recentSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#1a1d21',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});
