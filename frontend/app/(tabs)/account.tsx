import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import PageView from '../Components/PageView'
import PageHeader from '../Components/PageHeader'
import { icons } from '../../constants'
import TextContainer from '../Components/TextContainer'

const Account = () => {
  return (
    <PageView scroll={true}>
        <View className='w-full'>
          <PageHeader text='Account'/>
        </View>

        <Pressable 
          className='absolute right-1'
          onPress={() => console.log("Edit Button Pressed")}
        >
          <Image
            source={icons.edit}
            resizeMode='contain'
            alt='Edit icon'
            tintColor={'black'}
          />
        </Pressable>
        


        <View className='flex items-center justify-center'>       
          <View className='border-4 w-1/4 py-3 rounded-full flex items-center'>
            <Image
              source={icons.profile}
              tintColor={'black'}
              alt='Profile icon'
              resizeMode='contain'
            />
          </View>
        </View>
        <View className='flex items-center justify-center'>
          <TextContainer style='mt-5 flex w-[80%] p-4 rounded-xl' textStyle='text-xl font-psemibold text-center'>
            Name McName
          </TextContainer>
        </View>
        <View className='flex items-center justify-center'>
          <TextContainer style='mt-5 flex w-[80%] p-4 rounded-xl' textStyle='text-lg font-pregular text-center'>
            Hello! My name is Name McName and I love this app! You should try it too!
          </TextContainer>
        </View>
    </PageView>
  )
}

export default Account