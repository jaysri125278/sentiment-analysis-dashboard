import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import '../styles/styles.css';  

const Home = () => {
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');
    const [sentiment, setSentiment] = useState('');
    const [confidence, setConfidence] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
        } else {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUser(decodedToken.sub);
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate('/login');
            }
        }

        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleReviewChange = (e) => {
        setReviewText(e.target.value);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
  
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to submit a review.');
            return;
        }
  
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/submit_review', 
                {
                    review_text: reviewText,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
  
            if (response.status === 200) {
                setReviewText("");
                setSentiment(response.data.sentiment); 
                setConfidence(response.data.confidence); 
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                console.error("Error submitting review:", error);
                setError('There was an error submitting your review.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Navbar */}
            <div className="navbar">
                <div className="welcome">Welcome, {user || 'Guest'}</div>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="home-container">
                <h2>Leave a Review</h2>
                <form onSubmit={handleReviewSubmit}>
                    {error && <p className="error">{error}</p>}
                    <textarea
                        placeholder="Write your review here..."
                        value={reviewText}
                        onChange={handleReviewChange}
                        rows="4"
                        cols="50"
                        required
                    />
                    <br />
                    <button type="submit">Submit Review</button>
                </form>

                {sentiment && (
                    <div className="sentiment-result">
                        <h3>Review Sentiment</h3>
                        <p>Sentiment: <strong>{sentiment}</strong></p>
                        <p>Confidence: <strong>{confidence}%</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
