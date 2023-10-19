import React from 'react';
import { useRouteMatch, useParams, useHistory } from "react-router-dom";

import {
    Input,
    Button,
    Container,
    Header,
    Icon,
    Segment, Form,
} from 'semantic-ui-react'
import { MeetingContext, getmeeting } from './function';
import CryptoES from 'crypto-es';


const MeetingInfo = () => {

    const { session } = useParams();
    const [mobile, setMobile] = React.useState(false);
    const [rawdata, setRawData] = React.useState(null);
    const [info, setInfo] = React.useState(null);
    const [passcode, setPasscode] = React.useState("");
    let { path, url } = useRouteMatch();
    const history = useHistory();

    const {setData} = React.useContext(MeetingContext);

    React.useEffect(() => {

        const bootstrapAsync = async () => {
            getmeeting(session).then(({ data, ...x }) => {
                setInfo(x);
                setRawData(data)
            }).catch(e => console.log(e))
        };

        bootstrapAsync();

    }, []);

    return <Segment
        inverted
        textAlign='center'
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        vertical
    >
        {info && <Container text>
            <Header
                as='h1'
                content={info.title}
                inverted
                style={{
                    fontSize: mobile ? '1.5em' : '2em',
                    fontWeight: 'normal',
                    marginBottom: 0,
                    // marginTop: mobile ? '1.5em' : '3em',
                }}
            />
            <Header
                as='h2'
                inverted
                style={{
                    fontSize: mobile ? '1.5em' : '1.7em',
                    fontWeight: 'normal',
                    marginTop: mobile ? '0.5em' : '1.5em',
                }}
            >
                {info.premise.name}
                <Header.Subheader>
                    {info.premise.address}
                </Header.Subheader>
            </Header>
            <Form inverted onSubmit={e => {
                e.preventDefault();
                try {
                    let data = CryptoES.AES.decrypt(rawdata, passcode).toString(CryptoES.enc.Utf8)
                    let r = (Math.random() + 1).toString(36).substring(7);
                    sessionStorage.setItem(`${r}_code`,CryptoES.SHA1(passcode));

                    setData({info,...JSON.parse(data)});
                        history.replace(`./dashboard/${r}`)
                    // console.log(data);
                } catch (e) {
                    alert("salah kod")
                }
            }}>
                <Form.Field>
                    <label>Password</label>
                    <Input required size='huge' type="password" focus placeholder='TAC' onChange={(e) => setPasscode(e.target.value)} />
                </Form.Field>
                <Button primary size='huge' type="submit">
                    Get Started
                    <Icon name='right arrow' />
                </Button>
            </Form>

        </Container>}
    </Segment>
}


export default MeetingInfo;