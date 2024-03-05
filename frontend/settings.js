import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserEdit, faLock, faBank, faChevronRight, faBell, faInfoCircle, faShieldAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { PlaidLink, openLink} from 'react-native-plaid-link-sdk';

const SettingsScreen = ({ navigation }) => {
    const [isSwitchOn, setSwitchOn] = useState(false);
    const plaidLinkRef = useRef(null);
  
    const toggleSwitch = () => {
      setSwitchOn(previousState => !previousState);
    };
  
    const handleOnSuccess = (success) => {
      console.log('Plaid Link success: ', success);
      // Close Plaid Link after success
      if (plaidLinkRef.current) {
        plaidLinkRef.current.dismiss();
      }
      // You might want to send 'success.publicToken' to your server here to exchange for an access token
    };
  
    const handleOnExit = (exit) => {
      console.log('Plaid Link exit: ', exit);
      // You might want to handle the exit scenario here. For example:
      if (exit.error) {
        Alert.alert('Exit or Error', exit.error.message);
      }
    };

    const handleOpenLink = () => {
        openLink({
            tokenConfig: {
              token: "link-sandbox-6ea96692-32ea-40d7-9493-23671331dc42", // Replace with the actual token from Plaid
              noLoadingState: false, // Set to true to skip loading animation, if desired
              logLevel: 'ERROR', // LogLevel can be 'DEBUG', 'INFO', 'WARN', or 'ERROR'
            },
            onSuccess: handleOnSuccess,
            onExit: handleOnExit,
            // Include any additional configuration required by your SDK...
          }).catch(error => {
            console.error('Error opening Plaid Link:', error);
          });
        };
  
  



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faCog} size={24} style={styles.icon} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <FontAwesomeIcon icon={faUserEdit} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>Edit profile</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.itemArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <FontAwesomeIcon icon={faLock} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>Change password</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.itemArrow} />
        </TouchableOpacity>

        
        <TouchableOpacity style={styles.item} onPress={handleOpenLink}>
          <FontAwesomeIcon icon={faBank} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>Link your bank account</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.itemArrow} />
        </TouchableOpacity>
    
      
     
        
        

        <View style={styles.item}>
          <FontAwesomeIcon icon={faBell} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>Push notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isSwitchOn ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isSwitchOn}
            style={styles.toggle}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <FontAwesomeIcon icon={faInfoCircle} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>About us</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.itemArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <FontAwesomeIcon icon={faShieldAlt} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>Privacy policy</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.itemArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <FontAwesomeIcon icon={faShieldAlt} size={18} style={styles.itemIcon} />
          <Text style={styles.itemText}>Terms and conditions</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} style={styles.itemArrow} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    color: '#6c757d',
  },
  section: {
    marginTop: 35,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  item: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d6',
  },
  itemIcon: {
    color: '#6c757d',
    width: 24,
    marginRight: 32,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemArrow: {
    color: '#6c757d',
  },
  toggle: {
    marginLeft: 'auto',
  },
});

export default SettingsScreen;
