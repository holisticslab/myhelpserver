
import axios from 'axios';

import React from 'react';

export const MeetingContext = React.createContext();

export const timeoutPromise = (timeout, err, promise) => {
    return new Promise(function (resolve, reject) {
      promise.then(resolve, reject);
      setTimeout(reject.bind(null, err), timeout);
    });
  }

  export const sessionRedirect=error=>{
    {
      if (error.response) {
        if(error.response.status===401){
          // alert('logout');
          window.location='/';
        }
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config); 
    }
  }

  export const getmeeting=(id)=>{
  return new Promise( (resolve, reject)=> {
    axios.get('/meetinginfo/'+id).then(({ data }) => resolve(data))
    .catch( (error)=> {
      sessionRedirect(error)
      reject(error);
    });
  });
  }

    export const saveMeeting = (data) => {
      return new Promise( (resolve, reject)=> {
        axios.post('/updatemeeting',data).then(({ data }) => resolve(data))
        .catch( (error)=> {
          sessionRedirect(error);
          reject(error);
        });
      });
    
    }
  
  export const toDataUrl=(src, outputFormat, size) =>{
  return new Promise( (resolve, reject)=> {
    var img = new Image();
  img.onload = function () {
    console.log("image load");
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      var calwidth;
      var calheight;

      if (this.width < this.height) {
          var fixsize = size / 2;
          calheight = fixsize;
          calwidth = (fixsize / this.height) * this.width;
      } else {
          calwidth = size;
          calheight = (size / this.width) * this.height;
      }

      canvas.height = calheight;
      canvas.width = size;
      ctx.drawImage(this, canvas.width / 2 - calwidth / 2, 0, calwidth, calheight)

      try{
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
      }
      catch(e){
        reject(e);
      }
  };
  img.src = src;
  console.log(src);
  });
  
}
