import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

const TabsLayour = () => {
    const {isSignedIn} = useAuth();

    if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"}/>
  return <Stack/>
}

export default TabsLayour