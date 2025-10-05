import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

export default function More() {
  const router = useRouter();

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Profile',
      subtitle: 'Manage your account',
      onPress: () => console.log('Profile pressed'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences',
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'bookmark-outline',
      title: 'Favorites',
      subtitle: 'Your saved entries',
      onPress: () => console.log('Favorites pressed'),
    },
    {
      icon: 'archive-outline',
      title: 'Archive',
      subtitle: 'Archived entries',
      onPress: () => console.log('Archive pressed'),
    },
    {
      icon: 'lock-closed-outline',
      title: 'Privacy',
      subtitle: 'Security settings',
      onPress: () => console.log('Privacy pressed'),
    },
    {
      icon: 'color-palette-outline',
      title: 'Themes',
      subtitle: 'Customize appearance',
      onPress: () => console.log('Themes pressed'),
    },
    {
      icon: 'cloud-upload-outline',
      title: 'Backup',
      subtitle: 'Save your data',
      onPress: () => console.log('Backup pressed'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get assistance',
      onPress: () => console.log('Help pressed'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App information',
      onPress: () => router.push('/about'),
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>More</Text>
          <Text style={styles.subtitle}>Settings and options</Text>

          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color="#ffd33d" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.versionSection}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
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
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1d21',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#25292e',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  versionSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
