import React from 'react'
import ContactUsForm from './ContactUsForm'

const ContactForm = () => {
  return (
    <div className='p-14 border-1 border-richblack-600 rounded-xl'>
        <h2 className='text-4xl font-semibold leading-10 text-richblack-5'>Got a Idea? We've got the skills. Let's team up</h2>
        <p className='text-richblack-300 mt-3 font-medium mb-10 text-[17px]'>Tell us more about yourself and what you're got in mind.</p>
      <ContactUsForm/>
    </div>
  )
}

export default ContactForm
