import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ForumScreen from './src/screens/ForumScreen';
import ThoughtsScreen from './src/screens/ThoughtsScreen';
import { ForumProvider, ForumContext } from './src/context/ForumContext'
import mockData from './src/mock/mockData.json';

const Tab = createBottomTabNavigator();

const App = () => {
  const forumContext = useContext(ForumContext);

  if (!forumContext) {
    return null; 
  }

  const { dispatch } = forumContext;

  useEffect(() => {
    dispatch({ type: 'SET_DATA', payload: mockData });
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Forum" component={ForumScreen} />
        <Tab.Screen name="Thoughts" component={ThoughtsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default () => (
  <ForumProvider>
    <App />
  </ForumProvider>
);

