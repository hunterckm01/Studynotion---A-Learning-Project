import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FiUploadCloud } from "react-icons/fi"
import { useDropzone } from 'react-dropzone'

// import "video-react/dist/video-react.css"
import Plyr from "plyr-react"

const Upload = ({
    name,
    label,
    register,
    errors,
    setValue,
    video = false,
    viewData = null,
    editData = null
}) => {

    //  console.log("name", name);
    //  console.log("label", label);
    //  console.log("register", register);
    //  console.log("errors", errors);
    //  console.log("setValue", setValue);
    //  console.log("video", video);
    //  console.log("viewData", viewData);
    //  console.log("editData", editData);

     const [selectedFile, setSelectedFile] = useState(null)
     const [previewSource, setPreviewSource] = useState(viewData ? viewData : editData ? editData : "")

    //  const inputRef = useRef(null)

    const onDrop = (acceptedFiles) => {
      console.log("on drop is hit")
      console.log("accepted file is ", acceptedFiles)
      const file = acceptedFiles[0]
      if(file){
        previewFile(file)
        setSelectedFile(file)
      }
      console.log(file);
    }
    
    const { getRootProps, getInputProps, isDragActive} = useDropzone({
     accept: !video 
     ? {"image/*": [".jpeg", ".jpg", ".png"]}
     : {"video/*": [".mp4"]} ,
     onDrop
    })

    const previewFile = (file) => {
      console.log("preview file is hit")
      // console.log("what file i got", file);
      const reader = new FileReader()
      // console.log("reader what data contains", reader.result)
      reader.readAsDataURL(file)
      
      reader.onloadend = () => {
        setPreviewSource(reader.result)
        console.log("reading",reader.result);
      }
      // console.log("previewing the source", previewSource)
    } 

    useEffect(()=>{
      register(name, {required: true})
    },[register])

    useEffect(()=>{
      setValue(name, selectedFile)
    }, [selectedFile, setValue])

    //  const files = acceptedFiles.map(file => (
    //   <li key = {file.path}>{file.path} - {file.size}bytes</li>
    //  ))

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <video src={previewSource} controls/>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            {...getRootProps({
              className: "dropzone flex w-full flex-col items-center p-6",
            })}
          >
            <input
              {...getInputProps()}
              // className="form-style w-full"
              // placeholder={`Click here and Upload Your ${name}`}
              // ref = {inputRef}
            />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
            {/* <ul>{files}</ul> */}
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

export default Upload
