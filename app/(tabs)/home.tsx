import { View, Text, Image, ScrollView, Pressable } from 'react-native'
import React from 'react'
import HomePageButton from '../Components/HomePageButton'
import { icons } from '../../constants'
import PageView from '../Components/PageView'
import PageHeader from '../Components/PageHeader'

const Home = () => {
  return (
    <PageView scroll={true}>
        <PageHeader text='Home'/>
        <View className='space-y-4 mb-10'>
          <HomePageButton
            title='Group Chat Icebreaking'
            image={icons.group}
            imgAlt='Group icon'
            styles='mb-8'
          />
          <HomePageButton
            title='One-One Chat with NAME'
            image={icons.profile}
            imgAlt='Group icon'
          />
        </View>

        <View className='flex-row space-x-4 border-y-4 border-primary-600 p-5'>
          <Pressable className='flex-[0.2] items-center justify-center'
            onPress={() => console.log("Create a Conversation pressed")}
          >
            <View className='p-6 border rounded-2xl'>
              <Image
                source={icons.plus}
                tintColor={'black'}
              />
            </View>
          </Pressable>
          <View className='justify-center flex-[0.8] text-center'>
            <Text className='text-3xl font-bold text-primary-600'>
              Create a New Conversation
            </Text>
          </View>
        </View>
    </PageView>
  )
}

export default Home