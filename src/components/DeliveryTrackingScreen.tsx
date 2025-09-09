import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LanguagePickerModal from './LanguagePickerModal';
import { useState } from 'react';

type DeliveryTrackingScreenProps = {
  onStartCall: (recipientId: string, tgtLang: string) => void;
  onChat: () => void;
  userId: string;
  setRecipientId: (recipientId: string) => void;
  recipientId: string;
  setTargetLangForChat: React.Dispatch<React.SetStateAction<string>>;
  setShowGenderPickerModal: (show: boolean) => void;
};

const DeliveryTrackingScreen = (props: DeliveryTrackingScreenProps) => {
  const { onStartCall, onChat, userId, setRecipientId, recipientId, setShowGenderPickerModal } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'outgoing-call' | 'chat' | null>(null);

  const handleLangBtnClick = (
    lang: string,
    modalContext: 'incoming-call' | 'outgoing-call' | 'chat',
  ) => {
    if (modalContext === 'outgoing-call') {
      props.setTargetLangForChat(lang);
      onStartCall(recipientId.trim(), lang);
      return;
    } else if (modalContext === 'chat') {
      props.setTargetLangForChat(lang);
      onChat();
      return;
    } else if (modalContext === 'incoming-call') {
      // Handle incoming call logic here
    }
  };

  const openModal = (mode: 'outgoing-call' | 'chat') => {
    setModalMode(mode);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMode(null);
  };

  const handleCall = () => {
    openModal('outgoing-call');
  };

  const handleChat = () => {
    openModal('chat');
  };

  const handleChangePreferences = () => {
    console.log('Change Preferences Pressed');
    setShowGenderPickerModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Map Image */}
      <Image
        source={require('../assets/map.png')}
        style={styles.backgroundMap}
        resizeMode="cover"
      />

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={() => console.log('Logout pressed')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Map Overlay for route simulation */}
      <View style={styles.mapOverlay}>
        <View style={styles.routeLine} />
        <View style={[styles.marker, styles.startMarker]}>
          <Text style={styles.markerText}>🍔</Text>
        </View>
        <View style={[styles.marker, styles.endMarker]}>
          <Text style={styles.markerText}>📍</Text>
        </View>
      </View>

      {/* Content Container */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Info Card */}
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <View style={styles.bagIcon}>
              <Text style={styles.bagEmoji}>🛍️</Text>
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>Delivering Your Order</Text>
              <Text style={styles.deliveryTime}>Coming within 30 minutes</Text>
            </View>
          </View>

          {/* Order Details */}
          <View style={styles.orderDetails}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderTitle}>
                Prime Beef - Pizza Beautifu...
              </Text>
              <View style={styles.orderMeta}>
                <Text style={styles.orderPrice}>$ 20.99</Text>
                <Text style={styles.orderItems}>• 2 Items</Text>
                <Text style={styles.paymentMethod}>• Credit Card</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline and Driver Info Card */}
        <View style={styles.trackingCard}>
          {/* Location Timeline */}
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, styles.timelineIconActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  Burger King - 1453 Ave Los Angeles
                </Text>
                <Text style={styles.timelineSubtitle}>
                  Restaurant • 13:00 PM
                </Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineItem}>
              <View style={styles.timelineIcon} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  You - 49th St Los Angeles, California
                </Text>
                <Text style={styles.timelineSubtitle}>Home • 13:30 PM</Text>
              </View>
            </View>
          </View>

          {/* Driver Info */}
          <View style={styles.driverSection}>
            <View style={styles.driverInfo}>
              <Image
                source={{
                  uri: 'https://picsum.photos/200/300',
                }}
                style={styles.driverAvatar}
              />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{userId}</Text>
                <Text style={styles.driverId}>Delivery • 0104425765</Text>
              </View>
            </View>

            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                <Text style={styles.actionButtonText}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={handleChat}
              >
                <Text style={styles.actionButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Preferences Button */}
          <TouchableOpacity style={styles.preferencesButton} onPress={handleChangePreferences}>
            <Text style={styles.preferencesText}>Change Preferences</Text>
          </TouchableOpacity>
        </View>
        {modalMode && (
          <LanguagePickerModal
            visible={isModalVisible}
            modalContext={modalMode}
            onClose={closeModal}
            onBtnClick={handleLangBtnClick}
          />
        )}
      </ScrollView>

      {/* Bottom Navigation - Fixed at bottom */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⋯</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📱</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logoutContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  logoutText: {
    color: 'black',
    backgroundColor: 'orange',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  preferencesButton: {
    marginTop: 8,
    backgroundColor: '#FF6600',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
  },
  preferencesText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  backgroundMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  routeLine: {
    position: 'absolute',
    width: 200,
    height: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  marker: {
    position: 'absolute',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startMarker: {
    backgroundColor: '#FF6B6B',
    top: '30%',
    left: '25%',
  },
  endMarker: {
    backgroundColor: '#4A90E2',
    bottom: '35%',
    right: '20%',
  },
  markerText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
    paddingHorizontal: 20,
    paddingBottom: 75,
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bagIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bagEmoji: {
    fontSize: 24,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  detailsButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  timeline: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 15,
  },
  timelineIconActive: {
    backgroundColor: '#4A90E2',
  },
  timelineContent: {
    flex: 1,
    paddingVertical: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  timelineSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  timelineLine: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5.5,
    marginVertical: 4,
  },
  driverSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  driverId: {
    fontSize: 12,
    color: '#666',
  },
  driverActions: {
    flexDirection: 'row',
  },
  callButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FF6B6B',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageButton: {
    width: 44,
    height: 44,
    backgroundColor: '#4A90E2',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    zIndex: 3,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    color: '#666',
  },
  input: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
  },
});