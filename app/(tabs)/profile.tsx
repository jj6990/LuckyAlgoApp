import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PROFILE = {
  name: 'Sarah Wilson',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  bio: 'Adventure seeker | Photography lover',
  posts: 156,
  followers: 2453,
  following: 891,
  photos: [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f',
    'https://images.unsplash.com/photo-1682687982183-c2937a74df3d',
  ],
};

export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: PROFILE.avatar }} style={styles.avatar} />
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PROFILE.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PROFILE.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PROFILE.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.bio}>
        <Text style={styles.name}>{PROFILE.name}</Text>
        <Text style={styles.bioText}>{PROFILE.bio}</Text>
      </View>

      <Pressable style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </Pressable>

      <View style={styles.grid}>
        {PROFILE.photos.map((photo, index) => (
          <View key={index} style={styles.gridItem}>
            <Image source={{ uri: photo }} style={styles.gridImage} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bio: {
    padding: 16,
    paddingTop: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    margin: 16,
    marginTop: 0,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});