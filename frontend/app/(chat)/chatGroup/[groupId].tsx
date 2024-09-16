import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { createMessage, getMessagesForGroup } from '../../../api/chatApi';
import { IMessage, PictureMessageBubble, Sender, TextMessageBubble, Type, VideoMessageBubble } from '../../Components/MessageBubbles';
import { useGlobalContext } from '../../context/GlobalProvider';
import socket from '../../../api/socket';

export default function Chat() {

  const {user} = useGlobalContext()

  const { groupId } = useLocalSearchParams();
  const [chatData, setChatData] = useState(null);
  const [inputText, setInputText] = useState('');

  // Fetch chat data based on groupId
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const fetchedChatData = await getMessagesForGroup(groupId)
        setChatData(fetchedChatData)
      } catch (error) {
        Alert.alert("Error fetching chat: ", error.message)
      }
    };
    
    fetchChat();
  }, [groupId]);

  useEffect(() => {
    socket.on('newMessage', (data) => {
      console.log("New message received in chat: ", data)
    })

    return () => {
      socket.disconnect();
    };
  }, [groupId])
  

  // Only support text currently
  const sendPressed = async () => {
    try {
      const newMessage = await createMessage({
        content: inputText,
        mediaType: "TEXT",
        senderId: user.id,
        groupId
      })
      console.log(newMessage)
    } catch (error) {
      Alert.alert("Error sending message: ", error.message)
    }
  }

  function getType(type) : Type {
    if(type === "TEXT" || type === undefined || type === null) {
      return Type.TEXT
    } else if (type === "IMAGE") {
      return Type.IMAGE
    } else if (type === "VIDEO") {
      return Type.VIDEO
    }
  }

  function createIMessage(message) : IMessage {
    return {
      id: message.id,
      content: {
        text: message.content,
        imgUri: message.url,
        videoUri: message.url
      },
      type: getType(message.mediaType),
      sender: message.sender.id === user.id ? Sender.USER : Sender.OTHER
    }
  }

  const generateChatBubble = (message) => {
      const iMessage : IMessage = createIMessage(message)
      
      if(iMessage.type === Type.TEXT) {
          return <TextMessageBubble message={iMessage}/>
      } else if (iMessage.type === Type.IMAGE) {
          return <PictureMessageBubble message={iMessage}/>
      } else {
          return <VideoMessageBubble message={iMessage}/>
      }
  }

  if (!chatData) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <KeyboardAvoidingView 
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
                <View className="flex-1 justify-start bg-white">
                    <FlatList
                        inverted
                        contentContainerStyle={{
                            padding: 16
                        }}
                        data={chatData}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => generateChatBubble(item)}
                    />

                    <View className="flex-row items-center p-4 border-t mb-2 border-gray-200 justify-end">
                        <TextInput
                            className="flex-1 p-3 bg-gray-100 rounded-lg"
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                        />
                        <TouchableOpacity onPress={() => sendPressed()} className="ml-2 p-3 bg-blue-500 rounded-lg">
                            <Text className="text-white">Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </KeyboardAvoidingView>
  );
}
