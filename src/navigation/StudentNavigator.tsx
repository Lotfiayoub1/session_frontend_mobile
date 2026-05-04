import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StudentTabParamList, SessionsStackParamList } from './types';
import { COLORS } from '../utils/theme';

import { SessionListScreen } from '../screens/sessions/SessionListScreen';
import { SessionDetailScreen } from '../screens/sessions/SessionDetailScreen';
import { SessionCalendarScreen } from '../screens/sessions/SessionCalendarScreen';
import { BookingFormScreen } from '../screens/booking/BookingFormScreen';
import { MyBookingsScreen } from '../screens/booking/MyBookingsScreen';
import { ProgramsScreen } from '../screens/student/ProgramsScreen';
import { DocumentsScreen } from '../screens/documents/DocumentsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const SessionsStack = createNativeStackNavigator<SessionsStackParamList>();

const SessionsNavigator = () => (
  <SessionsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <SessionsStack.Screen name="SessionList" component={SessionListScreen} options={{ title: 'Sessions' }} />
    <SessionsStack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session Details' }} />
    <SessionsStack.Screen name="SessionCalendar" component={SessionCalendarScreen} options={{ title: 'Calendar' }} />
    <SessionsStack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Book Session' }} />
  </SessionsStack.Navigator>
);

export const StudentNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { paddingBottom: 4, height: 60 },
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, string> = {
          Sessions: focused ? 'calendar' : 'calendar-outline',
          MyBookings: focused ? 'bookmark' : 'bookmark-outline',
          Programs: focused ? 'book' : 'book-outline',
          Documents: focused ? 'document-text' : 'document-text-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Sessions" component={SessionsNavigator} options={{ title: 'Sessions' }} />
    <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings', headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
    <Tab.Screen name="Programs" component={ProgramsScreen} options={{ title: 'Programs', headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
    <Tab.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documents', headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile', headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }} />
  </Tab.Navigator>
);
