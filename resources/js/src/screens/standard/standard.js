import React from 'react';
import axios from 'axios';
import {sessionRedirect} from '../../components/function';

export const StandardContext = React.createContext();


export const getStandard = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getstandard').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}

export const saveStandard = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/savestandard',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}