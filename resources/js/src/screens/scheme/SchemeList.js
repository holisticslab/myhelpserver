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

import {Switch,Route,Link,useRouteMatch,useHistory} from "react-router-dom";

import { getScheme,SchemeContext,migrateData,deleteScheme,saveScheme } from './scheme';
import {  PromptModal } from '../../components/simplifyUi';

const SchemeList = () => {

  const history=useHistory();
  const [schmes, setScheme] = React.useState(null);
  let { path, url } = useRouteMatch();
  const [isLoading, setLoading] = React.useState(false);
  const [filteredScheme, setFilteredScheme] = React.useState(schmes);

  React.useEffect(() => {
    const bootstrapAsync=async()=>{
      getScheme().then(x => {
        reloadData(x);
      });
    }
    bootstrapAsync();
  }, [])

 const reloadData=x=>{
   setScheme(x)
   setFilteredScheme(x);
 }
  const RenderScheme = props => {
    // console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i}>
        <List.Content  as={Link} to={`${url}/${x.id}`}>
        {x.cklistName}
        </List.Content>
        <List.Content floated='right'>
          {/* v{x.cklistData[0].version}  */}
        <Button onClick={()=>{
           let text;
           if (confirm("Are you sure to delete this?") == true) {
            deleteScheme({id:x.id}).then(x=>reloadData(x))
           } 
          }}  size='medium' circular  basic color='red' icon='trash alternate' />
        </List.Content>
      </List.Item>
    );
    return<React.Fragment>
       <Dimmer active={isLoading}>
        <Loader>Loading</Loader>
      </Dimmer>
      {/* <Button fluid onClick={()=>migrate()} basic color='green' > <Icon name='plus' />Migrate from QCMSv2</Button> */}
        <List className="clientUserTable" celled ordered  verticalAlign='middle'>
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
        <PromptModal onSave={x=>saveScheme(x).then(({schm,id})=>{
          reloadData(schm);
          history.push(`${url}/editor/${id}/draft`)
        })}
                title="Add Scheme"
                items={[
                  { value: "", label: "Scheme Name",type: "text", name: "name" ,required:true},
                //   { value:"", label: "Scheme Standard",type: "ddl", name: "std", options:[{ key: -1,
                //     text: "",
                //     value: ""},...categories.map((x,i)=>{
                //   return{ key: i,
                //   text: x,
                //   value: x}
                // })] }
                ]}
                PrompButton={(props) => <Button fluid basic color='green' {...props} > <Icon name='plus' />Add Scheme</Button>}
              />
      </Segment>
        {filteredScheme &&
          <RenderScheme data={filteredScheme}/>
        }   
      </div>
    </Transition>
  )
}

export default SchemeList