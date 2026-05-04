import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SuperAdminTabParamList } from './types';
import { COLORS } from '../utils/theme';
import { SuperAdminDashboardScreen } from '../screens/super-admin/SuperAdminDashboardScreen';
import { SchoolManagementScreen } from '../screens/super-admin/SchoolManagementScreen';
import { UserManagementScreen } from '../screens/super-admin/UserManagementScreen';

const Tab = createBottomTabNavigator<SuperAdminTabParamList>();
const headerStyle = { backgroundColor: COLORS.primary };
const headerTintColor = '#fff';

export const SuperAdminNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      headerStyle,
      headerTintColor,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { paddingBottom: 4, height: 60 },
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, string> = {
          Dashboard: focused ? 'stats-chart' : 'stats-chart-outline',
          Schools: focused ? 'school' : 'school-outline',
          Users: focused ? 'people' : 'people-outline',
        };
        return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={SuperAdminDashboardScreen} options={{ title: 'Overview' }} />
    <Tab.Screen name="Schools" component={SchoolManagementScreen} options={{ title: 'Schools' }} />
    <Tab.Screen name="Users" component={UserManagementScreen} options={{ title: 'Users' }} />
  </Tab.Navigator>
);
