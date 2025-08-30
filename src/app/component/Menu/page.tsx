'use client'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import { getProducts } from "../../redux/store/productSlice";
import { addToCart } from "../../redux/store/cartSlice";
import Image from "next/image";
import { fetchRolls } from "../../redux/store/rollsSlice";
import { fetchdesert } from '../../redux/store/desertSlice';
import { fetchSand } from '../../redux/store/sandwichSlice';
import { fetchCake } from '../../redux/store/cakeSlice';
import { fetchPure } from '../../redux/store/PureSlice';

import { FiPlus } from "react-icons/fi";

const Menu: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>('Salad');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.products);
  const { rolls1 } = useSelector((state: RootState) => state.rolls);
  const { desert } = useSelector((state: RootState) => state.desert);
  const { sandWich } = useSelector((state: RootState) => state.sandWich);
  const { Cake } = useSelector((state: RootState) => state.cake);
  const { Pure } = useSelector((state: RootState) => state.pure);
  

  useEffect(() => {
    dispatch(getProducts());
    dispatch(fetchRolls());
    dispatch(fetchdesert());
    dispatch(fetchSand());
    dispatch(fetchCake());
    dispatch(fetchPure());
  }, [dispatch]);

  if (loading) return  <div className="flex items-center justify-center min-h-[8rem]">
      <div className="relative">
        {/* Outer spinning circle (blue) */}
        <div className="w-16 h-16 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>

        {/* Inner spinning circle (green, opposite direction) */}
        <div className="absolute inset-2">
          <div className="w-12 h-12 rounded-full border-2 border-b-transparent border-green-500 animate-spin" style={{ animationDirection: "reverse" }}></div>
        </div>
         <div className="absolute inset-2">
          <div className="w-12 h-12 rounded-full border-2 border-b-transparent border-amber-100 animate-spin" style={{ animationDirection: "reverse" }}></div>
        </div>

        {/* Center dot (red) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          
        </div>
      </div>
      
    </div>
  
  


  const handleClick = (item: { label: string }) => {
    setSelectedMenu(item.label);
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.image
    }));
  };

  return (
    <>
      <h1 className='text-4xl font-semibold'>Explore Our Menu</h1>
      <p className='max-w-2xl py-5'>
        Choose from a diverse menu featuring a delectable array of dishes.
      </p>

      {/* Menu Categories */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-14">
        {[
          { src: "/menu_1.png", label: "Salad" },
          { src: "/menu_2.png", label: "Rolls" },
          { src: "/menu_3.png", label: "Deserts" },
          { src: "/menu_4.png", label: "Sandwich" },
          { src: "/menu_5.png", label: "Cake" },
          { src: "/menu_6.png", label: "Pure Veg" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={item.src}
              alt='{item.label}'
              width={100}
              height={100}
              className="hover:scale-110 transition duration-300 hover:border-2 hover:border-[#ff4c24] rounded-full cursor-pointer"
              onClick={() => handleClick(item)}
            />
            <h1 className="text-center py-2 text-md font-semibold">{item.label}</h1>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t-2 border-gray-300" />

      <div>
        <h1 className="text-xl font-semibold mt-8">Top Dishes Near You</h1>
      </div>

      {/* Salad */}
      {selectedMenu === 'Salad' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {items.map((product1, index) => (
            <div
              key={product1._id || product1.id || index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-[#f5beb5] flex flex-col hover:scale-105 transition-transform"
              onMouseEnter={() => setHoveredProduct(product1._id || product1.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Image
                src={product1.image}
                alt='{product1.title}'
                width={700}
                height={700}
                className="rounded object-cover w-full"
              />

              {hoveredProduct === (product1._id || product1.id) && (
                <button
                  className="absolute top-2 right-2 bg-white text-black hover:text-white p-2 rounded-full shadow-lg hover:bg-[#e63d17] transition"
                  onClick={() => handleAddToCart(product1)}
                >
                  <FiPlus size={20} />
                </button>
              )}

              <h2 className="text-xl font-semibold mt-4 text-center p-2">{product1.title}</h2>
              <p className="text-gray-600 text-center text-sm">{product1.description}</p>
              <div className='flex justify-end items-end'>
                <p className="text-lg font-bold text-[#ff4c24] mt-2 p-2">${product1.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rolls */}
      {selectedMenu === 'Rolls' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {rolls1.map((product1, index) => (
           <div
              key={product1._id || product1.id || index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-[#f5beb5] flex flex-col hover:scale-105 transition-transform"
              onMouseEnter={() => setHoveredProduct(product1._id || product1.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Image
                src={product1.image}
                alt='{product1.title}'
                width={700}
                height={700}
                className="rounded object-cover w-full"
              />

              {hoveredProduct === (product1._id || product1.id) && (
                <button
                  className="absolute top-2 right-2 bg-white text-black hover:text-white p-2 rounded-full shadow-lg hover:bg-[#e63d17] transition"
                  onClick={() => handleAddToCart(product1)}
                >
                  <FiPlus size={20} />
                </button>
              )}

              <h2 className="text-xl font-semibold mt-4 text-center p-2">{product1.title}</h2>
              <p className="text-gray-600 text-center text-sm">{product1.description}</p>
              <div className='flex justify-end items-end'>
                <p className="text-lg font-bold text-[#ff4c24] mt-2 p-2">${product1.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deserts */}
      {selectedMenu === 'Deserts' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {desert.map((rol, index) => (
            <div
              key={rol._id || rol.id || index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-[#f5beb5] flex flex-col hover:scale-105 transition-transform"
              onMouseEnter={() => setHoveredProduct(rol._id || rol.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Image
                src={rol.image}
                alt='{rol.title}'
                width={700}
                height={700}
                className="rounded object-cover w-full"
              />

              {hoveredProduct === (rol._id || rol.id) && (
                <button
                  className="absolute top-2 right-2 bg-white text-black hover:text-white p-2 rounded-full shadow-lg hover:bg-[#e63d17] transition"
                  onClick={() => handleAddToCart(rol)}
                >
                  <FiPlus size={20} />
                </button>
              )}

              <h2 className="text-xl font-semibold mt-4 text-center p-2">{rol.title}</h2>
              <p className="text-gray-600 text-center text-sm">{rol.description}</p>
              <div className='flex justify-end items-end'>
                <p className="text-lg font-bold text-[#ff4c24] mt-2 p-2">${rol.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sandwich */}
      {selectedMenu === 'Sandwich' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {sandWich.map((rol, index) => (
            <div
              key={rol._id || rol.id || index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-[#f5beb5] flex flex-col hover:scale-105 transition-transform"
              onMouseEnter={() => setHoveredProduct(rol._id || rol.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Image
                src={rol.image}
                alt='{rol.title}'
                width={700}
                height={700}
                className="rounded object-cover w-full"
              />

              {hoveredProduct === (rol._id || rol.id) && (
                <button
                  className="absolute top-2 right-2 bg-white text-black hover:text-white p-2 rounded-full shadow-lg hover:bg-[#e63d17] transition"
                  onClick={() => handleAddToCart(rol)}
                >
                  <FiPlus size={20} />
                </button>
              )}

              <h2 className="text-xl font-semibold mt-4 text-center p-2">{rol.title}</h2>
              <p className="text-gray-600 text-center text-sm">{rol.description}</p>
              <div className='flex justify-end items-end'>
                <p className="text-lg font-bold text-[#ff4c24] mt-2 p-2">${rol.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cake */}
      {selectedMenu === 'Cake' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {Cake.map((rol, index) => (
            <div
              key={rol._id || rol.id || index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-[#f5beb5] flex flex-col hover:scale-105 transition-transform"
              onMouseEnter={() => setHoveredProduct(rol._id || rol.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Image
                src={rol.image}
                alt='{rol.title}'
                width={700}
                height={700}
                className="rounded object-cover w-full"
              />

              {hoveredProduct === (rol._id || rol.id) && (
                <button
                  className="absolute top-2 right-2 bg-white text-black hover:text-white p-2 rounded-full shadow-lg hover:bg-[#e63d17] transition"
                  onClick={() => handleAddToCart(rol)}
                >
                  <FiPlus size={20} />
                </button>
              )}

              <h2 className="text-xl font-semibold mt-4 text-center p-2">{rol.title}</h2>
              <p className="text-gray-600 text-center text-sm">{rol.description}</p>
              <div className='flex justify-end items-end'>
                <p className="text-lg font-bold text-[#ff4c24] mt-2 p-2">${rol.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pure Veg */}
      {selectedMenu === 'Pure Veg' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {Pure.map((rol, index) => (
            <div
              key={rol._id || rol.id || index}
              className="relative bg-white rounded-lg shadow-md hover:shadow-[#f5beb5] flex flex-col hover:scale-105 transition-transform"
              onMouseEnter={() => setHoveredProduct(rol._id || rol.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Image
                src={rol.image}
                alt='{rol.title}'
                width={700}
                height={700}
                className="rounded object-cover w-full transition-transform duration-300"
              />

              {hoveredProduct === (rol._id || rol.id) && (
                <button
                  className="absolute top-2 right-2 bg-white text-black hover:text-white p-2 rounded-full shadow-lg hover:bg-[#e63d17] transition"
                  onClick={() => handleAddToCart(rol)}
                >
                  <FiPlus size={20} />
                </button>
              )}

              <h2 className="text-xl font-semibold mt-4 text-center p-2">{rol.title}</h2>
              <p className="text-gray-600 text-center text-sm">{rol.description}</p>
              <div className='flex justify-end items-end'>
                <p className="text-lg font-bold text-[#ff4c24] mt-2 p-2">${rol.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Menu;
