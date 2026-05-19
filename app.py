import sqlite3
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'static', 'data', 'bread.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    try:
        create_references = "CREATE TABLE IF NOT EXISTS bible_references (id INTEGER PRIMARY KEY AUTOINCREMENT, start_book_id INTEGER NOT NULL, start_chapter INTEGER NOT NULL, start_verse INTEGER NOT NULL, start_index INTEGER, end_book_id INTEGER NOT NULL, end_chapter INTEGER NOT NULL, end_verse INTEGER NOT NULL, end_index INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
        create_notes = "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, reference_id INTEGER NOT NULL, type TEXT NOT NULL, content TEXT NOT NULL, privacy TEXT DEFAULT 'public', translation TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (reference_id) REFERENCES bible_references (id))"
        cursor.execute(create_references)
        cursor.execute(create_notes)
        conn.commit()
    except Exception as e:
        print(f"Database initialization error: {e}")
        conn.rollback()
    finally:
        conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/initialize', methods=['GET'])
def initialize():
    init_db()
    return jsonify({'status': 'initialized'})

@app.route('/api/content', methods=['GET'])
def get_content():
    book_id = request.args.get('book_id')
    chapter = request.args.get('chapter')

    if not book_id or not chapter:
        return jsonify({'error': 'Missing book_id or chapter'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT r.*, n.content, n.type, n.privacy
        FROM bible_references r
        LEFT JOIN notes n ON r.id = n.reference_id
        WHERE r.start_book_id = ? AND r.start_chapter = ?
        ORDER BY r.id, n.type
    ''', (book_id, chapter))

    rows = cursor.fetchall()

    if not rows:
        conn.close()
        return jsonify([])

    result = []
    current_reference = None

    for row in rows:
        if current_reference != row['id']:
            if current_reference is not None:
                result[-1]['passage'] = passage

            passage = {
                'id': row['id'],
                'reference': {
                    'startBookId': row['start_book_id'],
                    'endBookId': row['end_book_id'],
                    'startChapter': row['start_chapter'],
                    'endChapter': row['end_chapter'],
                    'startVerse': row['start_verse'],
                    'endVerse': row['end_verse'],
                    'startIndex': row['start_index'],
                    'endIndex': row['end_index']
                },
                'notes': [],
                'tags': []
            }
            current_reference = row['id']

        if row['type'] == 'note':
            passage['notes'].append(row['content'])
        elif row['type'] == 'tag':
            passage['tags'].append(row['content'])

    if current_reference is not None:
        passage['passage'] = passage
        result.append(passage)

    conn.close()
    return jsonify(result)

@app.route('/api/reference', methods=['GET'])
def get_reference():
    start_book_id = request.args.get('start_book_id')
    start_chapter = request.args.get('start_chapter')
    start_verse = request.args.get('start_verse')
    start_index = request.args.get('start_index')
    end_book_id = request.args.get('end_book_id')
    end_chapter = request.args.get('end_chapter')
    end_verse = request.args.get('end_verse')
    end_index = request.args.get('end_index')

    if not all([start_book_id, start_chapter, start_verse, start_index,
                 end_book_id, end_chapter, end_verse, end_index]):
        return jsonify({'error': 'Missing reference parameters'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM bible_references
        WHERE start_book_id = ? AND start_chapter = ? AND start_verse = ?
    ''', (start_book_id, start_chapter, start_verse))

    row = cursor.fetchone()

    if not row:
        cursor.execute('''
            INSERT INTO bible_references
            (start_book_id, start_chapter, start_verse, start_index,
             end_book_id, end_chapter, end_verse, end_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (start_book_id, start_chapter, start_verse, start_index,
              end_book_id, end_chapter, end_verse, end_index))
        conn.commit()
        row = cursor.fetchone()

    conn.close()
    return jsonify(dict(row))

@app.route('/api/content', methods=['POST'])
def create_content():
    data = request.json
    reference_id = data.get('reference_id')
    content_type = data.get('type')
    content = data.get('content')
    privacy = data.get('privacy', 'public')
    translation = data.get('translation')

    if not all([reference_id, content_type, content, translation]):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO notes
        (reference_id, type, content, privacy, translation)
        VALUES (?, ?, ?, ?, ?)
    ''', (reference_id, content_type, content, privacy, translation))

    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'id': cursor.lastrowid})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)