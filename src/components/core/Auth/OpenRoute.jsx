import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function OpenRoute({children}){
    const {token} = useSelector((state)=>state.auth)
    if(token){
        console.log("token is available")
    }
    if(token === null){
        return children
    }
    else{
        return <Navigate to = "/dashboard/my-profile"/>
    }
}

export default OpenRoute
