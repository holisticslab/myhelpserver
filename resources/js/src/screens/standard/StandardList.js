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

import { getStandard,StandardContext,addStandard } from './standard';
import {  PromptModal } from '../../components/simplifyUi';

const StandardList = () => {

  const {std,pushStd} = useContext(StandardContext);
  let { path, url } = useRouteMatch();

  const [stdlist, setStdList] = React.useState(std);

  
  React.useEffect(() => {
    const bootstrapAsync = async () => {

      setStdList(std);
    };

    bootstrapAsync();

  }, [std]);

  const RenderStandard = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i} as={Link} to={`${url}std/${x.id}`}>
        <List.Content>
        <List.Header>{x.code}</List.Header>{x.name} 
        <List.Content floated='right'>{x.lang}</List.Content>
        
        </List.Content>
      </List.Item>
    );
    return <List className="listScroll" celled ordered divided verticalAlign='middle' selection>
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
  const submitStandard=x=>{
    addStandard(x).then(pushStd).catch(e=>console.log(e));
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
                  const filterData = std.filter(({ name,code}) =>
                  name.toLowerCase().indexOf(filter) > -1||code.toLowerCase().indexOf(filter) > -1);
                  setStdList(filterData)
                }}
                placeholder='Search Scheme...'
              />
        </Header>
        <Header as='h3' floated='left'>
        Standard List
        </Header>
        <PromptModal onSave={submitStandard}
                title="Add Standard"
                items={[
                  { value: "", label: "Standard Code",type: "text", name: "code" },
                  { value:"", label: "Standard Name",type: "text", name: "name" },
                  { value:"", label: "Language",type: "text", name: "lang" }
                ]}
                PrompButton={(props) => <Button fluid basic color='green' {...props} > <Icon name='plus' />Add Standard</Button>}
              />
      </Segment>
        {stdlist &&
          <RenderStandard data={stdlist}/>
        }   
      </div>
    </Transition>
  )
}

export default StandardList