import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';

export const ProfileView = ({ user, setUser }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(user.birthday);

  const handleUpdate = (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const updatedUser = {
      username,
      email,
      password,
      birthday
    };

    axios.put(`https://glacial-retreat-35130-2f56298b8e37.herokuapp.com/users/${user.username}`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      alert('Profile updated successfully!');
    })
    .catch(error => console.error('Error updating user:', error));
  };

  if (!user) {
    return <h1>LOGIN AGAIN</h1>; // Handle the case where user is null
  }

  const favoriteMovies = Array.isArray(user.favoriteMovies)
    ? movies.filter(m => user.favoriteMovies.includes(m._id))
    : [];

  return (
    <div>
      <h2>Profile</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Update</Button>
      </Form>
      <h3>Favorite Movies</h3>
      <Row>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <Col md={4} key={movie._id}>
              <MovieCard
                movie={movie}
                onFavorite={() => onFavorite(movie._id)}
                onRemoveFavorite={() => onRemoveFavorite(movie._id)}
                isFavorite={true}
              />
            </Col>
          ))
        ) : (
          <p>No favorite movies found.</p>
        )}
      </Row>
    </div>
  );
};
