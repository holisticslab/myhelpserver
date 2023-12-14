import React from 'react'
import { Transition, Form, Label, Header, Image, Message, Progress } from 'semantic-ui-react'
import {
  Link
} from "react-router-dom";

import logo from '../assets/img/logo.png'; 

const FlashScreen = () => {
  
return <div className="flexcenter">
    <Transition transitionOnMount={true} animation='scale' duration={5000}>
    <Image src={logo} />
        </Transition>
    
    <div style={{ width: '50vw' }}>
    <Transition transitionOnMount={true}  animation='slide right' duration={3000}>
    <Progress percent={100} active color="green"/>
        </Transition>
    
    </div>
    {/* <Header as='h2' textAlign='center'>
      <Header.Content>Loading...</Header.Content>
    </Header> */}
  </div>
}

export default FlashScreen