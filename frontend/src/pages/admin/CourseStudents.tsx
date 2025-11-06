// src/pages/admin/CourseStudents.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import api from '../../services/api';

interface Student {
  id: number;
  full_name: string;
  email: string;
}

interface Course {
  id: number;
  title: string;
}

export default function CourseStudents() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    
    fetchStudents();
    fetchAllStudents();
    fetchAllCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/admin/courses/${courseId}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load enrolled students');
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setAllStudents(res.data);
    } catch (err) {
      console.error('Failed to load all students');
    }
  };
  
  const fetchAllCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setAllCourses(res.data);
    } catch (err) {
      console.error('Failed to load all courses');
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedStudent || !selectedCourse) return;

  setLoading(true);
  try {
    await api.post(`/admin/courses/${selectedCourse}/enroll-student`, {
      studentId: selectedStudent
    });
    alert('Student enrolled successfully!');
    fetchStudents(); // Refresh the current course's student list
    setSelectedStudent('');
    setSelectedCourse('');
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to enroll student');
  }
  setLoading(false);
};

  const handleUnenroll = async (studentId: number) => {
    if (!window.confirm('Are you sure you want to unenroll this student?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}/unenroll-student/${studentId}`);
      alert('Student unenrolled successfully!');
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to unenroll student');
    }
  };
 
  const handleBackToLogin = async () => {
    await logout(); // Clear auth state
    navigate('/login', { replace: true }); // Go to login, prevent back navigation
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Course Enrollments</h1>
        {/* ✅ Replace or supplement existing back button */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back
          </button>
          <button
            onClick={handleBackToLogin}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ↪ Back to Login
          </button>
        </div>
      </div>

      {/* Enroll New Student Form */}
      <div className="bg-white p-4 rounded-lg border mb-8">
        <h2 className="text-lg font-semibold mb-3">Enroll New Student</h2>
        <form onSubmit={handleEnroll} className="flex gap-3 flex-wrap md:flex-nowrap">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
            className="flex-1 p-2 border rounded min-w-[200px]"
            required
          >
            <option value="">Select a student</option>
            {allStudents
              .filter((s) => !students.some((enrolled) => enrolled.id === s.id))
              .map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} ({student.email})
                </option>
              ))}
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            className="flex-1 p-2 border rounded min-w-[200px]"
            required
          >
            <option value="">Select a course</option>
            {allCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Enrolling...' : 'Enroll'}
          </button>
        </form>
      </div>

      {/* Enrolled Students List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Enrolled Students ({students.length})
        </h2>
        {students.length === 0 ? (
          <p className="text-gray-500">No students enrolled in this course.</p>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <div className="font-medium">{student.full_name}</div>
                  <div className="text-sm text-gray-600">{student.email}</div>
                </div>
                <button
                  onClick={() => handleUnenroll(student.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Unenroll
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}