'use client';
import React from "react";
// import Navbar from "./component/Navbar/page";
import Menu from "./component/Menu/page";
import Image from "next/image";
const App: React.FC = () => {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* <Navbar /> */}

      <section id="home">
<div className="relative min-h-[80vh] md:h-screen w-full overflow-hidden -mt-16 md:mt-8 bg-[url('/header_img.png')] bg-cover md:bg-contain bg-center rounded-lg bg-no-repeat">
  {/* Overlay for readability */}
  <div className="absolute inset-0  rounded-lg"></div>

  <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-12 z-10">
    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-snug sm:leading-tight">
      Order Your Favourite Food Here
    </h1>
    <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl max-w-sm sm:max-w-xl md:max-w-2xl">
      Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
    </p>
    <button
      onClick={scrollToMenu}
      className="bg-white text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 mt-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 text-sm sm:text-base md:text-lg"
    >
      View Menu
    </button>
  </div>
</div>


      </section>

      <section
        id="menu"
        className=" px-12"
      >
      <Menu/>
       
      </section>

      <section
        id="mobileapp"
        className="flex flex-col justify-center items-center min-h-[50vh] "
      >

        <h1 className="  text-4xl ">For Better Experience Download
Tomato App</h1>
<div className="flex gap-2">
<Image
          src="/app_store.png"
          alt="Mobile App"
          width={200}
          height={200}
          className="mt-8 rounded-lg shadow-lg"
        />
        <Image
          src="/play_store.png"
          alt="Mobile App"
          width={200}
          height={200}
          className="mt-8 rounded-lg shadow-lg"
        />
        </div>
      </section>

      <section
        id="contact"
        className=" bg-blue-100"
      >
       <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between">
        {/* Left Section */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-red-500 text-2xl font-bold mb-2">Tomato.</h3>
          <p className="text-sm max-w-lg sm:max-w-2xl">
            Lorem, ipsum dolor sit amet consectetur adipiscing elit. Fugit ratione fugit vitae quisquam dolores sint id, nisi veniam repellendus. Tempore, expedita. At praesentium deserunt minima! Porro iste beatae maxime voluptatem?
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="mb-6 md:mb-0">
          <h4 className="text-red-500 text-lg font-semibold mb-2">COMPANY</h4>
          <ul className="space-y-2 text-center">
            <li><a href="#" className="text-sm hover:text-gray-300">Home</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300">About Us</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300">Delivery</a></li>
            <li><a href="#" className="text-sm hover:text-gray-300">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h4 className="text-red-500 text-lg font-semibold mb-2">GET IN TOUCH</h4>
          <ul className="space-y-2">
            <li className="text-sm">+923086910578</li>
            <li className="text-sm">mohsinriazjmp@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-4 text-gray-500">
        Copyright 2024 © Tomato.com
      </div>
      <div className="text-center text-xs text-gray-500 mt-1">
        Activate Windows. Go to Settings to activate Windows.
      </div>
    </footer>
      </section>
    </div>
  );
};

export default App;
