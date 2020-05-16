import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {
  withTheme,
  IconButton,
  Title,
  Subheading,
  TouchableRipple,
} from 'react-native-paper';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage';
import {Redirect} from 'react-router-native';

import server from '../api';
import FullLoading from '../components/FullLoading';
import TodoCard from '../components/TodoCard';
import EditTodoModal from '../components/EditTodoModal';

const Container = styled(ScrollView)`
  flex-direction: column;
  flex: 1;
`;

const TopRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const TodosContainer = styled(View)`
  flex-direction: column;
  align-items: stretch;
  flex: 1;
`;

const TabsContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
`;

const StyledTab = withTheme(
  styled(View)<{isActive: boolean}>`
    border-bottom-width: 1px;
    border-bottom-color: ${(props) =>
      props.isActive ? props.theme.colors.accent : 'transparent'};
    margin: 10px;
  `,
);

const AddIcon = styled(IconButton)`
  align-self: center;
`;

interface TabProps {
  children: React.ReactNode;
  onPress: Function;
  isActive: boolean;
}
const Tab = ({children, onPress, isActive}: TabProps) => (
  <TouchableRipple onPress={onPress}>
    <StyledTab isActive={isActive}>{children}</StyledTab>
  </TouchableRipple>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({name: '', email: ''});
  const [todos, setTodos] = useState<
    {title: string; description: string; done: boolean; id: number}[]
  >([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tokenExpired, setTokenExpired] = useState(false);
  const [refreshTodos, setRefreshTodos] = useState(true);
  const [newTodoBeingAdded, setNewTodoBeingAdded] = useState(false);
  const [showDoneTodos, setShowDoneTodos] = useState(false);

  const toggleRefresh = () => {
    setRefreshTodos((prev) => !prev);
  };

  const fetchUserData = async () => {
    setLoading(true);
    server
      .get('/user')
      .then((response) => {
        const body = response.data.data;
        setUserData((prev) => ({
          ...prev,
          name: body.name,
          email: body.email,
        }));
      })
      .catch((error) => {
        if (error.status === 401) {
          setTokenExpired(true);
        }
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTodos = async () => {
    setLoading(true);
    server
      .get('/todo')
      .then((response) => {
        setTodos(response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [refreshTodos]);

  return errorMessage || tokenExpired ? (
    <Redirect
      to={{
        pathname: '/login',
        state: {fetchUserDataError: errorMessage || ''},
      }}
    />
  ) : (
    <Container>
      <FullLoading show={loading} />
      <TopRow>
        <Title>Greetings, {userData.name}</Title>
        <IconButton
          icon="logout"
          onPress={async () => {
            await AsyncStorage.setItem('token', '');
            setTokenExpired(true);
          }}
        />
      </TopRow>

      <TodosContainer>
        <TabsContainer>
          <Tab
            isActive={!showDoneTodos}
            onPress={() => setShowDoneTodos(false)}>
            <Subheading>To do</Subheading>
          </Tab>
          <Tab isActive={showDoneTodos} onPress={() => setShowDoneTodos(true)}>
            <Subheading>Done</Subheading>
          </Tab>
        </TabsContainer>

        <EditTodoModal
          todo={{title: '', description: '', done: false}}
          isVisible={newTodoBeingAdded}
          close={() => setNewTodoBeingAdded(false)}
          onSave={toggleRefresh}
        />

        {!showDoneTodos && (
          <AddIcon
            icon="plus-circle"
            size={48}
            onPress={() => setNewTodoBeingAdded(true)}
          />
        )}

        {todos.length === 0 ? (
          <Subheading>No Todos were found</Subheading>
        ) : (
          todos
            .filter((todo) => (showDoneTodos ? todo.done : !todo.done))
            .map((todo) => (
              <TodoCard
                key={todo.id}
                onSave={toggleRefresh}
                todo={{
                  title: todo.title,
                  description: todo.description,
                  done: todo.done,
                  id: todo.id,
                }}
              />
            ))
        )}
      </TodosContainer>
    </Container>
  );
};

export default Dashboard;
