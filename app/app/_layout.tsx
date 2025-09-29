import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'index', label: 'Home', icon: 'home' },
    { name: 'about', label: 'About', icon: 'information-circle' },
    { name: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Journal App</Text>
      </View>
      {menuItems.map((item) => (
        <DrawerItem
          key={item.name}
          label={item.label}
          icon={({ color, size }) => (
            <Ionicons name={item.icon as any} size={size} color={color} />
          )}
          onPress={() => {
            if (item.name === 'index') {
              router.push('/');
            } else if (item.name === 'about') {
              router.push('/about');
            } else if (item.name === 'settings') {
              router.push('/settings');
            }
          }}
          focused={pathname === (item.name === 'index' ? '/' : `/${item.name}`)}
          activeTintColor="#ffd33d"
          inactiveTintColor="#fff"
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: '#25292e',
            width: 280,
          },
          drawerActiveTintColor: '#ffd33d',
          drawerInactiveTintColor: '#fff',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            headerLeft: () => <HamburgerButton />,
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            title: 'About',
            headerLeft: () => <HamburgerButton />,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerLeft: () => <HamburgerButton />,
          }}
        />
        <Drawer.Screen
          name="tabs"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

function HamburgerButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.hamburgerButton}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <Ionicons name="menu" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#25292e',
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#1a1d21',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  drawerTitle: {
    color: '#ffd33d',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItem: {
    marginHorizontal: 10,
    borderRadius: 8,
  },
  drawerLabel: {
    color: '#fff',
    fontSize: 16,
  },
  hamburgerButton: {
    marginLeft: 15,
    padding: 5,
  },
});
