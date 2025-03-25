import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lucky Games',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}