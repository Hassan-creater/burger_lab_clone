'use client'
import axios from "axios";
import { get } from "http";


import React from 'react'

export default async function CategoryLinks (){

  const getCata= async ()=>{
    const res = await axios.get("https://zestup-8jvc0.kinsta.app/api/category/view/customer",{
      headers : {
        Accept :"applicatio/json",
        Authorization : `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    return res.data
  }
  return getCata;
}




  
  