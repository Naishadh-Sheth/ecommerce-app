import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler = (event)=>{
        event.preventDefualt();
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'> Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>This is our store's newsletterbox, you can get a lot of benefits if you subscribe to it.</p>
        <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input type="email" required className='w-full sm:flex-1 outline-none' placeholder='Enter your email'/>
            <button onClick={onSubmitHandler} type='submit' className='bg-black text-white text-xs px-10 py-4'> SUBMIT </button>
        </form>
    </div>
  )
}

export default NewsLetterBox