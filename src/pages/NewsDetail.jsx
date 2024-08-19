import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const NewsDetail = () => {
    const location = useLocation();
    const { item } = location.state || {}; // Add default value to avoid undefined error
    const { id } = useParams();

    if (!item) {
        return <div className="p-6">No news item found.</div>;
    }

    console.log('Displaying item:', item); // Debug log

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{item.title}</h1>
            <p className="text-gray-700 mb-4">{item.abstract}</p>
            {item.multimedia && item.multimedia.length > 0 && (
                <img src={item.multimedia[0].url} alt={item.title} className="w-full h-auto rounded-lg mb-4" />
            )}
            <p className="text-gray-600 mb-2"><strong>By:</strong> {item.byline}</p>
            <p className="text-gray-600 mb-2"><strong>Published on:</strong> {new Date(item.published_date).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-2"><strong>Section:</strong> {item.section}</p>
            {item.subsection && <p className="text-gray-600 mb-2"><strong>Subsection:</strong> {item.subsection}</p>}
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Read full article</a>
        </div>
    );
};

export default NewsDetail;