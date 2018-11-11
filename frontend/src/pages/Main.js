import React, { Component } from "react";

import 'react-transitions/dist/animations.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import '../assets/css/main.css';

class Main extends Component {

    render() {
        return(
            <div className="containter">

                <div className="header">
                    <div className="grid-container">
                        <div className="grid-item">
                            <div className="wallet moveFromTopFade delay200">
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="title moveFromTopFade delay100">
                                <span className="fa fa-trello icon" /> Eos - Amplify <span className="fa fa-trello icon flip" />
                            </div>
                        </div>
                        <div className="grid-item"></div>
                    </div>
                </div>
                
                <div className="body">
                    <div className="grid-container">
                        <div className="grid-item">

                        </div>
                        <div className="grid-item"></div>
                        <div className="grid-item"></div>
                    </div>
                </div>

            </div>
        )
    }
}
export default Main;