import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# CONFIGURATION
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///kbsc.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'kbsc-luxury-secret-key' # Change in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# MODELS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='staff') # 'admin' or 'staff'
    status = db.Column(db.String(20), default='active') # 'active', 'left', 'pending'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.Text) # Base64 image
    total_sold = db.Column(db.Integer, default=0)
    # Sizes stored as JSON string
    sizes = db.Column(db.Text, default='{"6": 0, "7": 0, "8": 0, "9": 0, "10": 0}') 
    last_sold_date = db.Column(db.DateTime)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    email = db.Column(db.String(120))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20)) # 'present'

# INITIALIZE DATABASE
with app.app_context():
    db.create_all()
    # Create default admin if not exists
    if not User.query.filter_by(email='admin@gmail.com').first():
        hashed_pw = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin = User(email='admin@gmail.com', password=hashed_pw, role='admin', status='active')
        db.session.add(admin)
        db.session.commit()

# ROUTES
@app.route('/', methods=['GET'])
def health():
    return jsonify({"msg": "Backend is running!"}), 200

@app.route('/api', methods=['GET'])
def api_health():
    return jsonify({"msg": "API is ready"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and bcrypt.check_password_hash(user.password, data.get('password')):
        if user.status != 'active':
            return jsonify({"msg": f"Access Denied: Account {user.status}"}), 403
            
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": access_token,
            "role": user.role,
            "email": user.email,
            "uid": user.id
        }), 200
        
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id, "email": u.email, "role": u.role, 
        "status": u.status, "created_at": u.created_at
    } for u in users])

@app.route('/api/users', methods=['POST'])
@jwt_required()
def add_user():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "User already exists"}), 400
        
    hashed_pw = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    new_user = User(
        email=data.get('email'), 
        password=hashed_pw, 
        role=data.get('role', 'staff'),
        status='active'
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201

@app.route('/api/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    if 'status' in data: user.status = data['status']
    db.session.commit()
    return jsonify({"msg": "User updated"})

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        import json
        result = [{
            "id": p.id, "name": p.name, "price": p.price, 
            "image": p.image, "totalSold": p.total_sold,
            "sizes": json.loads(p.sizes), "last_sold_date": p.last_sold_date
        } for p in products]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error in get_products: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/products', methods=['POST'])
@jwt_required()
def add_product():
    data = request.get_json()
    import json
    new_p = Product(
        name=data.get('name'),
        price=data.get('price'),
        image=data.get('image'),
        sizes=json.dumps(data.get('sizes'))
    )
    db.session.add(new_p)
    db.session.commit()
    return jsonify({"msg": "Product added", "id": new_p.id}), 201

@app.route('/api/products/<int:p_id>', methods=['PATCH'])
@jwt_required()
def update_product(p_id):
    data = request.get_json()
    p = Product.query.get_or_404(p_id)
    import json
    if 'name' in data: p.name = data['name']
    if 'price' in data: p.price = data['price']
    if 'image' in data: p.image = data['image']
    if 'sizes' in data: p.sizes = json.dumps(data['sizes'])
    if 'totalSold' in data: p.total_sold = data['totalSold']
    if 'last_sold_date' in data: p.last_sold_date = datetime.utcnow()
    db.session.commit()
    return jsonify({"msg": "Product updated"})

@app.route('/api/products/<int:p_id>', methods=['DELETE'])
@jwt_required()
def delete_product(p_id):
    p = Product.query.get_or_404(p_id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"msg": "Product deleted"})

@app.route('/api/attendance', methods=['GET'])
@jwt_required()
def get_attendance():
    logs = Attendance.query.all()
    return jsonify([{
        "id": l.id, "email": l.email, "date": l.date, "status": l.status
    } for l in logs])

@app.route('/api/attendance', methods=['POST'])
@jwt_required()
def mark_attendance():
    data = request.get_json()
    new_a = Attendance(
        user_id=data.get('userId'),
        email=data.get('email'),
        status=data.get('status', 'present')
    )
    db.session.add(new_a)
    db.session.commit()
    return jsonify({"msg": "Attendance marked"}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
