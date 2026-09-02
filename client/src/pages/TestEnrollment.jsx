import { useEffect, useState } from "react";
import API from "../api";

export default function TestEnrollment() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const test = async () => {
      try {
        // Test 1: Get my enrollments
        const res = await API.get('/api/enrollments/my-courses');
        setData(res.data);
        console.log("Enrollments:", res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error("Error:", err);
      }
    };
    test();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Enrollment Test</h1>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">Error: {error}</div>}
      {data ? (
        <div className="bg-green-100 p-4 rounded">
          <p className="font-bold">You are enrolled in {data.length} course(s):</p>
          <ul className="mt-2">
            {data.map((enrollment, idx) => (
              <li key={idx} className="mb-1">
                - {enrollment.course?.title || "Unknown Course"}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}