import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { enabledSrcLanguages } from '../languages';

export type Gender = 'male' | 'female';


const genderOptions = [
  { id: 'Male', code: 'male' },
  { id: 'Female', code: 'female' },
];

type GenderPickerModalProps = {
  showGenderPickerModal: boolean;
  setShowGenderPickerModal: (show: boolean) => void;
  gender: Gender
  setGender: React.Dispatch<React.SetStateAction<Gender>>;
  srcLang: string;
  setSrcLang: React.Dispatch<React.SetStateAction<string>>;
};
const GenderPickerModal: React.FC<GenderPickerModalProps> = props => {

  const handleGenderSelect = (gender: Gender) => {
    props.setGender(gender);
  };

  const handleLanguageSelect = (lang: string) => {
    props.setSrcLang(lang);
  };

  const handleClose = () => {
    props.setShowGenderPickerModal(false);
  };

  const handleAction = () => {
    props.setShowGenderPickerModal(false);
  };

  return (
    <Modal
      visible={props.showGenderPickerModal}
      transparent
      animationType="slide"
      //   onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <View style={styles.handle} />
        <Text style={styles.title}>Select Preferences</Text>

        {/* Gender Section */}
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.grid}>
          {genderOptions.map(opt => {
            const isSelected = props.gender === opt.code;
            return (
              <TouchableOpacity
                key={opt.code}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => handleGenderSelect(opt.code as Gender)}
              >
                <Text
                  style={[styles.optionText, isSelected && styles.selectedText]}
                >
                  {opt.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Language Section */}
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.grid}>
          {enabledSrcLanguages.map(lang => {
            const isLangSelected = props.srcLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.optionButton,
                  isLangSelected && styles.selectedButton,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isLangSelected && styles.selectedText,
                  ]}
                >
                  {lang.id} {lang.symbol}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.doneButton,
            (!props.gender || !props.srcLang) && {
              backgroundColor: '#CCCCCC',
            },
          ]}
          disabled={!props.gender || !props.srcLang}
          onPress={handleAction}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    backgroundColor: '#FFFFFF',
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
    fontWeight: '400',
    color: '#666666',
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232323',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#232323',
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionButton: {
    width: '30%',
    paddingVertical: 10,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#FF6600', // Orange accent
    backgroundColor: '#FFF5EB', // Light orange background
  },
  optionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#232323',
  },
  selectedText: {
    fontWeight: '600',
    color: '#FF6600', // Orange accent
  },
  doneButton: {
    backgroundColor: '#FF6600', // Orange accent
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default GenderPickerModal;
