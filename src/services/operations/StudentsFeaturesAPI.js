// import React from 'react'
import { studentEndpoints } from '../apis'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints ;
import rzpLogo from '../../assets/Logo/rzp_logo.png'
import { setPaymentLoading } from '../../slices/courseSlice';
import { resetCart } from '../../slices/cartSlice';

function loadScript(src){
    return new Promise((resolve) => {
        const script =  document.createElement("script")
        // console.log("Problem reached")
        // console.log(src)
        script.src = src ;
        // console.log("Problem resolved");

        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("loading....")
    // console.log("reached herer")
    try{
        // console.log("Load Script is Generated")
        //Load the script
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if(!res){
            toast.error("Razorpay SDK Failed to load")
        }

        // console.log("Course Payment Api is Called")
        //INITIATE THE ORDER
        const orderResponse = await apiConnector('POST', COURSE_PAYMENT_API,
                                    {courses},
                                    {Authorization: `Bearer ${token}`}
                                )

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        // console.log("Payment Response is Created", orderResponse)
        
        //OPTIONS
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank You for purchasing the course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response){
                // SEND SUCCESSFULL MAIL
                // console.log("Send payment success email is called")
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token)

                console.log("Verify Payment is called");
                //VERIFY THE PAYMENT
                verifyPayment({...response, courses}, token, navigate, dispatch)
            },

        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
          toast.error("oops, payment failed");
          console.log(response.error);
        });
        console.log("Payment Response is done")
    }
    catch(err){
        console.log('PAYMENT ERROR IS', err)
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token) {
    // console.log("send payment success mail is called")
    // console.log("Response upon calling send payment succeeess mail", response)
    try{
        await apiConnector(
          "POST",
          SEND_PAYMENT_SUCCESS_EMAIL_API,
          {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
    }
    catch(err){
        console.log("PAYMENT SUCCESS EMAIL ERROR...", err)
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch){
    // console.log("Payment Verification is Called")
    const toastId = toast.loading("Verifying Payment")
    dispatch(setPaymentLoading(true))

    try{
        const response = await apiConnector('POST', COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`
        })

        // console.log("Response get from backend", response);
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Payment Successfull, You are added to the course")
        navigate('/dashboard/enrolled-courses')
        dispatch(resetCart())
    }
    catch(err){
        console.log("Payment Verify Error")
        console.log("Error is", err)
        toast.error("Could not verify Payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false))
}