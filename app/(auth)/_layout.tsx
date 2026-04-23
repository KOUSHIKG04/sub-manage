import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/src/theme/useTheme';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { theme } = useTheme();

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
