import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  AdminTabParamList,
  AdminSessionsStackParamList,
  AdminStudentsStackParamList,
  AdminMoreStackParamList,
} from './types';
import { COLORS } from '../utils/theme';

import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { SessionManagementScreen } from '../screens/admin/SessionManagementScreen';
import { SessionDetailScreen } from '../screens/sessions/SessionDetailScreen';
import { CreateEditSessionScreen } from '../screens/admin/CreateEditSessionScreen';
import { ClassroomViewScreen } from '../screens/admin/ClassroomViewScreen';
import { StudentListScreen } from '../screens/admin/StudentListScreen';
import { StudentProfileScreen } from '../screens/admin/StudentProfileScreen';
import { CreateStudentScreen } from '../screens/admin/CreateStudentScreen';
import { CreditManagementScreen } from '../screens/admin/CreditManagementScreen';
import { InterestAnalyticsScreen } from '../screens/admin/InterestAnalyticsScreen';
import { DocumentUploadScreen } from '../screens/admin/DocumentUploadScreen';
import { MoreMenuScreen } from '../screens/admin/MoreMenuScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const SessionsStack = createNativeStackNavigator<AdminSessionsStackParamList>();
const StudentsStack = createNativeStackNavigator<AdminStudentsStackParamList>();
const MoreStack = createNativeStackNavigator<AdminMoreStackParamList>();

const headerStyle = { backgroundColor: COLORS.primary };
const headerTintColor = '#fff';
const headerOptions = { headerStyle, headerTintColor, headerTitleStyle: { fontWeight: '600' as const } };

const AdminSessionsNavigator = () => (
  <SessionsStack.Navigator screenOptions={headerOptions}>
    <SessionsStack.Screen name="SessionManagement" component={SessionManagementScreen} options={{ title: 'Sessions' }} />
    <SessionsStack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: 'Session Details' }} />
    <SessionsStack.Screen name="CreateSession" component={CreateEditSessionScreen} options={{ title: 'Create Session' }} />
    <SessionsStack.Screen name="EditSession" component={CreateEditSessionScreen} options={{ title: 'Edit Session' }} />
    <SessionsStack.Screen name="ClassroomView" component={ClassroomViewScreen} options={{ title: 'Classroom' }} />
  </SessionsStack.Navigator>
);

const AdminStudentsNavigator = () => (
  <StudentsStack.Navigator screenOptions={headerOptions}>
    <StudentsStack.Screen name="StudentList" component={StudentListScreen} options={{ title: 'Students' }} />
    <StudentsStack.Screen name="StudentProfile" component={StudentProfileScreen} options={{ title: 'Student Profile' }} />
    <StudentsStack.Screen name="CreateStudent" component={CreateStudentScreen} options={{ title: 'New Student' }} />
  </StudentsStack.Navigator>
);

const AdminMoreNavigator = () => (
  <MoreStack.Navigator screenOptions={headerOptions}>
    <MoreStack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: 'More' }} />
    <MoreStack.Screen name="InterestAnalytics" component={InterestAnalyticsScreen} options={{ title: 'Interest Analytics' }} />
    <MoreStack.Screen name="DocumentUpload" component={DocumentUploadScreen} options={{ title: 'Upload Document' }} />
  </MoreStack.Navigator>
);

export const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { paddingBottom: 4, height: 60 },
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, string> = {
          Dashboard: focused ? 'grid' : 'grid-outline',
          Sessions: focused ? 'calendar' : 'calendar-outline',
          Students: focused ? 'people' : 'people-outline',
          Credits: focused ? 'wallet' : 'wallet-outline',
          More: focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline',
        };
        return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ headerShown: true, ...headerOptions }} />
    <Tab.Screen name="Sessions" component={AdminSessionsNavigator} />
    <Tab.Screen name="Students" component={AdminStudentsNavigator} />
    <Tab.Screen name="Credits" component={CreditManagementScreen} options={{ headerShown: true, ...headerOptions }} />
    <Tab.Screen name="More" component={AdminMoreNavigator} />
  </Tab.Navigator>
);
