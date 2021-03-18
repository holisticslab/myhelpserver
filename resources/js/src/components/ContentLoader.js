import React from 'react'
import { Button, Header, Icon, Modal,Loader } from 'semantic-ui-react'

const ContentLoader=(props) =>{
  return (
    <Modal
      basic
      closeOnEscape={false}
      closeOnDimmerClick={false}
      {...props}
    >
      <Modal.Content>
      <Loader size='large'>Loading</Loader>
      </Modal.Content>
    </Modal>
  )
}

export default ContentLoader;

