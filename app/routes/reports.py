from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.db import get_db

reports_bp = Blueprint("reports", __name__)


# ============================================================
# GET /api/reports/courses-50-plus
# Courses with 50 or more students
# ============================================================
@reports_bp.route("/reports/courses-50-plus", methods=["GET"])
@jwt_required()
def courses_50_plus():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Only admins can view reports"}), 403

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM view_courses_50_plus ORDER BY student_count DESC")
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()


# ============================================================
# GET /api/reports/students-5-plus-courses
# Students enrolled in 5 or more courses
# ============================================================
@reports_bp.route("/reports/students-5-plus-courses", methods=["GET"])
@jwt_required()
def students_5_plus():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Only admins can view reports"}), 403

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM view_students_5_plus_courses ORDER BY course_count DESC")
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()


# ============================================================
# GET /api/reports/lecturers-3-plus-courses
# Lecturers teaching 3 or more courses
# ============================================================
@reports_bp.route("/reports/lecturers-3-plus-courses", methods=["GET"])
@jwt_required()
def lecturers_3_plus():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Only admins can view reports"}), 403

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM view_lecturers_3_plus_courses ORDER BY course_count DESC")
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()


# ============================================================
# GET /api/reports/top-10-enrolled-courses
# Top 10 most enrolled courses
# ============================================================
@reports_bp.route("/reports/top-10-enrolled-courses", methods=["GET"])
@jwt_required()
def top_10_courses():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Only admins can view reports"}), 403

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        # Query directly to avoid MySQL LIMIT-in-view issue
        cursor.execute("""
            SELECT c.course_id, c.course_code, c.course_name,
                   COUNT(e.student_id) AS student_count
            FROM course c
            JOIN enrollment e ON c.course_id = e.course_id
            GROUP BY c.course_id, c.course_code, c.course_name
            ORDER BY student_count DESC
            LIMIT 10
        """)
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()


# ============================================================
# GET /api/reports/top-10-students
# Top 10 students by overall grade average
# ============================================================
@reports_bp.route("/reports/top-10-students", methods=["GET"])
@jwt_required()
def top_10_students():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Only admins can view reports"}), 403

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        # Query directly to avoid MySQL LIMIT-in-view issue
        cursor.execute("""
            SELECT s.student_id, u.first_name, u.last_name, u.email,
                   ROUND(AVG((sub.grade / a.max_grade) * 100), 2) AS average_percentage
            FROM student s
            JOIN user       u   ON s.user_id         = u.user_id
            JOIN submission sub ON s.student_id      = sub.student_id
            JOIN assignment a   ON sub.assignment_id = a.assignment_id
            WHERE sub.grade IS NOT NULL
            GROUP BY s.student_id, u.first_name, u.last_name, u.email
            ORDER BY average_percentage DESC
            LIMIT 10
        """)
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()