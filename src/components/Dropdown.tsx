import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
  placeholder?: string;
};

export default function Dropdown<T>({
  options,
  selected,
  onSelect,
  placeholder = 'Select an option',
}: Props<T>) {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selected)?.label ?? placeholder;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownText,
            selected ? styles.selectedText : styles.placeholderText,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === selected;
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isSelected && styles.itemSelected,
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      setVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        isSelected && styles.itemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  selectedText: {
    color: '#111',
  },
  placeholderText: {
    color: '#888',
  },
  caret: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 30,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    maxHeight: 300,
    elevation: 6,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemSelected: {
    backgroundColor: '#e5f0ff',
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
  itemTextSelected: {
    fontWeight: '600',
    color: '#1a73e8',
  },
});
