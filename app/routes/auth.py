from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.db import get_db
import bcrypt

auth_bp = Blueprint("auth", __name__)


# ============================================================
# POST /api/register
# ============================================================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required = ["username", "password", "first_name", "last_name", "email", "role"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    role = data["role"]
    if role not in ("admin", "lecturer", "student"):
        return jsonify({"error": "Role must be admin, lecturer or student"}), 400

    password_hash = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    try:
        # Insert into user table
        cursor.execute("""
            INSERT INTO user (username, password_hash, first_name, last_name, email, role)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["username"],
            password_hash,
            data["first_name"],
            data["last_name"],
            data["email"],
            role
        ))
        user_id = cursor.lastrowid

        # Insert into subtype table
        if role == "student":
            cursor.execute("""
                INSERT INTO student (user_id, major, year_level)
                VALUES (%s, %s, %s)
            """, (user_id, data.get("major"), data.get("year_level")))

        elif role == "lecturer":
            cursor.execute("""
                INSERT INTO lecturer (user_id, department)
                VALUES (%s, %s)
            """, (user_id, data.get("department")))

        elif role == "admin":
            cursor.execute("INSERT INTO admin (user_id) VALUES (%s)", (user_id,))

        conn.commit()
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()


# ============================================================
# POST /api/login
# ============================================================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password required"}), 400

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT * FROM user WHERE username = %s
        """, (data["username"],))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        if not bcrypt.checkpw(data["password"].encode(), user["password_hash"].encode()):
            return jsonify({"error": "Invalid credentials"}), 401

        # Create JWT token with user info embedded
        token = create_access_token(identity=str(user["user_id"]), additional_claims={
            "role":     user["role"],
            "username": user["username"]
        })

        return jsonify({
            "message":      "Login successful",
            "access_token": token,
            "user_id":      user["user_id"],
            "role":         user["role"]
        }), 200

    finally:
        cursor.close()
        conn.close()