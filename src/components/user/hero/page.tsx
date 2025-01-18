import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";

const Hero = () => {

  const HeroImages = {
    "images": [
      {
        "id": 1,
        "image": "/Images/HeroImage2.png"
      },
      {
        "id": 2,
        "image": "/Images/HeroImage4.png"
      },
      {
        "id": 3,
        "image": "/Images/HeroMobile1.png"
      }
    ]
  }
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HeroImages.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden ">
      <div className="bg-gray-200 flex relative z-20 items-center overflow-hidden">
        <div className="mt-24 container md:mx-20  px-6 flex relative py-11">
          <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
            <span className="w-20 h-2 bg-blue-500  mb-2">
            </span>
            <h1
              className="font-bebas-neue uppercase text-4xl sm:text-8xl font-black flex flex-col leading-none text-gray-800">
              All in
              <span className="text-blue-500 text-5xl sm:text-7xl">
                One
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-gray-700">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo massa
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem
            </p>
            <div className="flex mt-8">
              <a href="#"
                className="uppercase py-2 px-4  rounded-lg bg-blue-500 border-2 border-transparent text-white text-md mr-4 hover:bg-blue-400">
                Shop Now
              </a>
              <a href="#"
                className="uppercase py-2 px-4 rounded-lg bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-md">
                About Us
              </a>
            </div>
          </div>
          <div className=" sm:w-1/3 lg:w-3/5 relative">
            
            {HeroImages.images.map((image, index) => (
              <motion.img
                key={image.id}
                src={image.image}
                alt={`About Image ${index + 1}`}
                className={`w-96 h-96 md:max-w-sm m-auto object-contain ${currentImageIndex === index ? "visible" : "hidden"}`}
                initial={{ opacity: 0 }}
                animate={currentImageIndex === index ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1 }}
              />

            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
