import React, { Component } from "react";
import { Link } from 'react-router-dom'; 

import '../assets/css/home.css';
import splashImg from '../assets/images/splash.png';

class Home extends Component {
    render() {
        return(
            <div className="containter">
                <Link to="/main">
                <div className="box">
                    <img src={splashImg} className="splash-img" alt="splash-img" />
                </div>
                </Link>
            </div>
        )
    }
}
export default Home;