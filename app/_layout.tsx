import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found"/>
    </Stack>
  );
}

//stacks are foundation for navigating between  dif screens in an app


//shared UI elements such as headers and tab 
//bars so they are consistent between different routes.