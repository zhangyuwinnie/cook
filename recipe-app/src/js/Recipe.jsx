import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {MapsLocalDining} from 'material-ui/svg-icons';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import _ from 'lodash';
import axios from 'axios';

export class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterCriteria: ['Milk', 'Eggs', 'Butter', 'Banana', 'Tomato'],
            recipe: {
                id: 1,
                Name: 'Tomato Soup',
                Tags: 'Comfort-Food',
                Cusine: 'Italian',
                Type: 'Hot',
                TimeToCook: '30 minutes',
                IngredientsName: ['Vegetable Oil', 'Onion', 'Garilc', 'Tomato', 'Vegetable Stock', 'Tomato Paste', 'Pepper'],
                Substitutions: { 'Vegetable Stock': 'Chicken Stock' , 'Tomato': 'Tomato Puree'},
                IngredientsDetails: ['2 tablespoons vegetable oil', '2 onions, chopped', '4 cloves garlic, minced', '1 can stewed tomatoes', '3 cups vegetable stock', '1/4 cup tomato paste', '1/2 teaspoon pepper'],
                Steps: ['Heat oil over med heat in a saucepan.', 'Cook onions and garlic stirring for 5 minutes.', 'Add tomatoes, stock, tomato paste and pepper.', 'Bring to a boil then reduce heat and simmer 15 minutes or until slightly thickened Puree with an immersion blender or ordinary blender.'],
                Image: 'http://cdn-image.foodandwine.com/sites/default/files/styles/medium_2x/public/201308-xl-tomato-soup-with-chickpeas-and-pasta.jpg?itok=UY8q3aEd',
            }
         }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props === nextProps) return;

        if (nextProps) {
            this.setState({
                recipe: {
                    id: 1,
                    Name: 'Tomato Soup',
                    Tags: 'Comfort-Food',
                    Cusine: 'Italian',
                    Type: 'Hot',
                    TimeToCook: '30 minutes',
                    IngredientsName: ['Vegetable Oil', 'Onion', 'Garilc', 'Tomato', 'Vegetable Stock', 'Tomato Paste', 'Pepper'],
                    Substitutions: { 'Vegetable Stock': 'Chicken Stock' , 'Tomato': 'Tomato Puree'},
                    IngredientsDetails: ['2 tablespoons vegetable oil', '2 onions, chopped', '4 cloves garlic, minced', '1 can stewed tomatoes', '3 cups vegetable stock', '1/4 cup tomato paste', '1/2 teaspoon pepper'],
                    Steps: ['Heat oil over med heat in a saucepan.', 'Cook onions and garlic stirring for 5 minutes.', 'Add tomatoes, stock, tomato paste and pepper.', 'Bring to a boil then reduce heat and simmer 15 minutes or until slightly thickened Puree with an immersion blender or ordinary blender.'],
                    Image: 'http://cdn-image.foodandwine.com/sites/default/files/styles/medium_2x/public/201308-xl-tomato-soup-with-chickpeas-and-pasta.jpg?itok=UY8q3aEd',
                }
            });
        }
    }

    componentDidMount() {
        let path = this.props.location.pathname;
        let search = path.split('/')[2];
        axios.get(`http://localhost:4200/recipes/${search}`)
        .then((response) =>{
            console.log(response.data);
          this.setState({recipe : response.data[0]});
        });


    }

    render() {
        const recipe = this.state.recipe;
        let stepCount = 0;
        let ingredientCount = 0;
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
                                            <Row start="xs"> <Col xs={4}> <font color='green'> {ingredientDetail} </font> </Col> </Row>
                                        );
                                    } else {
                                        return (
                                            <Row start="xs">
                                                <Col xs={5}> <font color='red'> {ingredientDetail} </font> </Col>
                                                <Col> <font color='green'> <i> {'substitution ---> '} </i> {recipe.Substitutions[ingredient] || 'NO SUBSTITUTIONS AVAILABLE'} </font> </Col>
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
                        <CardText>
                            {renderRecipe(recipe)}
                        </CardText>
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