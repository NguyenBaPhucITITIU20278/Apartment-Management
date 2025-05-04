import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: 'real estate OR property OR housing OR apartment',
                        language: 'en',
                        sortBy: 'publishedAt',
                        pageSize: 9,
                        page,
                    },
                    headers: {
                        'X-Api-Key': 'f54bb78fe62e4bafbde482f1333b4060'
                    }
                });
                setNews(response.data.articles);
                setError(null);
            } catch (error) {
                if (error.response) {
                    // Lỗi từ server
                    if (error.response.status === 401) {
                        setError('Invalid API key. Please check your API key configuration.');
                    } else if (error.response.status === 429) {
                        setError('API rate limit exceeded. Please try again later.');
                    } else {
                        setError(`Error: ${error.response.status} - ${error.response.data.message}`);
                    }
                } else if (error.request) {
                    // Lỗi không nhận được response
                    setError('No response from server. Please check your internet connection.');
                } else {
                    // Lỗi khác
                    setError('An error occurred while fetching news.');
                }
                console.error('Error details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [page]);

    const handleNewsClick = (item) => {
        navigate(`/news/${item.title}`, { state: { item } });
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Real Estate News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <div 
                        key={index} 
                        className="border rounded-lg p-4 bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleNewsClick(item)}
                    >
                        {item.urlToImage && (
                            <img 
                                src={item.urlToImage} 
                                alt={item.title} 
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                        )}
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-700 mb-4">{item.description}</p>
                        <p className="text-gray-500 text-sm">
                            {new Date(item.publishedAt).toLocaleDateString()} - {item.source.name}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="mr-4 px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default News;