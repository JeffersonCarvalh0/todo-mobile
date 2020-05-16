import React from 'react';
import {Portal, Modal, ActivityIndicator} from 'react-native-paper';

const FullLoading = ({show}: {show: boolean}) => {
  return show ? (
    <Portal>
      <Modal visible={show} dismissable={false}>
        <ActivityIndicator />
      </Modal>
    </Portal>
  ) : (
    <></>
  );
};

export default FullLoading;
