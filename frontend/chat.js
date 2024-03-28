import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

const ChatScreen = () => {
    const [messages, setMessages] = useState([{
        "text": "Hello! I am your personal budget buddy. Ask me anything.",
        "_id": Date.now().toString(),
        "user": {
            "_id": 2,
              "avatar": "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png"
        }}
    ]);

    const [conversation, setConversation] = useState([]);

    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        mytext = messages[0].text;
        const newConversation = [...conversation, { sender: 'User', text: mytext}];
        setConversation(newConversation)

        responseText = '';
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: newConversation.map(c => ({ role: "user", content: c.text })),
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer "Put secret key here"`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response)
            // This assumes the response is well-formed with the choices array not empty.
            if (response.data.choices && response.data.choices.length > 0) {
                responseText = response.data.choices[0].message.content.trim();
            } else {
                responseText = 'Error connecting to Budget Buddy. Please try again.'
            }
        }  catch (error) {
            console.error('Error sending message to OpenAI:', error);
            responseText = 'Error connecting to Budget Buddy. Please try again.'
        } finally {
            responseMessage = [{
                "text": responseText,
                "_id": Date.now().toString(),
                "user": {
                    "_id": 2,
                      "avatar": "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png"
                }}];
            setMessages(previousMessages => GiftedChat.append(previousMessages, responseMessage));
        }    
    })

    return (
        <View style={styles.container}>
            <GiftedChat 
                messages = {messages}
                onSend={messages => onSend(messages)}
                user={{_id:1}}
                minInputToolbarHeight={150}
                minComposerHeight={100}
                alwaysShowSend={true}
                infiniteScroll={true}
                loadEarlier={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    conversation: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5, // added some border radius
    },
});

export default ChatScreen;