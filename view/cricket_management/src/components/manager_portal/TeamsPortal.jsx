import {React,useState,useLayoutEffect,useEffect} from 'react'
import axios from '../../api/axios';
import {useCookies} from 'react-cookie';
const TeamsPortal = () => {
  const [cookies] = useCookies(["token"]);

  const GetTournmants = () =>{
    axios.get('/tournaments',{
      headers:{
        Authorization: "Bearer " + cookies.token
      }
    }).then((response) => {
      return (response.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  
  return (
    <div>
      
    </div>
  )
}

export default TeamsPortal
