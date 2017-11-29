import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Route } from 'react-router-dom';

// import the different components here
import HomePage from './HomePage';
import Results from './Results';
import Recipe from './Recipe';

export default class App extends Component {

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/recipes' component={Results} />
                        <Route path='/recipe/:rid' component={Recipe} />
                    </Col>
                </Row>
            </Grid>
        );
    }

}
