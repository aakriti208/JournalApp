import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingItem
            icon="moon"
            title="Dark Mode"
            description="Use dark theme for better viewing in low light"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#767577', true: '#ffd33d' }}
                thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            description="Receive reminders to write in your journal"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#767577', true: '#ffd33d' }}
                thumbColor={notifications ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Writing</Text>
          <SettingItem
            icon="save"
            title="Auto Save"
            description="Automatically save your entries as you write"
            rightComponent={
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: '#767577', true: '#ffd33d' }}
                thumbColor={autoSave ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SettingItem
            icon="finger-print"
            title="Biometric Lock"
            description="Use fingerprint or face ID to secure your journal"
            rightComponent={
              <Switch
                value={biometricLock}
                onValueChange={setBiometricLock}
                trackColor={{ false: '#767577', true: '#ffd33d' }}
                thumbColor={biometricLock ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <SettingItem
            icon="cloud-upload"
            title="Backup & Sync"
            description="Backup your entries to the cloud"
            onPress={() => {}}
            showArrow
          />
          <SettingItem
            icon="download"
            title="Export Data"
            description="Export your journal entries"
            onPress={() => {}}
            showArrow
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help-circle"
            title="Help & FAQ"
            description="Get help and find answers to common questions"
            onPress={() => {}}
            showArrow
          />
          <SettingItem
            icon="mail"
            title="Contact Support"
            description="Get in touch with our support team"
            onPress={() => {}}
            showArrow
          />
          <SettingItem
            icon="star"
            title="Rate the App"
            description="Rate and review Journal App"
            onPress={() => {}}
            showArrow
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-circle"
            title="App Version"
            description="1.0.0"
          />
          <SettingItem
            icon="document-text"
            title="Privacy Policy"
            description="Read our privacy policy"
            onPress={() => {}}
            showArrow
          />
          <SettingItem
            icon="document-text"
            title="Terms of Service"
            description="Read our terms of service"
            onPress={() => {}}
            showArrow
          />
        </View>
      </View>
    </ScrollView>
  );
}

function SettingItem({
  icon,
  title,
  description,
  rightComponent,
  onPress,
  showArrow = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
}) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={styles.settingItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#ffd33d" style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color="#666" style={styles.arrow} />
        )}
      </View>
    </Component>
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
  section: {
    marginBottom: 25,
    backgroundColor: '#1a1d21',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd33d',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: 8,
  },
});