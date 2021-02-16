import React from 'react'
import { Input, Menu, Segment ,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Sidebar,
    
} from 'semantic-ui-react';
import logo from '../assets/img/initialWhite.png'; 

import {AuthContext} from './auth/auth';

const HomeScreen = () => {
    const [visible, setVisible] = React.useState(true)
    const [activeItem, setactiveItem] = React.useState('home')
    const { profile } = React.useContext(AuthContext);
  return (
    <div>
    
              <Header as='h3'>Application Content</Header>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
           
  </div>
  )
}

export default HomeScreen