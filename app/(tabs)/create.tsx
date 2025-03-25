import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Create() {
  return (
    <View style={styles.container}>
      <View style={styles.imageUpload}>
        <Ionicons name="image-outline" size={48} color="#666" />
        <Text style={styles.uploadText}>Tap to upload a photo</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write a caption..."
        multiline
        numberOfLines={4}
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Share Moment</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});