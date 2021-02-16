import React from 'react'
import { Transition, Form, Label, Header, Image, Message, Progress,Loader } from 'semantic-ui-react'
import {
  Link
} from "react-router-dom";

import logo from '../assets/img/logo.png'; 

const FlashScreen = ({msg,config}) => {
  
return <div className="flexcenter" style={{backgroundColor:config?config.headerColor:"white"}}>
    <Transition transitionOnMount={true} animation='scale' duration={5000}>
    {config? config.fullLogo? <Image src={config.fullLogo} style={{height:'20vh',objectFit:'contain'}} />:<Image src={logo} />:<Image src={logo} />}
        </Transition>
    
        {!config &&
    <div style={{ width: '50vw' }}>
   
    <Transition transitionOnMount={true}  animation='slide right' duration={3000}>
     <Progress percent={100} active color="green"/>
        </Transition>
    </div>
}
{config&& <Loader indeterminate />}
{msg &&<Header as='h2' textAlign='center' style={{color:config?config.headerTextColor:"black"}}>
      
      <Header.Content>{msg}</Header.Content>
      
      </Header>
}
  </div>
}

export default FlashScreen