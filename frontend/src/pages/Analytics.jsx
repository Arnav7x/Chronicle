import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent } from "../components/Card";


export default function Analytics() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs/analytics")
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        📊 Blog Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="rounded-2xl shadow-md border bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-600">Total Views</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {analytics.reduce((acc, b) => acc + b.views, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-600">Total Likes</h2>
            <p className="text-3xl font-bold text-green-600">
              {analytics.reduce((acc, b) => acc + b.likes, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-600">Total Comments</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {analytics.reduce((acc, b) => acc + b.comments.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bar Chart - Views & Likes */}
        <Card className="rounded-2xl shadow-md border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Views & Likes per Blog
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#8884d8" />
              <Bar dataKey="likes" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart - Comments Trend */}
        <Card className="rounded-2xl shadow-md border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Comments per Blog
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={(b) => b.comments.length} stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Popularity */}
        <Card className="rounded-2xl shadow-md border bg-white p-6 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Blog Popularity (Views Distribution)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={analytics}
                dataKey="views"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {analytics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
