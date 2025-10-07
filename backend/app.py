# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# 模拟视频数据
def generate_videos():
    categories = ['电影', '电视剧', '动漫', '纪录片', '音乐', '教育']
    videos = []

    for i in range(1, 21):
        video = {
            'id': i,
            'title': f'示例视频 {i} - {random.choice(["动作", "喜剧", "科幻", "爱情", "悬疑"])}',
            'description': f'这是示例视频 {i} 的详细描述，包含精彩的内容和故事情节。',
            'thumbnail': f'https://picsum.photos/400/225?random={i}',
            'videoUrl': f'/static/videos/video{i}.mp4',
            'owner': f'创作者 {random.randint(1, 10)}',
            'views': random.randint(1000, 1000000),
            'duration': f'{random.randint(1, 2)}:{random.randint(0, 59):02d}',
            'uploadDate': (datetime.now() - timedelta(days=random.randint(1, 365))).strftime('%Y-%m-%d'),
            'category': random.choice(categories)
        }
        videos.append(video)

    return videos

videos_data = generate_videos()

@app.route('/api/videos', methods=['GET'])
def get_videos():
    search_term = request.args.get('search', '')

    if search_term:
        filtered_videos = [video for video in videos_data
                           if search_term.lower() in video['title'].lower()]
        return jsonify(filtered_videos)

    return jsonify(videos_data)

@app.route('/api/featured-video', methods=['GET'])
def get_featured_video():
    featured = random.choice(videos_data)
    return jsonify(featured)

@app.route('/api/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    video = next((v for v in videos_data if v['id'] == video_id), None)
    if video:
        # 增加观看次数
        video['views'] += 1
        return jsonify(video)
    return jsonify({'error': '视频未找到'}), 404

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = list(set(video['category'] for video in videos_data))
    return jsonify(categories)

@app.route('/api/videos/category/<category>', methods=['GET'])
def get_videos_by_category(category):
    category_videos = [video for video in videos_data if video['category'] == category]
    return jsonify(category_videos)

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    # 简化的用户认证检查
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        # 在实际应用中，这里会验证JWT token
        user_data = {
            'id': 1,
            'username': 'user123',
            'name': '视频爱好者',
            'email': 'user@example.com',
            'joinDate': '2024-01-01'
        }
        return jsonify(user_data)
    return jsonify({'error': '未授权'}), 401

@app.route('/api/videos/upload', methods=['POST'])
def upload_video():
    # 简化的视频上传端点
    # 在实际应用中，这里会处理文件上传和元数据存储
    return jsonify({
        'message': '视频上传成功',
        'videoId': len(videos_data) + 1
    })

@app.route('/api/search/suggestions', methods=['GET'])
def get_search_suggestions():
    query = request.args.get('q', '')
    if len(query) < 2:
        return jsonify([])

    suggestions = [video['title'] for video in videos_data
                   if query.lower() in video['title'].lower()][:5]
    return jsonify(suggestions)

if __name__ == '__main__':
    app.run(debug=True, port=5000)