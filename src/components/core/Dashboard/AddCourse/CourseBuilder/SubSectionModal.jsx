import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetails';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1, RxCross2 } from 'react-icons/rx';
import IconBtn from '../../../../common/IconBtn';
import Upload from '../Upload'

const SubSectionModal = ({
    modalData, 
    setModalData, 
    add = false, 
    view = false, 
    edit = false
    }) => {

    const {
        register,
        handleSubmit,
        setValue, 
        formState: {errors}, 
        getValues
    } = useForm();

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth);

    useEffect(()=>{
        if(view || edit){
            setValue("lectureTitle", modalData.title)
            setValue("lectureDesc", modalData.description)
            setValue("lectureVideo", modalData.videoUrl)
        }
    },[])

    const isFormUpdated = () => {
        const currentValues = getValues()
        if (
          currentValues.lectureTitle !== modalData.title ||
          currentValues.lectureDesc !== modalData.description ||
          currentValues.lectureVideo !== modalData.videoUrl    
        ) {
            return true
        }
        else{
            return false
        }
    }

    const handleEditSubSection = async() => {
        const currentValues = getValues();
        console.log("current values are", currentValues);
        console.log("modal data are", modalData)
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle)
        }
        else{
            formData.append("title", modalData.title)
        }

        if(currentValues.lectureDesc !== modalData.description) {
          formData.append("description", currentValues.lectureDesc);
        }else{
            formData.append("description", modalData.description);
        }

        if(currentValues.lectureVideo !== modalData.videoUrl) {
          formData.append("videoFile", currentValues.lectureVideo);
        }
        

        setLoading(true)
        console.log("result after clikcking ", formData);
        const result = await updateSubSection(formData, token)
 
        if(result){
            const updatedCourseContent = course.courseContent.map((section)=>
                section._id === modalData.sectionId ? result : section
            )
            const updatedCourse = {...course, courseContent: updatedCourseContent}
            dispatch(setCourse(updatedCourse));
        }

        setModalData(null)
        setLoading(false)
    }

    const onSubmit = async(data) => {
        console.log("on submit handler is called");
        if(view){
            return ;
        }
        console.log("reached view")
        if(edit){
            if(!isFormUpdated){
                toast.error("No changes are made to the form")
            }
            else{
                //Edit  
                console.log("edit sub section called")
                handleEditSubSection();
            }
            return
        }
        console.log("reached edit");
        
        const formData = new FormData();
        formData.append("sectionId", modalData)
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("videoFile", data.lectureVideo);
        setLoading(true)
        console.log("formData is", formData);

        const result = await createSubSection(formData, token)
        console.log("result is ", result);
        if(result){
            const updatedCourseContent = course.courseContent.map((section) =>
              section._id === modalData ? result : section
            );
            const updatedCourse = {
              ...course,
              courseContent: updatedCourseContent,
            };
            console.log("updated course is ", updatedCourse)
            dispatch(setCourse(updatedCourse))
        }

        setModalData(null)
        setLoading(false)
    }
  return (
    <div className="fixed inset-0 z-[1000]  grid h-screen w-screen place-items-center overflow-auto  bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <Upload
            name="lectureVideo"
            label="lectureVideo"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
            // viewData = {view ? modalData.videoUrl : null}
          />
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full form-style"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecutre Title is required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {" "}
                Lecture Description is Required{" "}
              </span>
            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                text={loading ? "Loading..." : edit ? "Sava Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SubSectionModal
