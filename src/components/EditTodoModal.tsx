import React, {useState} from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';
import {
  Modal,
  Portal,
  Card,
  Button,
  IconButton,
  Text,
  TextInput,
  HelperText,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';

import server from '../api';

interface Props {
  isVisible: boolean;
  close: Function;
  todo: {
    title: string;
    description: string;
    id?: number;
    done: boolean;
  };
  onSave: Function;
  onEditCancel?: Function;
}

const Padding = styled(View)<{value?: string}>`
  padding-vertical: ${(props) => props.value || '10px'};
`;

const TopIconsRow = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const EditTodoModal = ({
  todo,
  onEditCancel,
  onSave,
  isVisible,
  close,
}: Props) => {
  const deleteTodo = async () => {
    server.delete(`/todo/${todo.id}`).then((response) => {
      if (response.status === 200) {
        onSave();
        close();
      }
    });
  };

  const toggleDone = async () => {
    server.put(`todo/${todo.id}`, {done: !todo.done}).then((response) => {
      if (response.status === 200) {
        onSave();
        close();
      }
    });
  };

  return (
    <Portal>
      <Modal visible={isVisible} dismissable={false}>
        <Card>
          <Formik
            initialValues={{
              title: todo.title,
              description: todo.description,
            }}
            validationSchema={Yup.object({
              title: Yup.string().required(),
              description: Yup.string().required(),
            })}
            onSubmit={async (values, {setStatus}) => {
              const body = {
                title: values.title,
                description: values.description,
              };

              (todo.id
                ? server.put(`/todo/${todo.id}`, body)
                : server.post('/todo', body)
              )
                .then((response) => {
                  if (response.status === 200 || response.status === 201) {
                    onSave();
                    close();
                  }
                })
                .catch((error) => {
                  if (error.response) {
                    setStatus(error.response.data.message);
                  }
                });
            }}>
            {(formik) => (
              <>
                <Card.Title
                  right={(props) => (
                    <TopIconsRow>
                      <IconButton
                        {...props}
                        icon="content-save"
                        onPress={formik.handleSubmit}
                      />
                      <IconButton
                        {...props}
                        icon="close-circle"
                        onPress={() => {
                          formik.handleReset();
                          if (onEditCancel) {
                            onEditCancel();
                          }
                          close();
                        }}
                      />
                    </TopIconsRow>
                  )}
                />

                <View>
                  <TextInput
                    mode="outlined"
                    label="Title"
                    onChangeText={formik.handleChange('title')}
                    onBlur={formik.handleBlur('title')}
                    value={formik.values.title}
                  />
                  <HelperText
                    type="error"
                    visible={formik.touched.title && formik.errors.title}>
                    {formik.errors.title}
                  </HelperText>
                  <Padding />
                </View>

                <View>
                  <TextInput
                    multiline
                    mode="outlined"
                    label="Description"
                    onChangeText={formik.handleChange('description')}
                    onBlur={formik.handleBlur('description')}
                    value={formik.values.description}
                  />
                  <HelperText
                    type="error"
                    visible={
                      formik.touched.description && formik.errors.description
                    }>
                    {formik.errors.description}
                  </HelperText>
                  <Padding />
                </View>

                {todo.id && (
                  <Card.Actions>
                    <Button icon="delete" onPress={deleteTodo}>
                      <Text> Delete Todo </Text>
                    </Button>
                    <Button
                      icon={todo.done ? 'backup-restore' : 'check'}
                      onPress={async () => {
                        await toggleDone();
                      }}>
                      <Text>
                        {todo.done ? 'Mark as undone' : 'Mark as done'}
                      </Text>
                    </Button>
                  </Card.Actions>
                )}
              </>
            )}
          </Formik>
        </Card>
      </Modal>
    </Portal>
  );
};

export default EditTodoModal;
