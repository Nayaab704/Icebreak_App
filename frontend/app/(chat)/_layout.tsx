import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, Text } from 'react-native'

function ChatLayout() {
    return (
        <>
          <Stack>
            <Stack.Screen
              name='chat'
              options={{
                headerShown: true,
                headerTitle: 'Chat',
                headerStyle: {
                    backgroundColor: "#23BAE5",
                },
              }}
              
            />
          </Stack>
          <StatusBar backgroundColor='#161622' style='light'/>
        </>
      )
}

export default ChatLayout