import React,{useContext } from 'react'
import {
  Input, Menu, Segment,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Sidebar,
  Transition,
  List,
  Button,Dimmer,Loader
} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import { getScheme,SchemeContext,migrateData } from './scheme';

const SchemeList = () => {

  const {schmes} = useContext(SchemeContext);
  let { path, url } = useRouteMatch();
  const [isLoading, setLoading] = React.useState(false);
  const [filteredScheme, setFilteredScheme] = React.useState(schmes);

  React.useEffect(() => {
    const bootstrapAsync=async()=>{
      setFilteredScheme(schmes);
    }
    bootstrapAsync();
  }, [schmes])

  const migrate=()=>{
    setLoading(true);
    migrateData().then(x=>{
      console.log(x);
      setLoading(false);
    }).catch(e=>{
      setLoading(false);
      console.log(e);
    })
  }
  const RenderScheme = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i}>
        <List.Content  as={Link} to={`${url}/details/${i}`}>
        {x.cklistName}
        </List.Content>
        <List.Content floated='right'>v{x.cklistData[0].version} 
        <Button onClick={()=>{}}  size='medium' circular  basic color='red' icon='trash alternate' />
        </List.Content>
      </List.Item>
    );
    return<React.Fragment>
       <Dimmer active={isLoading}>
        <Loader>Loading</Loader>
      </Dimmer>
      {/* <Button fluid onClick={()=>migrate()} basic color='green' > <Icon name='plus' />Migrate from QCMSv2</Button> */}
        <List className="listScroll" celled ordered  verticalAlign='middle'>
          {listItems}
        </List>
    </React.Fragment>
  }
  return (

    <Transition transitionOnMount={true} animation="fade" duration={1000}>
      <div className="in innerContainer">
      <Segment basic clearing style={{padding:0}}>
        <Header as='h6' floated='right'>
        <Input 
                icon={{ name: 'search', link: true }}
                onChange={e=>{
                  let filter=e.target.value.toLowerCase()
                  const filterData = schmes.filter(({ cklistName}) =>
                  cklistName.toLowerCase().indexOf(filter) > -1);
                  setFilteredScheme(filterData)
                }}
                placeholder='Search Scheme...'
              />
        </Header>
        <Header as='h3' floated='left'>
        Scheme List
        </Header>
      </Segment>
        {filteredScheme &&
          <RenderScheme data={filteredScheme}/>
        }   
      </div>
    </Transition>
  )
}

export default SchemeList