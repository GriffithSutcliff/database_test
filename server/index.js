const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors'); // подключим cors, без него реакт не сможет взаимодействовать с бд

dotenv.config();

const app = express();
const port = 5000;

// Подключение к базе данных
const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "testdatabase",
  password: "root",
  port: 5432,
});

// нужно указать экспрессу что мы работаем с json файлами
app.use(express.json());

app.use(cors());

// Проверка подключения
pool.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Успешное подключение к базе данных');
  }
});

//ВАЖНО, если мы не напишем здесь методы типа get post и тд. То мы не сможем работать с такими запросами через fetch в реакте.
//если в вашем проекте при использовании функции появляется ошибка, возможно вы забыли прописать для неё метод в экспрессе.
//Если у вас несколько таблиц, для каждой нужно писать методы.

//создаем функционал для получения пользователей
app.get('/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

//для добавления пользователей
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await pool.query(
      'INSERT INTO users (name, email) VALUES($1, $2) RETURNING *',
      [name, email]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Удаление пользователя
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    if (deleteUser.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'Пользователь удален', user: deleteUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
