import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function JournalEntry() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // TODO: Fetch journal entry data based on id
  // For now, using placeholder data
  const entry = {
    id,
    title: 'Sample Journal Entry',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    mood: '😊',
    content: 'This is a sample journal entry. Replace this with actual content from your database or storage.',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Entry</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.metaSection}>
            <Text style={styles.date}>{entry.date}</Text>
            <Text style={styles.mood}>{entry.mood}</Text>
          </View>

          <Text style={styles.title}>{entry.title}</Text>

          <View style={styles.divider} />

          <Text style={styles.bodyText}>{entry.content}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="create-outline" size={24} color="#ffd33d" />
          <Text style={styles.footerButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="share-outline" size={24} color="#ffd33d" />
          <Text style={styles.footerButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="heart-outline" size={24} color="#ffd33d" />
          <Text style={styles.footerButtonText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#25292e',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#9ca3af',
  },
  mood: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd33d',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1a1d21',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  footerButton: {
    alignItems: 'center',
    gap: 4,
  },
  footerButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
