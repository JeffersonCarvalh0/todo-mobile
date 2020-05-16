import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Card, IconButton, Text} from 'react-native-paper';

import EditTodoModal from './EditTodoModal';

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

interface Props {
  todo: {
    title: string;
    description: string;
    id?: number;
    done: boolean;
  };
  onEditCancel: Function;
  onSave: Function;
}

const TodoCard = ({todo, onSave, onEditCancel}: Props) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <EditTodoModal
        todo={todo}
        close={() => setShowEditModal(false)}
        isVisible={showEditModal}
        onSave={onSave}
        onEditCancel={onEditCancel}
      />
      <StyledCard>
        <Card.Title
          title={todo.title}
          right={(props) => (
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => setShowEditModal(true)}
            />
          )}
        />
        <Card.Content>
          <Text>{todo.description}</Text>
        </Card.Content>
      </StyledCard>
    </>
  );
};

export default TodoCard;
