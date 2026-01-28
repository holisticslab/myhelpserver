import React from 'react';
import axios from 'axios';
import {sessionRedirect} from '../../components/function';

export const ProfileContext = React.createContext();


export const getProfile = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getprofile').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}
export const deleteProfile=x=>{
  return new Promise( (resolve, reject)=> {
    axios.post('/deleteprofile',{ pk: x }).then((d) => resolve(d))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error)
    });
  });
}


export const postUser = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/postuser',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });

}

export const createProfile = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/createprofile',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}