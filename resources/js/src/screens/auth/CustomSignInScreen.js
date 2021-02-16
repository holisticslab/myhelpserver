import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import {
  Link
} from "react-router-dom";
import {AuthContext,onAuth} from './auth';

import logo from '../../assets/img/logo.png'; 

const SignInScreen = ({data,id,link}) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [process, setprocess] = React.useState(false);
    const [error, setError] = React.useState('');

    const [appName, setAppName] = React.useState('Audit Management System');
    const [thmcolor, setThmcolor] = React.useState(null);
    const [applogo, setApplogo] = React.useState(null);
    const [textColor, setTextColor] = React.useState(null);

  
    React.useEffect(() => {
      const bootstrapAsync = async () => {
        // console.log(props);
        setAppName(data.appName);
        setThmcolor(data.headerColor);
        setTextColor(data.headerTextColor);
        setApplogo(data.fullLogo);
      };
  
      bootstrapAsync();
  
    }, [data,id]);

    const { signIn } = React.useContext(AuthContext);
    const auth=(data)=>{
      // Store
      localStorage.setItem("logScreen",link);
      setprocess(true);
      setError("");
      onAuth(data).then(signIn).catch(e=>{
        setprocess(false);  
        setError(e.message)})
    }
    
return <Grid centered textAlign='center' style={{ height: '100vh', backgroundColor:thmcolor }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
    <Image src={applogo?applogo:logo} size="medium" centered />
      <Header as='h2' color={!textColor&&'teal'} style={{color:textColor}} textAlign='center'>
       {appName}
      </Header>
      <Form size='large' onSubmit={(e) =>{ auth({ username, password,id });e.preventDefault();}}>
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
          <Button color={!thmcolor&&'teal'} style={{color:textColor,backgroundColor:thmcolor}} fluid size='large' type="submit" 
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