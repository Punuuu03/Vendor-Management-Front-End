// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Admindashboard from './Components/Admindashboard';
import Adashinner from './Components/Adashinner';
import Addcategory from './Components/Addcategory';
import Addsubcategory from './Components/Addsubcategory';

import Customerdashboard from './Components/Customerdashboard';
import Home from './Components/Home';
import About from './Components/About';
import Contact from './Components/Contact';
import Apply from './Components/Apply';
import Category from './Components/Category';
// import "./style.css";
import './App.css'
import Verifydocuments from "./Components/Verifydocuments";
import DistributorList from "./Components/Distributorlist";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/Registration" element={<Registration />} />
          <Route path="/" element={<Login />} />
           <Route path="/Admindashboard" element={<Admindashboard />} />
           <Route path="/Adashinner" element={<Admindashboard><Adashinner /></Admindashboard>} />
           <Route path="/Addcategory" element={<Admindashboard><Addcategory /></Admindashboard>} />
           <Route path="/Addsubcategory" element={<Admindashboard><Addsubcategory /></Admindashboard>} />

           <Route path="/Verifydocuments" element={<Admindashboard><Verifydocuments /></Admindashboard>} />
           <Route path="/distributorlist" element={<Admindashboard><DistributorList/></Admindashboard>} />

          <Route path="/Customerdashboard" element={<Customerdashboard />} />
          <Route path="/Home" element={<Customerdashboard><Home /></Customerdashboard>} />
          <Route path="/About" element={<Customerdashboard><About /></Customerdashboard>} />
          {/* <Route path="/distributor-dashboard" element={<DistributorDashboard />} />  */}
          <Route path="/Contact" element={<Customerdashboard><Contact /></Customerdashboard>} />
          <Route path="/Apply" element={<Customerdashboard><Apply/></Customerdashboard>} />
          <Route path="/Category" element={<Customerdashboard><Category /></Customerdashboard>} />
 
        </Routes>
      </Router>
    );
  }

export default App
