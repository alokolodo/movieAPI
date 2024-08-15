import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { ProfileView } from '../profile-view/profile-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);

      axios.get('https://glacial-retreat-35130-2f56298b8e37.herokuapp.com/movies', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
    }
  }, []);

  const handleLogin = (username, password) => {
    axios.post('https://glacial-retreat-35130-2f56298b8e37.herokuapp.com/login', {
      username,
      password
    })
    .then(response => {
      if (response.data.user) {
        // Store user data and token in localStorage
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      } else {
        alert('Login failed. No user data returned.');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed. Please check your username and password.');
    });
  };

  const handleSignup = (user) => {
    axios.post('https://glacial-retreat-35130-2f56298b8e37.herokuapp.com/users', user)
      .then(response => {
        handleLogin(user.username, user.password);
      })
      .catch(error => {
        console.error('Signup error:', error);
        alert('Signup failed.');
      });
  };

  return (
    <Router>
      <NavigationBar user={user} />
      <Container>
        <Row>
          <Routes>
            <Route path="/" element={
              user ? <MovieCard movies={movies} /> : <Navigate to="/login" replace />
            } />
            <Route path="/login" element={<LoginView onLoggedIn={handleLogin} />} />
            <Route path="/signup" element={<SignupView onSignedUp={handleSignup} />} />
            <Route path="/movies/:movieId" element={
              user ? <MovieView movies={movies} /> : <Navigate to="/login" replace />
            } />
            <Route path="/profile" element={
              user ? <ProfileView user={user} setUser={setUser} /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </Row>
      </Container>
    </Router>
  );
};
