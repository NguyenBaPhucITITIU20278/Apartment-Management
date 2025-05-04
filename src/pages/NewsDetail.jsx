import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {};
    const [fullContent, setFullContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item && item.url) {
            fetchFullContent();
        }
    }, [item]);

    const fetchFullContent = async () => {
        try {
            setLoading(true);
            // Gọi API để lấy nội dung đầy đủ
            const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(item.url)}`);
            const htmlContent = response.data.contents;
            
            // Tạo một div tạm để parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Lấy nội dung chính của bài báo
            const articleContent = tempDiv.querySelector('article') || 
                                 tempDiv.querySelector('.article-content') ||
                                 tempDiv.querySelector('.post-content') ||
                                 tempDiv.querySelector('.entry-content') ||
                                 tempDiv;
            
            // Làm sạch nội dung
            const cleanContent = articleContent.innerHTML
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Xóa script
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Xóa style
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Xóa iframe
                .replace(/<img[^>]*>/g, ''); // Xóa ảnh (vì đã có ảnh chính)
            
            setFullContent(cleanContent);
        } catch (error) {
            console.error('Error fetching full content:', error);
            setFullContent(item.content || 'Could not load full content');
        } finally {
            setLoading(false);
        }
    };

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No news item found</h1>
                    <button 
                        onClick={() => navigate('/news')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Back to News
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/news')}
                        className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to News
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{item.title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                        <span className="mr-4">{new Date(item.publishedAt).toLocaleDateString()}</span>
                        <span className="mr-4">•</span>
                        <span>{item.source.name}</span>
                        {item.author && (
                            <>
                                <span className="mr-4">•</span>
                                <span>By {item.author}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Featured Image */}
                {item.urlToImage && (
                    <div className="mb-8">
                        <img 
                            src={item.urlToImage} 
                            alt={item.title} 
                            className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="prose max-w-none">
                        <p className="text-xl text-gray-700 mb-6">{item.description}</p>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div 
                                className="text-gray-800 mb-6"
                                dangerouslySetInnerHTML={{ __html: fullContent || item.content }}
                            />
                        )}
                    </div>

                    {/* Source Link */}
                    <div className="mt-8 pt-6 border-t">
                        <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <span>Read Full Article</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;