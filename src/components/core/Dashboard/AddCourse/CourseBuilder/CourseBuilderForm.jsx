import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import {GrAddCircle} from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import {BiRightArrow} from 'react-icons/bi'
import toast from 'react-hot-toast'
import {
  updateSection,
  updateSubSection,
  createSection,
} from "../../../../../services/operations/courseDetails";
import NestedView from './NestedView'
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice'


const CourseBuilderForm = () => {
    const {register, handleSubmit, setValue, formState: {errors}} = useForm();
    const [editSectionName, setEditSectionName] = useState(null)
    const { course } = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const {editCourse} = useSelector(state => state.course)

    const onSubmit = async(data) => {
      setLoading(true);
      let result ;
      if(editSectionName){
        //We are editting the section name
        result = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course._id
          }, token
        )
      }
      else{
        result = await createSection({
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        }, token);
        // console.log("result is ", result);
      }

      if(result){
        dispatch(setCourse(result));
        setEditCourse(null)
        setValue("sectionName", "")
      }
      
      // console.log("course is", course)
      setEditSectionName(null);
      setLoading(false)
    }

    const cancelEdit = () => {
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    const goBack = () => {
      dispatch(setStep(1))
      dispatch(setEditCourse(true))
      console.log("edit course is", editCourse)
    }

    const goNext = () => {
      if(course.courseContent.length === 0){
        toast.error("Please add at least one section")
        return ;
      }
      if(course.courseContent.some((section) => section.subSection.length === 0)){
        toast.error("Please add at least one sub section")
        return ;
      }
      dispatch(setStep(3));
      dispatch(setEditCourse(true));
      
    };

    const handleChangeEditSectionName = (sectionId, sectionName) => {
      console.log("edit section name", editSectionName)
      console.log("section name got", sectionName);
      if(editSectionName === sectionId) {
        cancelEdit();
        return;
      }

      setEditSectionName(sectionId);
      setValue("sectionName", sectionName);
    };

    return (
      <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
          Course Builder
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='className="space-y-4"'
        >
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="sectionName">
              Section Name <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="sectionName"
              placeholder="Enter the section name"
              {...register("sectionName", { required: true })}
              className="w-full form-style"
            />
            {errors.sectionName && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Section Name is Required
              </span>
            )}
          </div>
          <div className="flex items-end gap-x-4">
            <IconBtn
              type="submit"
              text={editSectionName ? "Edit Section Name" : "Create Section"}
              outline={true}
              customClasses={"text-white"}
            >
              <GrAddCircle className="text-yellow-50" />
            </IconBtn>
            {editSectionName && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-sm text-richblack-300 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {course.courseContent.length > 0 && (
          <NestedView
            handleChangeEditSectionName={handleChangeEditSectionName}
          />
        )}

        <div className="flex justify-end gap-x-3">
          <button
            onClick={goBack}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Back
          </button>
          <IconBtn text="Next" onclick={goNext}>
            <BiRightArrow />
          </IconBtn>
        </div>
      </div>
    );
}

export default CourseBuilderForm
