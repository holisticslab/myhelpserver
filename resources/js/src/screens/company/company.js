import React from 'react';
import axios from 'axios';
import {sessionRedirect} from '../../components/function';

export const CompanyContext = React.createContext();


export const getCompany = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getcompany').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}

export const updateCompany = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/updcompany',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}

export const getStaff = (cmpnyID) => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getstaffcmpny/'+cmpnyID).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}