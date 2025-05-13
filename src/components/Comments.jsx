import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';


const Comments = ({ roomId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userName = Cookies.get('userName');


    useEffect(() => {
        fetchComments();
    }, [roomId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/comments/room/${roomId}`);
            setComments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
            setComments([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/comments`, null, {
                params: {
                    roomId: roomId,
                    username: userName,
                    content: newComment.trim()
                }
            });
            
            setNewComment('');
            setComments(prevComments => [...(Array.isArray(prevComments) ? prevComments : []), response.data]);
            toast.success('Comment posted successfully!');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            
            {/* Comment Form or Login Message */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            className={`self-end px-6 py-2 bg-blue-600 text-white rounded-lg 
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                                transition duration-200`}
                            disabled={!newComment.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
                    <p className="text-gray-600">Please login to comment</p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {Array.isArray(comments) && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                            <div className="flex justify-between items-start">
                                <div className="font-medium text-blue-600">{comment.username}</div>
                                <div className="text-sm text-gray-500">
                                    {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default Comments; 