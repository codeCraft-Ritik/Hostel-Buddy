import React, { useState } from "react";
import Filter from "../components/Filter";
import ProductsContainer from "../components/ProductsContainer";
import RequestForm from "../components/RequestForm"; 
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@material-tailwind/react"; 

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-constellation">
        <div className="flex flex-col items-center text-center p-8 z-10 relative">
          <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Hostel Buddy
          </Typography>
          <Typography variant="h5" className="font-normal text-sm md:text-xl text-gray-300 mb-8 max-w-2xl">
            The easiest way to borrow and lend within your campus community. Find what you need or lend a hand to a fellow student.
          </Typography>
          
          <div className="flex w-full max-w-lg h-12 rounded-lg focus-within:shadow-lg bg-nightfall-card border border-gray-700 overflow-hidden">
            <div className="grid place-items-center h-full w-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="peer h-full w-full outline-none text-xl bg-transparent text-gray-200 pr-2"
              type="text"
              id="search"
              placeholder="Search available items..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
           <Button 
              className="mt-6 bg-transparent border border-gray-500 text-gray-300 hover:bg-white/10"
              onClick={() => navigate("/requests")}
            >
              View All Community Requests
            </Button>
        </div>
      </div>

      {/* --- NEW LAYOUT --- */}
      <div className="w-full flex flex-col md:flex-row justify-center gap-x-16 px-5 py-8">
        <div className="flex flex-col gap-8 mb-8 md:mb-0">
            <Filter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <RequestForm />
        </div>
        <ProductsContainer
          selectedCategories={selectedCategories}
          search={search}
        />
      </div>
    </>
  );
};

export default Products;