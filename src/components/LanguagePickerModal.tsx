import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { enabledLanguages } from '../languages';

type LanguagePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  modalContext: 'incoming-call' | 'outgoing-call' | 'chat';
  onBtnClick: (
    lang: string,
    modalContext: 'incoming-call' | 'outgoing-call' | 'chat',
  ) => void;
};

const languages = enabledLanguages;

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  visible,
  onClose,
  modalContext,
  onBtnClick,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0].code,
  );

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleAction = () => {
    if (!selectedLanguage) return;
    onBtnClick(selectedLanguage, modalContext);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <View style={styles.handle} />
        <Text style={styles.title}>
          Select language to {modalContext === 'chat' ? 'Chat' : 'Call'}
        </Text>

        <View style={styles.grid}>
          {languages.map(lang => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text
                  style={[
                    styles.languageText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {lang.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.callButton,
            !selectedLanguage && { backgroundColor: '#ccc' },
          ]}
          disabled={!selectedLanguage}
          onPress={handleAction}
        >
          <Text style={styles.callText}>
            {modalContext === 'chat' ? '💬 Chat' : '📞 Call'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#666',
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  languageButton: {
    width: '30%',
    paddingVertical: 10,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#f60',
    backgroundColor: '#fff5eb',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#f60',
    fontWeight: '600',
  },
  moreText: {
    textAlign: 'center',
    color: '#f60',
    marginVertical: 12,
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#f60',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  callText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LanguagePickerModal;
