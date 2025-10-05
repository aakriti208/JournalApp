import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

export default function NewJournal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving journal entry:', { title, content });
    // For now, just navigate back to dashboard
    router.push('/tabs/dashboard');
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>New Journal Entry</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Give your entry a title..."
                placeholderTextColor="#6b7280"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your thoughts</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="What's on your mind?"
                placeholderTextColor="#6b7280"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.moodSection}>
              <Text style={styles.label}>How are you feeling?</Text>
              <View style={styles.moodOptions}>
                <TouchableOpacity style={styles.moodButton}>
                  <Text style={styles.moodEmoji}>😊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moodButton}>
                  <Text style={styles.moodEmoji}>😐</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moodButton}>
                  <Text style={styles.moodEmoji}>😢</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moodButton}>
                  <Text style={styles.moodEmoji}>😄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moodButton}>
                  <Text style={styles.moodEmoji}>😔</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.back()}
              >
                <Ionicons name="close-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Ionicons name="checkmark-outline" size={20} color="#25292e" />
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save Entry</Text>
              </TouchableOpacity>
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
  headerSection: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd33d',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#9ca3af',
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  titleInput: {
    backgroundColor: '#1a1d21',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  contentInput: {
    backgroundColor: '#1a1d21',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 200,
  },
  moodSection: {
    gap: 12,
  },
  moodOptions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-around',
  },
  moodButton: {
    width: 50,
    height: 50,
    backgroundColor: '#1a1d21',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#ffd33d',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveButtonText: {
    color: '#25292e',
  },
});
