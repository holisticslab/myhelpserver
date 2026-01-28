

import React from 'react';

import {
    Switch,
    Route,
} from "react-router-dom";

import { AuthContext,logout,checkSession,getCustomLogin } from './screens/auth/auth';
import FlashScreen from './screens/FlashScreen';
import SignInScreen from './screens/auth/SignInScreen';
import CustomSignInScreen from './screens/auth/CustomSignInScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeNavigator from './navigations/HomeNavigator';
import ClientNavigator from './navigations/ClientNavigator';
import AuditorNavigator from './navigations/AuditorNavigator';

export default function App(props) {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        accessType: action.access,
                        user:action.user,
                        cmpny:action.cmpny
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        accessType: action.access,
                        user:action.user,
                        cmpny:action.cmpny
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        accessType: false,
                    };
                case 'LOADED':
                    return {
                        ...prevState,
                        isLoading:false
                    };
                    
                case 'changeAccess':
                    return {
                        ...prevState,
                        accessType: action.access,
                    };
                case 'customLogScreen':
                    return {
                        ...prevState,
                        customLogList: action.screenlist,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            accessType: false,
            user: null,
            cmpny:null,
            customLogList:null,
        }
    );

    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const getCustomScreen=async()=>{
            console.log("custom screen")
            getCustomLogin().then(x=>{
                console.log(x);
                dispatch({ type: 'customLogScreen', screenlist:x});
            })
        }
        const bootstrapAsync = async () => {
            checkSession().then(x=>{
                if(x.accesslevel === false ){
                    getCustomScreen();
                }
                dispatch({ type: 'RESTORE_TOKEN', access: x.accesslevel,user:x.user,cmpny:x.cmpny});
                
            })
            .catch(e=>{
                
                getCustomScreen();
                dispatch({ type: 'RESTORE_TOKEN', access:false,user:null });
                
            })
            // console.log(props);
        };

        bootstrapAsync();
        let progressbar = setTimeout(()=>dispatch({ type: 'LOADED'}), 6000);

        return function cleanup() {
          clearTimeout(progressbar)
        };

    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async x => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token
               
                dispatch({ type: 'SIGN_IN', access:x.accesslevel,user:x.user ,cmpny:x.cmpny });
            },
            signOut: () =>{ 
                logout();
                getCustomLogin().then(x=>{
                    console.log(x);
                    dispatch({ type: 'customLogScreen', screenlist:x});
                })
                let  src = localStorage.getItem("mytime");
                if (src) {
                    window.history.replaceState('login', 'login', src);
                  }
                dispatch({ type: 'SIGN_OUT' })},
            signUp: async data => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            changeAccess:(lvl)=>{
                dispatch({ type: 'changeAccess', access: lvl});
            },
            profile:state.user,
            cmpny:state.cmpny,
        }),
        [state.user,state.cmpny]
    );
    if(state.isLoading) return <FlashScreen/>
    return (
        <AuthContext.Provider value={authContext}>
            {state.accessType === false ? (
                <Switch>
                    
                    <Route path="/register">
                        <RegisterScreen />
                    </Route>
                    {state.customLogList &&
                    state.customLogList.map((x,i) =><Route key={i} path={`/${x.cmpnyLink}`}>
                        <CustomSignInScreen data={x.cmpnyConfig} id={x.id} link={`/${x.cmpnyLink}`} />
                        </Route>)
                    }
                    <Route path="/">
                        <SignInScreen />
                    </Route>

                </Switch>
            ) :
            state.accessType < 2 ? 
            <HomeNavigator /> :
            state.accessType > 1 && state.accessType < 4 ? 
            <ClientNavigator/>
            :<AuditorNavigator/>

            }

        </AuthContext.Provider>
    );
}




// function SignInScreen() {
//     const [username, setUsername] = React.useState('');
//     const [password, setPassword] = React.useState('');

//     const { signIn } = React.useContext(AuthContext);

//     return (
//       <div>
//         <button title="Sign in" onClick={() => signIn({ username, password })} >Login </button>
//       </div>
//     );
//   }