import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import FotoDoDiaScreen from '../screens/FotoDoDiaScreen';
import MarteScreen from '../screens/MarteScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'FotoDoDia') {
              iconName = focused ? 'star' : 'star-outline';
            } else if (route.name === 'Marte') {
              iconName = focused ? 'planet' : 'planet-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF69B4',
          tabBarInactiveTintColor: '#FFB6C1',
          tabBarStyle: {
            backgroundColor: '#FFF0F5',
            borderTopColor: '#FFB6C1',
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#FF69B4',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="FotoDoDia" 
          component={FotoDoDiaScreen}
          options={{
            title: 'Foto do Dia',
            headerTitle: '🌟 NASA App'
          }}
        />
        <Tab.Screen 
          name="Marte" 
          component={MarteScreen}
          options={{
            title: 'Marte',
            headerTitle: '🔴 NASA App'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;