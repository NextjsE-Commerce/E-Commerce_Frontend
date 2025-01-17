import React from 'react'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'

const NewProducts = () => {
    return (
        <div className="bg-gray-100  md:py-12  md:px-0">
            <h1 className="mt-8 text-center font-bebas-neue uppercase text-4xl sm:text-5xl font-black flex flex-col leading-none text-gray-800">New Products</h1>
            <div className="md:mx-20 mx-5 mt-14 p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 items-start ">
               
                <div className="rounded-lg py-8 bg-blue-50  text-center transform duration-500 hover:-translate-y-2 cursor-pointer">
                    
                    <div className="space-x-1 flex justify-center">
                        <img src="/Images/HeroImage2.png" className="w-44 h-44 object-contain align-middle" alt="" />
                    </div>

                    <div className="space-x-1 flex justify-center mt-10">
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStarHalf className='w-4 h-4 mx-px fill-current text-amber-600' />
                    </div>

                    <h1 className="text-2xl font-semibold my-5">Smart Watch</h1>
                    <h2 className="font-semibold mb-5">2500 Birr</h2>
                    <div className="space-x-10 flex justify-center">
                        <button
                            className={`bg-blue-500 text-white justify-center p-2 px-6 rounded-md font-semibold hover:scale-105 transform transition-all duration-300 ease-in-out`}
                            style={{ display: 'inline-block', transformOrigin: 'center' }}>
                            <div className="flex space-x-1 items-center">
                                <span>Add To</span>
                                <FaCartShopping className="text-white text-lg" />
                            </div>
                        </button>
                    </div>

                </div>


                <div className="rounded-lg py-8 bg-purple-50  text-center transform duration-500 hover:-translate-y-2 cursor-pointer">
                    <div className="space-x-1 flex justify-center">
                        <img src="/Images/HeroImage2.png" className="w-44 h-44 object-contain align-middle" alt="" />
                    </div>

                    <div className="space-x-1 flex justify-center mt-10">
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStarHalf className='w-4 h-4 mx-px fill-current text-amber-600' />

                    </div>
                    <h1 className="text-2xl font-semibold my-5">Smart Watch</h1>
                    <h2 className="font-semibold mb-5">2500 Birr</h2>
                    <div className="space-x-10 flex justify-center">
                        <button
                            className={`bg-blue-500 text-white justify-center p-2 px-6 rounded-md font-semibold hover:scale-105 transform transition-all duration-300 ease-in-out`}
                            style={{ display: 'inline-block', transformOrigin: 'center' }}>
                            <div className="flex space-x-1 items-center">
                                <span>Add To</span>
                                <FaCartShopping className="text-white text-lg" />
                            </div>
                        </button>
                    </div>

                </div>

                <div className="rounded-lg py-8 bg-green-50  text-center transform duration-500 hover:-translate-y-2 cursor-pointer">
                    <div className="space-x-1 flex justify-center">
                        <img src="/Images/HeroImage2.png" className="w-44 h-44 object-contain align-middle" alt="" />
                    </div>

                    <div className="space-x-1 flex justify-center mt-10">
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStar className='w-4 h-4 mx-px fill-current text-amber-600' />
                        <FaStarHalf className='w-4 h-4 mx-px fill-current text-amber-600' />

                    </div>
                    <h1 className="text-2xl font-semibold my-5">Smart Watch</h1>
                    <h2 className="font-semibold mb-5">2500 Birr</h2>
                    <div className="space-x-10 flex justify-center">

                        <button
                            className={`bg-blue-500 text-white justify-center p-2 px-6 rounded-md font-semibold hover:scale-105 transform transition-all duration-300 ease-in-out`}
                            style={{ display: 'inline-block', transformOrigin: 'center' }}>
                            <div className="flex space-x-1 items-center">
                                <span>Add To</span>
                                <FaCartShopping className="text-white text-lg" />
                            </div>
                        </button>

                    </div>

                </div>


            </div>

        </div>
    )
}

export default NewProducts
