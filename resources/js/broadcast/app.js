import React from 'react';
import { Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import MeetingInfo from './meetingInfo';
import Dashboard from './dashboard';
import Ncr from './ncr';
import { MeetingContext } from './function'

const App = () => {
    let { path, url } = useRouteMatch();
    const [data, setData] = React.useState(null);

    const context = React.useMemo(
        () => ({ data,setData }),
        [data]
    );


    return <MeetingContext.Provider value={context}><Switch>
        <Route exact path="/meeting/dashboard/:session/:ncr?">
            <Dashboard />
        </Route>
        <Route exact path="/meeting/ncr/:session/">
            <Ncr />
        </Route>
        <Route path="/meeting/:session">
            <MeetingInfo />
        </Route>
        <Route >
            <h1>not found</h1>
        </Route>
    </Switch></MeetingContext.Provider>
}

export default App;
