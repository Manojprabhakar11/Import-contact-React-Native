/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useEffect, useState} from 'react';
import type {Node} from 'react';
import Contacts from 'react-native-contacts';
import {
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [contacts, setContacts] = useState([]);
  const [numbers, setNumbers] = useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        key={`conatact${index}`}
        style={{
          height: 50,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 8,
        }}>
        <CheckBox
          value={numbers?.includes(item?.phoneNumbers[0]?.number)}
          onValueChange={() => {
            if (numbers?.includes(item?.phoneNumbers[0]?.number)) {
              const updatedNumbers = numbers?.filter(no => {
                if (no !== item?.phoneNumbers[0]?.number) {
                  return true;
                }
              });
              setNumbers([...updatedNumbers]);
            } else {
              setNumbers([...numbers, item?.phoneNumbers[0]?.number]);
            }
          }}
          style={{alignSelf: 'center'}}
        />
        <View
          style={{
            height: 40,
            width: 40,
            backgroundColor: '#d7d7d7',
            color: '#333',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{item?.displayName?.charAt(0)}</Text>
        </View>
        <Text>{item?.displayName}</Text>
        <Text>{item?.phoneNumbers[0]?.number}</Text>
      </View>
    );
  };

  const requestContactPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )
      .then(res => {
        if (res === 'granted') {
          Contacts.getAll()
            .then(contacts => {
              setContacts(contacts);
            })
            .catch(e => {
              console.log(e);
            });
        }
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  };

  const checkContactPermission = () => {
    Contacts.checkPermission().then(permission => {
      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      if (permission === 'undefined') {
        requestContactPermission();
      }
      if (permission === 'authorized') {
        Contacts.getAll()
          .then(contacts => {
            setContacts(contacts);
          })
          .catch(e => {
            console.log(e);
          });
      }
      if (permission === 'denied') {
        requestContactPermission();
      }
    });
  };

  const handlePress = async () => {
    if (numbers.length === 0) {
      console.error('Invalid numbers array');
      return;
    }

    const phoneNumbers = numbers?.join(',');
    const url =
      Platform.OS === 'android'
        ? `sms:${phoneNumbers}?body=message user`
        : `sms:${phoneNumbers}&body=message user`;

    await Linking.openURL(url);
    //   const supported = await Linking.canOpenURL('https://google.com');
    //   if (!supported) {
    //     console.log('Unsupported url: ' + url);
    //   } else {
    //     await Linking.openURL('https://google.com');
    //   }
  };

  const getList = () => {
    checkContactPermission();
  };

  useEffect(() => {
    checkContactPermission();
  }, []);

  return (
    <SafeAreaView style={{...backgroundStyle, flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#132890',
            padding: 10,
            color: '#fff',
          }}
          onPress={() => getList()}>
          <Text style={{color: '#fff'}}>Press Here</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={{flex: 1}}
      />
      {numbers?.length !== 0 && (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#132890',
            padding: 10,
          }}
          onPress={handlePress}>
          <Text style={{color: '#fff'}}>Send Message</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default App;
