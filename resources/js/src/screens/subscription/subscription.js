import React from 'react';
import axios from 'axios';
import {sessionRedirect} from '../../components/function';


export const SubscriptionContext = React.createContext();


export const getSubscription = () => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getsubscription').then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}


export const getSubcrData = (id) => {
  return new Promise( (resolve, reject)=> {
    axios.get('/getsubcrdata/'+id).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });

}
export const deleteSubscription=x=>{
  return new Promise( (resolve, reject)=> {
    axios.post('/deletesubscription',{ pk: x }).then((d) => resolve(d))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
      // if (error.response) {
      //   // The request was made and the server responded with a status code
      //   // that falls out of the range of 2xx
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      // } else if (error.request) {
      //   // The request was made but no response was received
      //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //   // http.ClientRequest in node.js
      //   console.log(error.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log('Error', error.message);
      // }
      // console.log(error.config);
      // reject(error.response.data);
    });
  });
}
export const createSubscription = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/createsubscription',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
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

export const deleteUser = (id) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/deleteuser',{ id }).then((d) => resolve(d))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
     
    });
  });

}

export const postPremise = (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/postpremise',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });
}

export const postSubcr= (data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/postsubcr',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });
}


export const postCopyCklist=(data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/addsubcrcklist',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });


}


export const saveCopyCklist=(data) => {
  return new Promise( (resolve, reject)=> {
    axios.post('/savecklist',data).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error);
      reject(error);
    });
  });


}
