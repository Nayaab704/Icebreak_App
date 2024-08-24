import { View, Text, TextInput, KeyboardAvoidingView, Platform, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { login } from '../../api/authApi'
import { storeToken, validateEmail, validatePassword } from '../../lib/authTools'
import { useGlobalContext } from '../context/GlobalProvider'
import { router } from 'expo-router'

interface ISignInForm {
  email: string
  password: string
}

const SignIn = () => {
  const {setUser} = useGlobalContext()

  const [forms, setForms] = useState<ISignInForm>({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const signInPressed = async () => {
    const {email, password} = forms
    setIsLoading(true)
    try {
      if(!validateEmail(email)){
        throw new Error("Invalid email.")
      }

      const user = await login(email, password)
      console.log("Logged In: ", user)
      await storeToken(user.token)
      setUser(user.id)
      router.replace('/home')
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <SafeAreaView className='flex-1 justify-center items-center h-full bg-primary-default'>
      <View>
        <TextInput
          className='p-3 border-2 rounded-xl border-primary-600 mb-3'
          value={forms.email}
          onChangeText={text => setForms({... forms, email: text})}
          autoCorrect={false}
          placeholder='Enter your email.'
          inputMode='email'
        />
        <TextInput
          className='p-3 border-2 rounded-xl border-primary-600 mb-3'
          value={forms.password}
          onChangeText={text => setForms({... forms, password: text})}
          autoCorrect={false}
          placeholder='Enter your password.'
          secureTextEntry={true}
        />

        <TouchableOpacity 
          className={`bg-primary-600 border rounded-xl`}
          onPress={signInPressed}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Text className={`text-primary font-psemibold text-lg text-center py-4`}>{"Sign In"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SignIn