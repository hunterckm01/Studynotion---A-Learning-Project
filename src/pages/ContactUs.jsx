import React from 'react'
import ContactUsForm from '../components/ContactUs/ContactUsForm';
import * as Icon1 from "react-icons/bi";
import * as Icon3 from "react-icons/hi2";
import * as Icon2 from "react-icons/io5";
import ContactForm from '../components/ContactUs/ContactForm';
import Footer from '../components/common/Footer';


const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat on us",
    description: "Our friendly team is here to help.",
    details: "chandanmahto6894@gmail.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Central Colony, Makoli, Phusro, Bokaro , 829144, JH",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "+917484648571",
  },
];

const ContactUs = () => {
   
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        <div className="lg:w-[40%] flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6 h-fit">
          {contactDetails.map((ele, index) => {
            let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon];
            return (
              <div
                key={index}
                className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200"
              >
                <div className="flex flex-row items-center gap-3">
                  <Icon size={25} />
                  <h2 className="text-lg font-semibold text-richblack-5">
                    {ele?.heading}
                  </h2>
                </div>

                <p className="font-medium">{ele.description}</p>

                <p className="font-semibold">{ele.details}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Us Form */}
        <div className="lg:w-[60%] mb-8">
          <ContactForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs
