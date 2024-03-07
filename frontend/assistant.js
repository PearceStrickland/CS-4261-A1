import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const AssistantScreen = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newConversation = [...conversation, { sender: 'User', text: message.trim() }];
        setConversation(newConversation);

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

            // This assumes the response is well-formed with the choices array not empty.
            if (response.data.choices && response.data.choices.length > 0) {
                setConversation(convo => [...convo, { sender: 'ChatGPT', text: response.data.choices[0].message.content.trim() }]);
            }
        } catch (error) {
            console.error('Error sending message to OpenAI:', error);
        }

        setMessage('');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.conversation} ref={scrollView => scrollView && scrollView.scrollToEnd({ animated: true })}>
                {conversation.map((msg, index) => (
                    <Text key={index} style={styles.message(msg.sender)}>
                        {msg.sender === 'User' ? 'You: ' : 'ChatGPT: '}{msg.text}
                    </Text>
                ))}
            </ScrollView>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Ask something..."
                onSubmitEditing={sendMessage} // Allows to send message with the return key on the keyboard
                returnKeyType="send"
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    conversation: {
        flex: 1,
        marginBottom: 20,
    },
    message: sender => ({
        marginBottom: 10,
        alignSelf: sender === 'User' ? 'flex-end' : 'flex-start',
    }),
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5, // added some border radius
    },
});

export default AssistantScreen;
