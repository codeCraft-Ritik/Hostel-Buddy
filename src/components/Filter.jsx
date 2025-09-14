import { Card, Chip, Tooltip } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5'; // Import a visible icon
import { getDataFromApi } from '../utility/api';

const Filter = ({ setSelectedCategories, selectedCategories }) => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getDataFromApi("/categories/all")
            .then((data) => {
                setCategories(data?.categories);
            });
    }, []);

    const handleCategoryClick = (category) => {
        const isSelected = selectedCategories?.some((selected) => selected._id === category._id);
        setSelectedCategories((prevSelected) => {
            if (isSelected) {
                return prevSelected?.filter((selected) => selected._id !== category._id);
            } else {
                return [...prevSelected, category];
            }
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event?.target?.value?.toLowerCase());
    };

    const filteredCategories = categories?.filter((category) =>
        category?.title?.toLowerCase()?.includes(searchTerm)
    );

    const handleRemoveSelectedCategory = (category) => {
        setSelectedCategories(prevSelected => {
            return prevSelected?.filter(selected => selected._id !== category._id);
        });
    };

    const handleClearAllSelectedCategory = () => {
        setSelectedCategories([]);
    };

    return (
        <Card className='w-full md:w-[22vw] max-w-72 h-fit py-5 bg-nightfall-card border border-gray-700/50 px-5 shadow-2xl'>
            <div className='flex flex-col mb-5'>
                <h1 className='font-bold text-2xl text-white mb-5'>Filter by categories</h1>
                <input
                    type='text'
                    className='bg-white/5 rounded px-2.5 py-1.5 outline-none placeholder:text-gray-400 text-md text-gray-200 border border-gray-700'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search Categories"
                />
                {selectedCategories?.length > 0 && (
                    <div className='mt-4 flex flex-wrap gap-x-2 gap-y-3 w-full'>
                        {selectedCategories?.map((selected) => (
                            <Chip
                                key={selected._id}
                                variant="filled"
                                value={`${selected.title}`}
                                className='capitalize text-sm font-light px-2 py-1 bg-accent-purple text-white rounded-md'
                                onClick={() => handleRemoveSelectedCategory(selected)}
                            />
                        ))}
                        <Tooltip
                            content="Clear All"
                            animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                            }}
                        >
                            {/* Replaced the broken image with a visible icon */}
                            <div className="bg-red-500/20 text-red-400 rounded-full p-1 cursor-pointer hover:bg-red-500/40" onClick={handleClearAllSelectedCategory}>
                                <IoClose size={18} />
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>

            {selectedCategories?.length > 0 && <hr className="border-gray-700" />}
            <div className='flex flex-wrap gap-x-2 mt-5 gap-y-3 w-full'>
                {filteredCategories?.map((category) => (
                    <Chip
                        key={category._id}
                        variant={selectedCategories?.some((selected) => selected._id === category._id) ? 'filled' : 'outlined'}
                        value={category?.title}
                        className={`capitalize text-sm font-light px-2 py-1 rounded-md cursor-pointer ${selectedCategories?.some((selected) => selected._id === category._id) ? 'bg-accent-purple text-white' : 'text-white border-gray-600'}`}
                        onClick={() => handleCategoryClick(category)}
                    />
                ))}
            </div>
        </Card>
    );
};

export default Filter;