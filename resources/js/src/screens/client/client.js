import React from 'react';
import axios from 'axios';
import {sessionRedirect} from '../../components/function';


export const ClientContext = React.createContext();


export const getData = () => {
    return new Promise( (resolve, reject)=> {
      axios.get('/getclientdata').then(({ data }) => resolve(data))
      .catch( (error)=> {
        sessionRedirect(error)
        reject(error);
      });
    });
  }

export const saveChecklist = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/postclientcklist',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}