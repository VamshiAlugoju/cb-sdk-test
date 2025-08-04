import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CallBridge, Client } from 'sdk-call';
import type { CallDetails, IMessage } from 'sdk-call';
import IncomingCallScreen from './IncomingCallScreen';
import OngoingCallScreen from './OngoingCall';
import OutgoingCallScreen from './OutgoingCallScreen';
import IdleScreen from './IdleScreen';
import ChatScreen from './ChatScreen';

const languages = ['hin', 'eng', 'tel'];
export default function MainApp() {
  const [user, setUser] = useState({
    apiKey: 'your-api-key',
    uniqueId: Math.floor(Math.random() * 1000).toString(),
  });

  const [mode, setMode] = useState<'normal' | 'call' | 'chat'>('normal');

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [recipientId, setRecipientId] = useState('');
  const [lang, setLang] = useState('eng');

  const [callState, setCallState] = useState({
    ...Client.callState,
    state: 'outgoing',
  });
  function handleCallStateChange(state: CallDetails) {
    setCallState(state);
  }

  function handleIncomingCall(payload: any) {}

  function handleReceiveMessage(message: any) {
    setMessages(prev => [...prev, message]);
  }

  function handleCallAnswered(payload: any) {
    setCallState(prev => {
      return {
        ...prev,
        state: 'ongoing',
      };
    });
  }

  useEffect(() => {
    Client.onIncomingCall(handleIncomingCall);
    Client.onCallStateChange(handleCallStateChange);
    Client.onCallAnswered(handleCallAnswered);
    Client.onReceiveMessage(handleReceiveMessage);
    console.log('user called init');
    setTimeout(() => {
      Client.init(user);
    }, 1000);

    console.log('user called init ========= after');

    return () => {
      Client.cleanUp();
    };
  }, [user]);

  console.log('callState', callState);

  return (
    <View style={styles.container}>
      <CallBridge />
      {callState.state === 'idle' && mode != 'chat' && (
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 10,
            }}
            onPress={() => {
              Client.changeLanguage(languages[0]);
              setLang(languages[0]);
            }}
          >
            <Text>{languages[0]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              padding: 10,
              marginTop: 10,
            }}
            onPress={() => {
              Client.changeLanguage(languages[1]);
              setLang(languages[1]);
            }}
          >
            <Text>{languages[1]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              padding: 10,
              marginTop: 10,
            }}
            onPress={() => {
              Client.changeLanguage(languages[2]);
              setLang(languages[2]);
            }}
          >
            <Text>{languages[2]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Client.init(user);
            }}
            style={{
              padding: 10,
            }}
          >
            <Text>init</Text>
          </TouchableOpacity>
        </View>
      )}

      {(mode === 'call' || mode === 'normal') && (
        <View style={{ flex: 1 }}>
          {callState.state === 'incoming' && (
            <IncomingCallScreen
              callerName="Philippe Troussier"
              callerNumber="84898XXX"
              onAccept={() => {
                Client.acceptCall();
              }}
              onReject={() => {
                Client.rejectCall();
              }}
              onMessage={() => {
                // none
              }}
              profileImageUri="https://picsum.photos/200/300" // Update to actual source
              language={lang}
            />
          )}
          {callState.state === 'ongoing' && (
            <OngoingCallScreen
              participantName="Philippe Troussier"
              participantNumber="84898XXX"
              onMute={() => {
                // handle it
              }}
              onSpeaker={() => {
                // handle it
              }}
              onHangup={() => {
                Client.endCall();
              }}
              profileImageUri="https://picsum.photos/200/300" // Update to actual source
              callDuration="03:17"
              language={lang}
            />
          )}
          {callState.state === 'outgoing' && (
            <OutgoingCallScreen
              recipientName="Philippe Troussier"
              recipientNumber="84898XXX"
              onMute={() => {
                /* Mute logic */
              }}
              onSpeaker={() => {
                /* Speaker logic */
              }}
              onHangup={() => {
                /* Hangup logic */
                Client.endCall();
              }}
              profileImageUri="https://picsum.photos/200/300" // Update to actual source
              language={lang}
            />
          )}
          {callState.state === 'idle' && (
            <IdleScreen
              recipientId={recipientId}
              setRecipientId={setRecipientId}
              onStartCall={(recipientId: string) => {
                Client.startCall({
                  recipientId: recipientId,
                  callType: 'audio',
                });
              }}
              onChat={() => {
                setMode('chat');
              }}
              userId={user.uniqueId}
            />
          )}
        </View>
      )}
      {mode === 'chat' && (
        <View style={{ flex: 1 }}>
          <ChatScreen
            currentUserId={user.uniqueId}
            chatPartnerId={recipientId}
            messages={messages}
            onSend={(message: string) => {
              const id = Math.floor(Math.random() * 100000000).toString();
              Client.sendMessage({
                text: message,
                receiverId: recipientId,
                senderId: user.uniqueId,
                id: id,
              });
              setMessages(prev => [
                ...prev,
                {
                  id: id,
                  senderId: user.uniqueId,
                  receiverId: recipientId,
                  text: message,
                },
              ]);
            }}
            onBack={() => {
              setMode('normal');
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'white',
  },
});
