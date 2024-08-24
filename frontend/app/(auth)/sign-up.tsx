import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { storeToken, validateAge, validateEmail, validatePassword, validateUsername } from '../../lib/authTools'
import { register } from '../../api/authApi'
import { useGlobalContext } from '../context/GlobalProvider'
import { router } from 'expo-router'

interface ISignUpForm {
  email: string
  username: string
  password: string
  age: string
}

const SignUp = () => {

  const {setUser, setIsLoggedIn} = useGlobalContext()

  const [forms, setForms] = useState<ISignUpForm>({
    email: '',
    username: '',
    password: '',
    age: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const signUpPressed = async () => {
    const {email, username, password, age} = forms
    setIsLoading(true)
    try {
      if(!validateEmail(email)){
        throw new Error("Invalid email.")
      } else if(!validateUsername(username)) {
        throw new Error("Username must be at least 5 characters and only letter and numbers.")
      } else if(!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters long.")
      } else if(!validateAge(age)) {
        throw new Error("Please enter a valid age.")
      }

      const newUser = await register(email, username, password, age)
      await storeToken(newUser.token)
      setUser(newUser.id)
      setIsLoggedIn(true)
      router.replace('/home')
    } catch (error) {
      Alert.alert("Error: ", error.message)
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
          value={forms.username}
          onChangeText={text => setForms({... forms, username: text})}
          autoCorrect={false}
          placeholder='Enter your username.'
        />
        <TextInput
          className='p-3 border-2 rounded-xl border-primary-600 mb-3'
          value={forms.password}
          onChangeText={text => setForms({... forms, password: text})}
          autoCorrect={false}
          placeholder='Enter your password.'
          secureTextEntry={true}
        />
        <TextInput
          className='p-3 border-2 rounded-xl border-primary-600 mb-3'
          value={forms.age}
          onChangeText={text => setForms({... forms, age: text})}
          autoCorrect={false}
          placeholder='Enter your age.'
          keyboardType='number-pad'
        />

        <TouchableOpacity 
          className={`bg-primary-600 border rounded-xl`}
          onPress={signUpPressed}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Text className={`text-primary font-psemibold text-lg text-center py-4`}>{"Sign Up"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SignUp