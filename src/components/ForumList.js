import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Sample forum data (can be fetched from an API later)
const initialData = {
  questions: [
    { id: 1, user: 'User1', question: 'What are the benefits of Ayurveda?', likes: 10, comments: [] },
    { id: 2, user: 'User2', question: 'Can Ayurveda help with migraines?', likes: 5, comments: [] },
  ],
  thoughts: [
    { id: 1, doctor: 'Dr. Sharma', thought: 'Ayurveda is a holistic approach to health.', likes: 15 },
  ],
};

const ForumList = () => {
  const [forumData, setForumData] = useState(initialData);

  const handleLikeChange = (type, id, delta) => {
    setForumData(prev => ({
      ...prev,
      [type]: prev[type].map(item =>
        item.id === id ? { ...item, likes: Math.max(0, item.likes + delta) } : item
      ),
    }));
  };

  const QuestionCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Q: {item.question}</Text>
      <Text style={styles.meta}>Posted by {item.user}</Text>
      <View style={styles.likesRow}>
        <TouchableOpacity onPress={() => handleLikeChange('questions', item.id, 1)} style={styles.likeBtn}>
          <Text style={styles.likeText}>👍</Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.likes}</Text>
        <TouchableOpacity onPress={() => handleLikeChange('questions', item.id, -1)} style={styles.likeBtn}>
          <Text style={styles.likeText}>👎</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ThoughtCard = ({ item }) => (
    <View style={[styles.card, styles.thoughtCard]}>
      <Text style={styles.title}>🧠 "{item.thought}"</Text>
      <Text style={styles.meta}>— {item.doctor}</Text>
      <View style={styles.likesRow}>
        <TouchableOpacity onPress={() => handleLikeChange('thoughts', item.id, 1)} style={styles.likeBtn}>
          <Text style={styles.likeText}>👍</Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.likes}</Text>
        <TouchableOpacity onPress={() => handleLikeChange('thoughts', item.id, -1)} style={styles.likeBtn}>
          <Text style={styles.likeText}>👎</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={styles.sectionHeader}>Community Questions</Text>
      <FlatList
        data={forumData.questions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <QuestionCard item={item} />}
        scrollEnabled={false}
      />

      <Text style={styles.sectionHeader}>Expert Thoughts</Text>
      <FlatList
        data={forumData.thoughts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ThoughtCard item={item} />}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  thoughtCard: {
    backgroundColor: '#e8f5e9',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeBtn: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  likeText: {
    fontSize: 16,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ForumList;
