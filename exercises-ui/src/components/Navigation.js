import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <>
            <nav class="nav">
                <h4>
                    Navigation: &nbsp;
                    <Link to="/">Home</Link>
                    &nbsp;
                    &nbsp;
                    <Link to="/add-exercise">Record Exercise</Link>
                </h4>
            </nav>
        </>
    );
}

export default Navigation;