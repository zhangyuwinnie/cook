import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {MapsLocalDining} from 'material-ui/svg-icons';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import _ from 'lodash';
import axios from 'axios';

export default class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipe: null
         }
    }

    componentDidMount() {
        let path = this.props.location.pathname;
        let search = path.split('/')[2];
        axios.get(`http://localhost:4200/recipes/${search}`)
        .then((response) =>{
            console.log(response.data);
          this.setState({recipe : response.data[0], filterCriteria: this.props.location.state.filterCriteria});
        });
    }

    render() {
        const recipe = this.state.recipe;
        let stepCount = 0;
        let ingredientCount = 0;

        const substitutions = recipe && recipe.Substitutions[0] ? recipe.Substitutions[0] : {};
        let substitutionItems = {};

        if (recipe) {
          const missingItems = recipe ? _.difference(recipe.IngredientsName, this.state.filterCriteria) : [];
          const recipeSubs = recipe.Substitutions;
          const substitutionItemReqd = recipeSubs.length > 0 ? _.intersection(Object.keys(recipeSubs[0]), missingItems) : [];
          substitutionItemReqd.forEach(item => {
            const substitutes = recipeSubs[0][item];
            const availableSub = _.intersection(substitutes, this.state.filterCriteria);
            if (availableSub.length > 0) {
              substitutionItems = {
                ...substitutionItems,
                [item]: [availableSub]
              }
            }
          });
        }


        const renderRecipe = (recipe) => {
            return (
                <Row>
                    <Col xs={12}>
                        <Row center="xs"> <Col> <h2><b> {recipe.Name} </b></h2> </Col> </Row>
                        <Row>
                            <Col xs={6}>
                                <img src={recipe.Image} alt="" width="500" height="400"/>
                            </Col>
                            <Col xs={6}>
                                <Row>
                                    <Col> <h3> <b> {'Ingredients'} </b> </h3> </Col>
                                </Row>
                                {recipe.IngredientsName.map(ingredient => {
                                    const ingredientDetail = recipe.IngredientsDetails[ingredientCount];
                                    ingredientCount++;
                                    if (_.includes(this.state.filterCriteria, ingredient)) {
                                        return (
                                            <Row key={ingredientCount} start="xs"> <Col xs={4}> <font color='green'> {ingredientDetail} </font> </Col> </Row>
                                        );
                                    } else if (_.includes(Object.keys(substitutionItems), ingredient)) {
                                        return (
                                            <Row key={ingredientCount} start="xs">
                                                <Col xs={5}> <font color='red'> {ingredientDetail} </font> </Col>
                                                <Col> <font color='green'> <i> {'substitute ---> '} </i> {substitutionItems[ingredient][0]} </font> </Col>
                                            </Row>
                                        );
                                    } else {
                                        return (
                                            <Row key={ingredientCount} start="xs">
                                                <Col xs={5}> <font color='red'> {ingredientDetail} </font> </Col>
                                            </Row>
                                        );
                                    }
                                })}
                                <Row>
                                    <Col> <h3> <b> {'Steps'} </b> </h3> </Col>
                                </Row>
                                <ol>
                                    {recipe.Steps.map(eachStep => {
                                        return (
                                            <li key={stepCount++} style={{textAlign: "left"}}> {eachStep} </li>
                                        );
                                    })}
                                </ol>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        }
        return (
            <div className="App">
                <Grid fluid>
                    <Row>
                        <div id="head">
                            <div id="big_title">
                                <span id="title1">Cooking Simplified</span>
                            </div>
                            <div id="small_title">
                                <span id="title2">- From Fridge To The Table</span>
                            </div>
                        </div>

                        <div id="blank">
                        </div>
                    </Row>
                    <Card>
                        {recipe ?
                        <CardText>
                            {renderRecipe(recipe)}
                        </CardText> : <div> {'Loading'} </div>}
                        <CardActions>
                            <RaisedButton label="Search Results" secondary={true} icon={<MapsLocalDining />}
                                onClick={this.showRecipes} />
                            <FlatButton label="Restart All Over" onClick={() => this.props.history.push('/')} />
                        </CardActions>
                    </Card>
                </Grid>
            </div>
        );
    }

    showRecipes = () => {
        // TODO: router here - pass the state
        this.props.history.push({pathname: '/recipes', state: {...this.state}});
    }
}
