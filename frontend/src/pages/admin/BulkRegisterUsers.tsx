import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import api from '../../services/api';
import logo from '/logo.png';
import { PiUsersBold } from 'react-icons/pi';

type RegisterRole = 'student' | 'teacher';

type UploadResult = {
  total: number;
  success: number;
  failed: number;
  errors: string[];
};

type RegisterRow = {
  full_name: string;
  email: string;
  password: string;
  rowNumber: number;
};

export default function BulkRegisterUsers() {
  const navigate = useNavigate();

  const [role, setRole] = useState<RegisterRole | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const getCsvColumnValue = (row: Record<string, unknown>, columnNames: string[]) => {
    for (const columnName of columnNames) {
      const matchKey = Object.keys(row).find(
        (key) => key.trim().toLowerCase() === columnName.toLowerCase()
      );
      if (!matchKey) continue;
      const value = row[matchKey];
      if (value === null || value === undefined) continue;
      const trimmed = String(value).trim();
      if (trimmed.length > 0) return trimmed;
    }
    return '';
  };

  const parseUsersFromCsv = (uploadFile: File): Promise<{ users: RegisterRow[]; errors: string[] }> =>
    new Promise((resolve, reject) => {
      Papa.parse<Record<string, unknown>>(uploadFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors?.length) {
            reject(new Error(results.errors[0].message));
            return;
          }

          const users: RegisterRow[] = [];
          const errors: string[] = [];

          results.data.forEach((row, index) => {
            const fullName = getCsvColumnValue(row, ['name', 'full_name']);
            const email = getCsvColumnValue(row, ['email']);
            const password = getCsvColumnValue(row, ['password']);
            const rowNumber = index + 2;

            if (!fullName || !email || !password) {
              errors.push(`Row ${rowNumber}: missing name, email, or password.`);
              return;
            }

            users.push({ full_name: fullName, email, password, rowNumber });
          });

          resolve({ users, errors });
        },
        error: (error) => reject(error),
      });
    });

  const handleBulkRegister = async () => {
    if (!role || !file) return;

    setSubmitting(true);
    setResult(null);

    try {
      const { users, errors: parseErrors } = await parseUsersFromCsv(file);

      if (users.length === 0 && parseErrors.length === 0) {
        setResult({
          total: 0,
          success: 0,
          failed: 0,
          errors: ['No valid rows found. Make sure the CSV has name, email, and password columns.'],
        });
        return;
      }

      let success = 0;
      let failed = parseErrors.length;
      const errors = [...parseErrors];

      for (const user of users) {
        try {
          await api.post('/auth/register', {
            full_name: user.full_name,
            email: user.email,
            password: user.password,
            role,
          });
          success += 1;
        } catch (err: any) {
          failed += 1;
          const errorMsg = err.response?.data?.error || 'Registration failed.';
          errors.push(`Row ${user.rowNumber} (${user.email}): ${errorMsg}`);
        }
      }

      setResult({
        total: users.length + parseErrors.length,
        success,
        failed,
        errors,
      });
    } catch (err: any) {
      setResult({
        total: 0,
        success: 0,
        failed: 0,
        errors: [err?.message || 'Failed to parse CSV file.'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src={logo}
              alt="Spectropy Logo"
              className="h-10 w-auto md:h-10 lg:h-12 rounded-md"
            />
          </div>
          <h1 className="text-lg font-semibold">Bulk Register</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setRole('student')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              role === 'student'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <PiUsersBold className="text-lg text-black" />
              <span>Register Students</span>
            </div>
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              role === 'teacher'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <PiUsersBold className="text-lg text-black" />
              <span>Register Teachers</span>
            </div>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-900 hover:text-blue-600"
          >
            Back To Admin Dashboard
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            {role === 'student' && 'Bulk Register Students'}
            {role === 'teacher' && 'Bulk Register Teachers'}
            {!role && 'Bulk Register Users'}
          </h1>
          <p className="text-gray-600 mt-1">
            Upload a CSV exported from Excel with columns: name, email, password.
          </p>
        </div>

        <div className="p-6 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">Sample CSV template</p>
                <p className="text-sm text-gray-500">
                  Use this template to match the required columns.
                </p>
              </div>
              <a
                href="/samples/user_register_sample.csv"
                download
                className="text-blue-900 font-medium hover:underline"
              >
                Download Sample
              </a>
            </div>

            {result && (
              <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">
                <p>
                  Processed: {result.total} | Success: {result.success} | Failed: {result.failed}
                </p>
                {result.errors.length > 0 && (
                  <div className="mt-2 space-y-1 text-red-600">
                    {result.errors.slice(0, 6).map((error, index) => (
                      <p key={`${error}-${index}`}>{error}</p>
                    ))}
                    {result.errors.length > 6 && (
                      <p>And {result.errors.length - 6} more...</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Upload CSV *</label>
              <input
                type="file"
                accept=".csv"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                If you are using Excel, save the file as CSV (UTF-8).
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={!role || !file || submitting}
                onClick={handleBulkRegister}
                className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {submitting ? 'Uploading...' : 'Upload & Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
