import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type StudentTabParamList = {
  Sessions: NavigatorScreenParams<SessionsStackParamList>;
  MyBookings: undefined;
  Programs: undefined;
  Documents: undefined;
  Profile: undefined;
};

export type SessionsStackParamList = {
  SessionList: undefined;
  SessionDetail: { sessionId: number };
  SessionCalendar: undefined;
  BookingForm: { sessionId: number };
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Sessions: NavigatorScreenParams<AdminSessionsStackParamList>;
  Students: NavigatorScreenParams<AdminStudentsStackParamList>;
  Credits: undefined;
  More: NavigatorScreenParams<AdminMoreStackParamList>;
};

export type AdminSessionsStackParamList = {
  SessionManagement: undefined;
  SessionDetail: { sessionId: number };
  CreateSession: undefined;
  EditSession: { sessionId: number };
  ClassroomView: { sessionId: number };
};

export type AdminStudentsStackParamList = {
  StudentList: undefined;
  StudentProfile: { studentId: number };
  CreateStudent: undefined;
};

export type AdminMoreStackParamList = {
  MoreMenu: undefined;
  InterestAnalytics: undefined;
  DocumentUpload: undefined;
};

export type SuperAdminTabParamList = {
  Dashboard: undefined;
  Schools: undefined;
  Users: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}
