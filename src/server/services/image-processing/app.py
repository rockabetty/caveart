# app.py
from flask import Flask, request, jsonify
from processor.tasks import process_comic_image

app = Flask(__name__)

@app.route('/tasks/process-comic', methods=['POST'])
def create_processing_task():
    try:
        data = request.get_json()

        required_fields = ['page_id', 'original_url', 'comic_id', 'page_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        task = process_comic_image.delay(
            data['page_id'],
            data['original_url'],
            data['comic_id'],
            data['page_number']
        )
        
        return jsonify({'task_id': task.id})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

@app.route('/tasks/<task_id>', methods=['GET'])
def get_task_status(task_id):
    try:
        task = process_comic_image.AsyncResult(task_id)
        response = {
            'task_id': task_id,
            'status': task.status,
            'result': task.result if task.status == 'SUCCESS' else None
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500