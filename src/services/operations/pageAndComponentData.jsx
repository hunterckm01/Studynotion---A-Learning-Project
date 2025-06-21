import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from '../apiconnector'
import { catalogData } from '../apis'

export const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try{
    const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId})

    if(!response?.data?.success){
        throw new Error("Could not fetch category page data")
    }

    result = response?.data ;
  }
  catch(err){
    console.log('CATALOG PAGE API ERROR', err)
    toast.error(err.message)
    result = err.message?.data;
  }
   toast.dismiss(toastId)  
   return result
}


