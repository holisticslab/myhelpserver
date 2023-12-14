import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import {
  Link
} from "react-router-dom";
import {AuthContext,onAuth} from './auth';

import logo from '../../assets/img/logo.png'; 

const SignInScreen = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [process, setprocess] = React.useState(false);
    const [error, setError] = React.useState('');
  
    const { signIn } = React.useContext(AuthContext);
    const auth=(data)=>{
      
      localStorage.removeItem("logScreen");
      setprocess(true);
      setError("");
      onAuth(data).then(signIn).catch(e=>{
        setprocess(false);  
        setError(e.message)})
    }
    
return <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
    <Image src={logo} />
      <Header as='h2' color='teal' textAlign='center'>
       Audit Management System
      </Header>
      <Form size='large' onSubmit={(e) =>{ auth({ username, password });e.preventDefault();}}>
        <Segment stacked>
          <Form.Input fluid icon='user' 
          value={username}
          onChange={e=>setUsername(e.target.value)}
          iconPosition='left' placeholder='User ID' required 
          disabled={process} />
          <Form.Input
            fluid
            icon='lock'
            value={password}
            onChange={e=>setPassword(e.target.value)}
            iconPosition='left'
            placeholder='Password'
            type='password'
            required
            disabled={process}
          />
 {error &&
       <Message negative>
       <p>{error}</p>
     </Message>
      }
          <Button color='teal' fluid size='large' type="submit" 
            disabled={process} >
            Login
          </Button>
        </Segment>
      </Form>
     
      {/* <Message>
        New to us? <Link to="/register">Sign Up</Link>
      </Message> */}
    </Grid.Column>
  </Grid>
}

export default SignInScreen