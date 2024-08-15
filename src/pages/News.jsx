import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const News = () => {
    const [news, setNews] = useState([]);
    const apiKey = 'Fz4jF7nPhP44XvqoioSNXwgGdVdFsdfd'; // Sử dụng API key của bạn
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`)
            .then(response => setNews(response.data.results))
            .catch(error => console.error('Error fetching news:', error));
    }, []);

    const handleNewsClick = (item, index) => {
        navigate(`/news/${index}`, { state: { item } });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Danh sách tin tức</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-md cursor-pointer" onClick={() => handleNewsClick(item, index)}>
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-700 mb-4">{item.abstract}</p>
                        {item.multimedia && item.multimedia.length > 0 && (
                            <img src={item.multimedia[0].url} alt={item.title} className="w-full h-auto rounded-lg" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;