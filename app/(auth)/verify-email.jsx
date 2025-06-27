import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [ code, setCode ] = useState("");
  const [ loading, setLoading ] = useState(false);

  const handleVerification = async() => {
    if(!isLoaded) return;

    setLoading(true)
    try {
      console.log("Attempting to verify with code:", code);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({code});
      console.log("SignUp Attempt Result:", JSON.stringify(signUpAttempt, null, 2));

      if (signUpAttempt.status === "complete") {

        if (!signUpAttempt.createdSessionId) {
          console.error("No session ID found in signUpAttempt");
          return { success: false, message: "No session ID returned from Clerk" };
        }
        
        // await setActive({session:signUpAttempt.createdSessionId})
        await setActive({session:signUpAttempt.createdSessionId})

        console.log("Verification complete. Session set.");
        return { success: true, message: "Email verified and session activated" };

      } else {
        Alert.alert("Error", "Verification failed. Please try again");
        console.error(JSON.stringify(signUpAttempt, null, 2));

        return { success: false, message: "Verification failed. Status not complete." };

      }
    } catch (err) {
      Alert.alert("Error", err.error?. [0]?.message|| "Verification failed");
      console.error(JSON.stringify(err, null, 2));

      const errorMessage = err?.errors?.[0]?.message || "Unknown verification error";
      return { success: false, message: errorMessage };

    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/*Image Container */}
          <View style={authStyles.imageContainer}>
              <Image
                source={require("../../assets/images/design.png")}
                style={authStyles.image}
                contentFit="contain"
              />
          </View>
          {/*Title */}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>We&apos;ve sent a Verification code to {email}</Text>

          <View style={authStyles.formContainer}>
              {/*Verification Code Input */}
              <View style={authStyles.inputContainer}>
                <TextInput
                    style={authStyles.textInput}
                    placeholder="Enter verification code"
                    placeholderTextColor={COLORS.textLight}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                />
              </View>
              <TouchableOpacity style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                onPress={handleVerification}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
              </TouchableOpacity>

              {/*Back to Sign Up */}
              <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                  <Text style={authStyles.link}>Back to Sign Up</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmail