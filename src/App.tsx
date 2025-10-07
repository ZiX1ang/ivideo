import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [videos, setVideos] = useState([]);
    const [featuredVideo, setFeaturedVideo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
        fetchFeaturedVideo();
        checkUserStatus();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/videos');
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('获取视频列表失败:', error);
        }
    };

    const fetchFeaturedVideo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/featured-video');
            const data = await response.json();
            setFeaturedVideo(data);
            setLoading(false);
        } catch (error) {
            console.error('获取推荐视频失败:', error);
        }
    };

    const checkUserStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch('http://localhost:5000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('检查用户状态失败:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/videos?search=${searchTerm}`);
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('搜索失败:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        // 简化登录逻辑
        const mockUser = {
            id: 1,
            username: 'user123',
            name: '视频爱好者'
        };
        setUser(mockUser);
        localStorage.setItem('token', 'mock-jwt-token');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="App">
            {/* 导航栏 */}
            <nav className="navbar">
                <div className="nav-brand">
                    <i className="fas fa-play-circle"></i>
                    <span>IVideo</span>
                </div>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="搜索视频..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">
                        <i className="fas fa-search"></i>
                    </button>
                </form>

                <div className="nav-actions">
                    {user ? (
                        <div className="user-menu">
                            <span>欢迎, {user.name}</span>
                            <button onClick={handleLogout} className="btn-logout">
                                退出
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogin} className="btn-login">
                            登录
                        </button>
                    )}
                </div>
            </nav>

            {/* 主要内容区 */}
            <main className="main-content">
                {/* 推荐视频 */}
                {featuredVideo && (
                    <section className="featured-video">
                        <div className="video-container">
                            <video
                                controls
                                poster={featuredVideo.thumbnail}
                                className="featured-player"
                            >
                                <source src={featuredVideo.videoUrl} type="video/mp4" />
                                您的浏览器不支持视频播放。
                            </video>
                        </div>
                        <div className="video-info">
                            <h1>{featuredVideo.title}</h1>
                            <p className="video-description">{featuredVideo.description}</p>
                            <div className="video-meta">
                                <span><i className="fas fa-eye"></i> {featuredVideo.views} 次观看</span>
                                <span><i className="fas fa-calendar"></i> {featuredVideo.uploadDate}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* 视频列表 */}
                <section className="video-section">
                    <h2>推荐视频</h2>
                    <div className="video-grid">
                        {filteredVideos.map(video => (
                            <div key={video.id} className="video-card">
                                <div className="video-thumbnail">
                                    <img src={video.thumbnail} alt={video.title} />
                                    <div className="video-duration">{video.duration}</div>
                                </div>
                                <div className="video-details">
                                    <h3>{video.title}</h3>
                                    <p className="video-owner">{video.owner}</p>
                                    <div className="video-stats">
                                        <span><i className="fas fa-eye"></i> {video.views}</span>
                                        <span><i className="fas fa-calendar"></i> {video.uploadDate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 分类浏览 */}
                <section className="categories">
                    <h2>分类浏览</h2>
                    <div className="category-list">
                        <button className="category-btn">电影</button>
                        <button className="category-btn">电视剧</button>
                        <button className="category-btn">动漫</button>
                        <button className="category-btn">纪录片</button>
                        <button className="category-btn">音乐</button>
                        <button className="category-btn">教育</button>
                    </div>
                </section>
            </main>

            {/* 页脚 */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>IVideo</h3>
                        <p>提供高质量的视频流媒体服务</p>
                    </div>
                    <div className="footer-section">
                        <h4>链接</h4>
                        <ul>
                            <li><a href="#about">关于我们</a></li>
                            <li><a href="#contact">联系我们</a></li>
                            <li><a href="#privacy">隐私政策</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 IVideo. 保留所有权利。</p>
                </div>
            </footer>
        </div>
    );
}

export default App;