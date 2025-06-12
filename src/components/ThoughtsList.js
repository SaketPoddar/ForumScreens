import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ForumContext } from '../context/ForumContext';

const ThoughtsList = () => {
  const forumContext = useContext(ForumContext);

  if (!forumContext) {
    return <Text>Loading...</Text>;
  }

  const { state } = forumContext;

  const handleLike = (id, delta) => {
    // You can implement like logic via dispatch here later
    console.log(`Like ${delta > 0 ? '+' : '-'} for Thought ID ${id}`);
  };

  if (state.thoughts.length === 0) {
    return <Text style={styles.noData}>No expert thoughts yet. Be the first to share!</Text>;
  }

  return (
    <FlatList
      data={state.thoughts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.doctor[0]}</Text>
            </View>
            <Text style={styles.doctorName}>{item.doctor}</Text>
          </View>

          <Text style={styles.thoughtText}>“{item.thought}”</Text>

          <View style={styles.likeRow}>
            <TouchableOpacity
              onPress={() => handleLike(item.id, 1)}
              style={styles.likeBtn}
            >
              <Text style={styles.likeIcon}>👍</Text>
            </TouchableOpacity>
            <Text style={styles.likeCount}>{item.likes}</Text>
            <TouchableOpacity
              onPress={() => handleLike(item.id, -1)}
              style={styles.likeBtn}
            >
              <Text style={styles.likeIcon}>👎</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  noData: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#2E7D32',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  doctorName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2E7D32',
  },
  thoughtText: {
    fontSize: 15,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeBtn: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  likeIcon: {
    fontSize: 16,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ThoughtsList;
