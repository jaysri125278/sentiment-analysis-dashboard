import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Carousel } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import '../styles/styles.css';

const Dashboard = () => {
  const [sentimentData, setSentimentData] = useState({});
  const [recentReviews, setRecentReviews] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/dashboard/sentiment_distribution')
      .then(response => {
        setSentimentData(response.data);
      })
      .catch(error => console.error('Error fetching sentiment data:', error));

    axios.get('http://127.0.0.1:5000/dashboard/recent_reviews')
      .then(response => {
        setRecentReviews(response.data);
      })
      .catch(error => console.error('Error fetching recent reviews:', error));
  }, []);

  const prepareChartData = () => {
    const dates = [];
    const positiveCounts = [];
    const negativeCounts = [];
    const neutralCounts = [];

    for (const date in sentimentData) {
      dates.push(date);
      positiveCounts.push(sentimentData[date]['POSITIVE'] || 0);
      negativeCounts.push(sentimentData[date]['NEGATIVE'] || 0);
      neutralCounts.push(sentimentData[date]['NEUTRAL'] || 0);
    }

    return {
      labels: dates,
      datasets: [
        {
          label: 'Positive',
          data: positiveCounts,
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          borderWidth: 1,
        },
        {
          label: 'Negative',
          data: negativeCounts,
          backgroundColor: '#F44336',
          borderColor: '#D32F2F',
          borderWidth: 1,
        },
        {
          label: 'Neutral',
          data: neutralCounts,
          backgroundColor: '#FF9800',
          borderColor: '#F57C00',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sentiment Distribution Over Time',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        stacked: false,
      },
      y: {
        title: {
          display: true,
          text: 'Number of Reviews',
        },
        beginAtZero: true,
      },
    },
  };

  const handleFilter = () => {
    if (filterStartDate && filterEndDate) {
      setLoading(true);
      const data = { start_date: filterStartDate, end_date: filterEndDate };
      axios.post('http://127.0.0.1:5000/dashboard/reviews_by_date', data)
        .then(response => {
          setFilteredReviews(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error filtering reviews:', error);
          setLoading(false);
        });
    } else {
      alert('Please provide both start and end dates.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="filter-container">
        <input 
          type="date" 
          onChange={(e) => setFilterStartDate(e.target.value)} 
          value={filterStartDate} 
        />
        <input 
          type="date" 
          onChange={(e) => setFilterEndDate(e.target.value)} 
          value={filterEndDate} 
        />
        <button onClick={handleFilter}>Filter Reviews</button>
      </div>
      <div className="chart-container">
        <h3>Sentiment Distribution Over Time</h3>
        <Bar data={chartData} options={options} height={200} width={400} />
      </div>
      <div className="carousel-container">
        <h3>Recent Reviews</h3>
        <Carousel>
          {recentReviews.map((review, index) => (
            <Carousel.Item key={index}>
              <div className="carousel-item-content">
                <p><strong>{review.user_id}</strong>: {review.review_text}</p>
                <p>Sentiment: {review.sentiment}, Confidence: {review.confidence}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="filtered-reviews-container">
          <h3>Filtered Reviews by Date</h3>
          <ul>
            {filteredReviews.map((review, index) => (
              <li key={index}>
                <p><strong>{review.user_id}</strong>: {review.review_text}</p>
                <p>Sentiment: {review.sentiment}, Confidence: {review.confidence}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
