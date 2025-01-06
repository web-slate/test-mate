'use client';

import { useState, useEffect } from 'react';

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export default function UserSelection({ selectUser }) {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setUsers(JSON.parse(storedResults));
    }
  }, []);

  const addUser = (name) => {
    // Check for duplicate user
    const userExists = users.some(user => 
      user.user && typeof user.user === 'string' && user.user.toLowerCase() === name.toLowerCase()
    );
    
    if (userExists) {
      setError('User already exists.');
      return;
    }
  
    const newUser = {
      user: name,
      type: 'easy',
      score: 0,
      totalQuestions: 0,
      date: new Date().toISOString()
    };
  
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('quizResults', JSON.stringify(updatedUsers));
    setError(''); // Clear any previous error
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      setError('Please enter a name.');
      return;
    }
    
    addUser(newUserName.trim());
    setNewUserName('');
  };

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Enter your name"
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add User
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-2xl font-bold mb-4">{users.length === 0 ? 'No' : ''} Test Results</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {users.map((user) => (
          <div key={user.user + user.date} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white text-xl font-bold rounded">
                  {user.user?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{user.user}</h3>
                  <p className="text-sm text-gray-500" suppressHydrationWarning>
                    {formatDate(user.date)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => selectUser(user)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Select
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{user.score}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{user.totalQuestions}</div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div>
                <div className="text-lg font-semibold capitalize">{user.type}</div>
                <div className="text-sm text-gray-500">Level</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
