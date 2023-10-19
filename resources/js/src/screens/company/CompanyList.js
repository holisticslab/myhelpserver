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
  Button
} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import { getCompany,CompanyContext,updateCompany } from './company';
import {  PromptModal } from '../../components/simplifyUi';

const CompanyList = () => {

  const { cmpny,updList} = React.useContext(CompanyContext);
  let { path, url } = useRouteMatch();

  const addCmpny =({name,address})=>{
    updateCompany({cmpnyName:name,cmpnyDetails:{address}}).then(k=>{console.log(k);updList()})
  }
  
  const RenderCompany = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i} as={Link} to={`${url}/details/${i}`}>
        <List.Content>
        <List.Header>{x.cmpnyName}</List.Header>{x.cmpnyDetails.address}
        {/* <List.Content floated='right'>{x.lang}</List.Content> */}
        
        </List.Content>
      </List.Item>
    );
    return <List className="clientUserTable" celled ordered divided verticalAlign='middle' selection>
      {listItems}
      {/* <List.Item>
              Dogs
            <List.List>
                <List.Item>Labradoodles</List.Item>
                <List.Item>Shiba Inu</List.Item>
                <List.Item>Mastiff</List.Item>
              </List.List>
            </List.Item> */}
    </List>
  }
  return (

    <Transition transitionOnMount={true} animation="fade" duration={1000}>
      <div className="in innerContainer">
        <Header as='h3'>Company List</Header>
        <PromptModal onSave={addCmpny}
                title="Add Company"
                items={[
                  { value: "", label: "Company Name",type: "text", name: "name" },
                  { value:"", label: "Company Address",type: "text", name: "address" }
                ]}
                PrompButton={(props) => <Button fluid basic color='green' {...props} > <Icon name='plus' />Add Company</Button>}
              />
        {cmpny &&
          <RenderCompany data={cmpny}/>
        }   
      </div>
    </Transition>
  )
}

export default CompanyList