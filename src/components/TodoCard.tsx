import React from 'react';
import styled from 'styled-components/native';
import {Card, IconButton, Text} from 'react-native-paper';

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
  onEditCancel?: Function;
  onSave?: Function;
}

const TodoCard = ({todo}: Props) => {
  return (
    <StyledCard>
      <Card.Title
        title={todo.title}
        right={(props) => <IconButton {...props} icon="pencil" />}
      />
      <Card.Content>
        <Text>{todo.description}</Text>
      </Card.Content>
    </StyledCard>
  );
};

export default TodoCard;
