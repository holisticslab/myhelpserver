import React from 'react';
import axios from 'axios';
import {sessionRedirect} from '../../components/function';

export const SchemeContext = React.createContext();


export const getScheme = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getscheme').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}
export const saveScheme=(data)=>{
  
}
export const migrateData = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getcklist').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}
export const logout = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/logout').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}