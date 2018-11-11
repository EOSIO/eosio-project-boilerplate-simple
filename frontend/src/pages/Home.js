import React, { Component } from "react";

import '../assets/css/home.css';
import splashImg from '../assets/images/splash.png';

class Home extends Component {
    render() {
        return(
            <div className="containter">
                <div className="box">
                    <div className="circle-1" />
                    <div className="circle-2" />
                    <div className="circle-3" />
                    <div className="circle-4" />
                    <img src={splashImg} className="splash-img" alt="splash-img" />
                </div>
            </div>
        )
    }
}
export default Home;