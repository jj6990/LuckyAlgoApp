import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';

const CATEGORIES = ['For You', 'Travel', 'Food', 'Nature', 'Art', 'Sports'];

const EXPLORE_POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    category: 'Travel',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f',
    category: 'Nature',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1682687982183-c2937a74df3d',
    category: 'Food',
  },
];

export default function Explore() {
  return (
    <ScrollView style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category, index) => (
          <Pressable 
            key={index}
            style={[
              styles.categoryButton,
              index === 0 && styles.categoryButtonActive
            ]}
          >
            <Text 
              style={[
                styles.categoryText,
                index === 0 && styles.categoryTextActive
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.grid}>
        {EXPLORE_POSTS.map((post) => (
          <Pressable key={post.id} style={styles.gridItem}>
            <Image source={{ uri: post.image }} style={styles.gridImage} />
          </Pressable>
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
  categories: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesContent: {
    padding: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});