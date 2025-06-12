import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Button,
} from 'react-native';

import { moderateScale } from 'react-native-size-matters';

const categories = ['All', 'Health', 'Ayurveda', 'Nutrition', 'Mental Wellness'];

const ForumScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      category: 'Health',
      text: 'How to improve immunity?',
      likes: 2,
      dislikes: 0,
      answers: [
        { id: 1, text: 'Eat healthy and sleep well.', likes: 0, dislikes: 0 },
      ],
    },
    {
      id: 2,
      category: 'Ayurveda',
      text: 'Best herbs for digestion?',
      likes: 1,
      dislikes: 1,
      answers: [],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState(categories[0]);

  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [newAnswerText, setNewAnswerText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredQuestions = questions.filter(q => {
    const categoryMatch = selectedCategory === 'All' || q.category === selectedCategory;
    const searchMatch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const addQuestion = () => {
    if (!newQuestionText.trim()) {
      Alert.alert('Error', 'Please enter a question.');
      return;
    }
    setQuestions(prev => [
      {
        id: Date.now(),
        category: newQuestionCategory,
        text: newQuestionText.trim(),
        likes: 0,
        dislikes: 0,
        answers: [],
      },
      ...prev,
    ]);
    setNewQuestionText('');
    setModalVisible(false);
  };

  const addAnswer = () => {
    if (!newAnswerText.trim()) {
      Alert.alert('Error', 'Please enter an answer.');
      return;
    }
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === currentQuestionId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              { id: Date.now(), text: newAnswerText.trim(), likes: 0, dislikes: 0 },
            ],
          };
        }
        return q;
      })
    );
    setNewAnswerText('');
    setAnswerModalVisible(false);
  };

  const incrementAnswerLike = (questionId, answerId) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(a =>
              a.id === answerId ? { ...a, likes: (a.likes || 0) + 1 } : a
            ),
          };
        }
        return q;
      })
    );
  };

  const incrementAnswerDislike = (questionId, answerId) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(a =>
              a.id === answerId ? { ...a, dislikes: (a.dislikes || 0) + 1 } : a
            ),
          };
        }
        return q;
      })
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Loading forum discussions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Welcome to Amrutam Forum 👋</Text>
            <Text style={styles.bannerSubtitle}>
              Join discussions, ask questions, and learn from the community.
            </Text>
          </View>

          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Search questions or thoughts..."
            placeholderTextColor="#a0a0a0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryTag,
                  selectedCategory === category && styles.categoryTagSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Questions */}
          <Text style={styles.sectionTitle}>🔥 Trending Discussions</Text>
          {filteredQuestions.length === 0 ? (
            <Text style={styles.noQuestionsText}>No questions found.</Text>
          ) : (
            filteredQuestions.map(question => (
              <View key={question.id} style={styles.questionCard}>
                <Text style={styles.questionCategory}>{question.category}</Text>
                <Text style={styles.questionText}>{question.text}</Text>

                <View style={styles.questionActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentQuestionId(question.id);
                      setAnswerModalVisible(true);
                    }}
                    style={styles.answerButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.answerButtonText}>+ Add Answer</Text>
                  </TouchableOpacity>
                </View>

                {/* Answers */}
                {question.answers.length > 0 && (
                  <View style={styles.answersContainer}>
                    {question.answers.map(answer => (
                      <View key={answer.id} style={styles.answerCard}>
                        <Text style={styles.answerText}>{answer.text}</Text>
                        <View style={styles.answerLikesRow}>
                          <TouchableOpacity
                            onPress={() => incrementAnswerLike(question.id, answer.id)}
                            style={styles.likeButton}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.likeDislikeText}>👍 {answer.likes || 0}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => incrementAnswerDislike(question.id, answer.id)}
                            style={styles.dislikeButton}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.likeDislikeText}>👎 {answer.dislikes || 0}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}

          {/* Ask Question Button */}
          <TouchableOpacity
            style={styles.askButton}
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.askButtonText}>+ Ask a Question</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal for new question */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add a New Question</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Type your question here"
                value={newQuestionText}
                onChangeText={setNewQuestionText}
                multiline
                placeholderTextColor="#999"
              />

              <Text style={styles.modalLabel}>Select Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: moderateScale(20) }}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setNewQuestionCategory(category)}
                    style={[
                      styles.categoryTag,
                      newQuestionCategory === category && styles.categoryTagSelected,
                      { marginRight: moderateScale(10) },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        newQuestionCategory === category && styles.categoryTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#888" />
                <Button title="Add" onPress={addQuestion} color="#1B5E20" />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for adding answer */}
        <Modal visible={answerModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add an Answer</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Type your answer here"
                value={newAnswerText}
                onChangeText={setNewAnswerText}
                multiline
                placeholderTextColor="#999"
              />

              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setAnswerModalVisible(false)} color="#888" />
                <Button title="Add" onPress={addAnswer} color="#1B5E20" />
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FFF9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  loadingText: {
    marginTop: moderateScale(12),
    fontSize: moderateScale(16),
    color: '#1B5E20',
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FFF9',
    paddingHorizontal: moderateScale(20),
  },
  banner: {
    marginTop: moderateScale(22),
    marginBottom: moderateScale(18),
  },
  bannerTitle: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: '#1B5E20',
    letterSpacing: 0.4,
  },
  bannerSubtitle: {
    fontSize: moderateScale(15),
    color: '#4a4a4a',
    marginTop: moderateScale(8),
    lineHeight: moderateScale(22),
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: moderateScale(14),
    borderRadius: moderateScale(18),
    fontSize: moderateScale(15),
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: moderateScale(18),
    color: '#333',
    shadowColor: '#4caf50',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  categoryScroll: {
    marginBottom: moderateScale(20),
  },
  categoryTag: {
    paddingVertical: moderateScale(9),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(30),
    backgroundColor: '#E8F5E9',
    marginRight: moderateScale(12),
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#66bb6a',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
  },
  categoryTagSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
    shadowColor: '#1B5E20',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  categoryText: {
    color: '#2E7D32',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: moderateScale(14),
    marginTop: moderateScale(6),
    letterSpacing: 0.4,
  },
  noQuestionsText: {
    fontStyle: 'italic',
    color: '#666',
    marginVertical: moderateScale(20),
    fontSize: moderateScale(15),
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    shadowColor: '#1B5E20',
    shadowOpacity: 0.12,
    shadowRadius: moderateScale(10),
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  questionCategory: {
    color: '#388E3C',
    fontWeight: '700',
    marginBottom: moderateScale(8),
    fontSize: moderateScale(14),
    letterSpacing: 0.3,
  },
  questionText: {
    fontSize: moderateScale(16),
    color: '#2E2E2E',
    marginBottom: moderateScale(12),
    lineHeight: moderateScale(22),
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: moderateScale(10),
  },
  answerButton: {
    backgroundColor: '#388E3C',
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(22),
    shadowColor: '#2E7D32',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  answerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  answersContainer: {
    marginTop: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: '#d0f0c0',
    paddingTop: moderateScale(12),
  },
  answerCard: {
    backgroundColor: '#E6F4EA',
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(8),
    shadowColor: '#a5d6a7',
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(5),
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  answerText: {
    color: '#2E7D32',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  answerLikesRow: {
    flexDirection: 'row',
    marginTop: moderateScale(8),
  },
  likeButton: {
    marginRight: moderateScale(24),
  },
  dislikeButton: {
    marginRight: moderateScale(24),
  },
  likeDislikeText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#2E7D32',
  },
  askButton: {
    marginTop: moderateScale(28),
    backgroundColor: '#2E7D32',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(36),
    alignItems: 'center',
    marginBottom: moderateScale(50),
    shadowColor: '#2E7D32',
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(7),
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  askButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: moderateScale(18),
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 56, 15, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(18),
    padding: moderateScale(24),
    elevation: 8,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: 5 },
  },
  modalTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: moderateScale(20),
    color: '#1B5E20',
    letterSpacing: 0.4,
  },
  modalInput: {
    backgroundColor: '#F0F8F0',
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    fontSize: moderateScale(16),
    height: moderateScale(100),
    textAlignVertical: 'top',
    marginBottom: moderateScale(16),
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  modalLabel: {
    fontWeight: '700',
    marginBottom: moderateScale(12),
    color: '#4A4A4A',
    fontSize: moderateScale(15),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ForumScreen;