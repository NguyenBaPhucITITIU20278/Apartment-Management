import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import commentService from '../services/commentService';

const Comments = ({ roomId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userName = Cookies.get('userName');

    useEffect(() => {
        if (roomId) {
            fetchComments();
        }
    }, [roomId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching comments for room:', roomId);
            const data = await commentService.getCommentsByRoomId(roomId);
            console.log('Comments response:', data);
            
            if (Array.isArray(data)) {
                setComments(data);
            } else {
                console.error('Unexpected response format:', data);
                setComments([]);
                toast.error('Error loading comments: Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error(error.response?.data?.message || 'Failed to load comments');
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setIsSubmitting(true);
        try {
            console.log('Posting comment:', {
                roomId,
                username: userName,
                content: newComment.trim()
            });

            const data = await commentService.createComment(
                roomId,
                userName,
                newComment.trim()
            );
            
            console.log('Comment posted successfully:', data);
            
            setNewComment('');
            setComments(prevComments => [data, ...(Array.isArray(prevComments) ? prevComments : [])]);
            toast.success('Comment posted successfully!');
            
            // Refresh comments after posting
            fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error(error.response?.data?.message || 'Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            console.warn('Empty date string received');
            return '';
        }
        try {
            const date = parseISO(dateString);
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return '';
            }
            return format(date, 'MMM d, yyyy HH:mm');
        } catch (error) {
            console.error('Error formatting date:', error, dateString);
            return '';
        }
    };

    if (isLoading) {
        return <div className="mt-8 text-center">Loading comments...</div>;
    }

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
                                    {formatDate(comment.createdAt)}
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