import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import {
    Link
  } from "react-router-dom";
import {AuthContext} from './auth';

const RegisterScreen = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    const { signIn } = React.useContext(AuthContext);
    
return <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
        <Image src='/images/logo.jpeg' />Holistics Checklist Management System
      </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='User ID' />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
          />

          <Button color='teal' fluid size='large' onClick={() => signIn({ username, password })} >
            Sign Up
          </Button>
        </Segment>
      </Form>
      <Message>
        Already have account? <Link to="/">back to Login</Link>
      </Message>
    </Grid.Column>
  </Grid>
}

export default RegisterScreen