import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  // Функция для загрузки списка пользователей
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  };

  // Загрузка пользователей
  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]); // Обновляем список пользователей
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
      }
  
      const result = await response.json();
      console.log(result.message);
      
      fetchUsers();
  
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  return (
    <div>
      <h1>Добавление пользователя</h1>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={addUser}>Добавить пользователя</button>

      <h2>Список пользователей</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => deleteUser(user.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;