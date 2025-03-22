import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Home from './components/Home.js'
import Dashboard from './components/Dashboard.js'


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element= { <Login /> }/>
        <Route path='/register' element= { <Register /> }/>
        <Route path='/dashboard' element= { <Dashboard /> }/>
        <Route path='/' element= { <Home /> }/>
      </Routes>
    </Router>
  );
}

export default App;