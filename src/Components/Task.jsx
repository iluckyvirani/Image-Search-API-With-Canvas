import React, { useState } from 'react';
import './Task.css'

import CustomPagination from './Pagination'

import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';


const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();


    const searchImages = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${query}&per_page=${12}&client_id=-_7RBKFO3fNMrolJ-ePN-lHgFa0A3-J3EzOLFthPK2A`);
            const data = await response.json();
            if (data.results.length === 0) {
                toast.error("No images found. Please try a different search term.");
            }
            setImages(data.results);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCaption = (imageId) => {
        navigate('/add-caption', { state: { imageId: imageId.id } });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchImages(1);  // Search from the first page when Enter is pressed
        }
    };

    const handlePageChange = (pageNum) => {
        setPage(pageNum);
        searchImages(pageNum);  // Search for the new page
    };


    return (
        <>
            <div className="search-page-main">
                <div className='search-page-heading'>
                    <h1>Search Page</h1>
                </div>
                <div className='search-page'>
                    <div className="candidate-info">
                        <p><span>Name:</span> Lucky Virani</p>
                        <p><span>Email:</span> luckyvirani555@gmail.com</p>
                    </div>
                    <div className="search-box-main">
                        <div className='search-box'>
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <div className='search-box-icon' onClick={() => searchImages(1)}>
                                <FaSearch color='grey' />
                            </div>
                        </div>
                        <button onClick={() => searchImages(1)}>Search</button>
                    </div>
                    {loading && (
                        <div className="loading-spinner">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    )}

                    <div className="search-results">
                        {images.length > 0 && images.map(image => (
                            <div className="result-box" key={image.id}>
                                <div className='result-image'>
                                    <img src={image.urls.small} alt={image.alt_description} />
                                </div>
                                <button onClick={() => handleAddCaption(image)}>Add Caption</button>
                            </div>
                        ))}
                    </div>

                    {images.length > 0 && (
                        <CustomPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

            </div>
        </>
    );
};

export default SearchPage;
