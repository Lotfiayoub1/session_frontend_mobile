import { MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#1565C0',
  primaryLight: '#1E88E5',
  primaryDark: '#0D47A1',
  secondary: '#00897B',
  accent: '#FF6F00',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  error: '#C62828',
  success: '#2E7D32',
  warning: '#F57F17',
  info: '#0277BD',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  // Status colors
  confirmed: '#2E7D32',
  pending: '#F57F17',
  cancelled: '#C62828',
  upcoming: '#1565C0',
  completed: '#757575',
  ongoing: '#00897B',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
  },
};
