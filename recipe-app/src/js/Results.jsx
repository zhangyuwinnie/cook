import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ChipsArray from './util/ChipsArray';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {MapsLocalDining} from 'material-ui/svg-icons';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import _ from 'lodash';
import axios from 'axios';

export class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterCriteria: ['Milk', 'Eggs', 'Butter', 'Banana', 'Tomato'],
            filterCount: 0,
            recipes: [
                {
                    id: 1,
                    Name: 'Tomato Soup',
                    Tags: 'Comfort-Food',
                    Cusine: 'Italian',
                    Type: 'Hot',
                    TimeToCook: '30 minutes',
                    IngredientsName: ['Vegetable Oil', 'Onion', 'Garilc', 'Tomato', 'Vegetable Stock', 'Tomato Paste', 'Pepper'],
                    Substitutions: { 'Vegetable Stock': 'Chicken Stock' , 'Tomato': 'Tomato Puree'},
                    Image: 'http://cdn-image.foodandwine.com/sites/default/files/styles/medium_2x/public/201308-xl-tomato-soup-with-chickpeas-and-pasta.jpg?itok=UY8q3aEd',
                },
                {
                    id: 2,
                    Name: 'Easy Cheesy Omlette',
                    Tags: 'Quick-Eats',
                    Cusine: 'American',
                    Type: 'Hot',
                    TimeToCook: '4 minutes',
                    IngredientsName: ['Eggs', 'Milk', 'Bell Pepper', 'Onion', 'Mozarella Cheese', 'Ketchup'],
                    Image: 'http://img1.cookinglight.timeinc.net/sites/default/files/styles/4_3_horizontal_-_1200x900/public/image/2017/01/main/half-moon-browned-omelet.jpg?itok=GQs78MTg',
                },

            ],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) return;
        alert(nextProps);
        nextProps = { filterCriteria: [
            'Milk', 'Eggs', 'Butter', 'Banana'
        ]};
        this.setState({ filterCriteria: nextProps.ingredientsSelected });
    }

    componentDidMount() {
        let selected = this.props.location.state.ingredientsSelected;
        console.log(selected);
        axios.get('http://localhost:4200/recipes',{
           params: {
            ingredients: selected
           }
        })
        // .then(res => this.setState({ recipes: res.data }))
        .then(response => {

          this.setState({ recipes: response.data});
        })
        .catch(function (error) {
          console.log(error);
        });
        // console.log(this.state.recipes);
    }

    changeFilter = () => {
        const currentCount = this.state.filterCount;
        const newCount = (currentCount === 6) ? 1 : currentCount + 1;
        this.setState({
            filterCount: newCount,
        });
    }

    addFilterTags = (option) => () => {
        let newFilters = [];
        const buttonHighlightId = `${this.state.filterCount}|${option}`;
        let hightlightFlag;
        if (_.includes(this.state.filterCriteria, option)) {
            const tagToDelete = this.state.filterCriteria.indexOf(option);
            this.state.filterCriteria.splice(tagToDelete, 1);
            newFilters = this.state.filterCriteria;
            hightlightFlag = false;
        } else {
            newFilters = this.state.filterCriteria.concat(option);
            hightlightFlag = true;
        }
        this.setState({ filterCriteria: newFilters, [buttonHighlightId]: [hightlightFlag] });
    }

    handleChips = (arrayValue, chipDeleted) => {
        const buttonHighlightId = `${this.state.filterCount}|${chipDeleted}`;
        this.setState({ filterCriteria: arrayValue, [buttonHighlightId]: false });
    }

    modifyIngredients = () => {
        alert('route back to homepage, but with state');
        // TODO: router - pass the state
        this.props.history.push({pathname: '/', state: {...this.state}});
    }

    openRecipe = (recipeId) => () => {
        this.props.history.push(`/recipe/${recipeId}`);
    }

    render() {
        const currentState = {...this.state};
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
                        <div>
                            <hr />
                        </div>
                        <div id="blank">
                        </div>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <FilterOptions filterProps={currentState} changeFilter={this.changeFilter}
                                           addFilterTags={this.addFilterTags} modifyIngredients={this.modifyIngredients} />
                        </Col>
                        <Col xs={8}>
                            <ShowResults filterCriteria={this.state.filterCriteria} handleChips={this.handleChips}
                                         recipes={this.state.recipes} openRecipe={this.openRecipe} modifyIngredients={this.modifyIngredients}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

class FilterOptions extends Component {

    renderCard = (data) => {
        const style = {
            words:{
                margin:20,
                fontFamily:'Indie Flower',
                fontSize: '40px',
                color:'orange'
            },
            button: {
                margin: 20,
            },
            card: {
                display: 'block',
                height: '100vh',
                width:"100%",
                margin:'auto',
                align:'center',
                display:'inline-block',
                border:'0px',
                boxShadow:'none'

            },
            button:{

                margin: '15px',

            }
        };
        const filterProps = this.props.filterProps;
        if (data.Type === 'Landing') {
            return (
                <Card  style={style.card}>
                    <CardHeader />
                    <CardMedia>
                        <img src={data.Image} alt="" />
                    </CardMedia>
                    <CardActions>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </CardActions>
                </Card>
            );
        } else if (data.Type === 'Restart') {
            return (
                <Card style={style.card}>
                    <CardHeader />
                    <CardMedia>
                        <img src={data.Image} alt="" />
                    </CardMedia>
                    <CardActions>
                        <FlatButton  backgroundColor="#d7dcdd" label="Let's start again" onClick={this.props.changeFilter} />
                    </CardActions>
                </Card>
            );
        } else if (data.Type === 'MultiSelect') {
            return (
                <Card style={style.card}>
                    <CardHeader />
                    <CardMedia>
                        <Row>
                            <strong style={style.words}> {data.Text} </strong>
                        </Row>
                        <Row center="xs"> {data.Options.map(option => { const flag = (`${filterProps.filterCount}|${option}` in filterProps) ? filterProps[`${filterProps.filterCount}|${option}`][0] : false; return (<RaisedButton backgroundColor="#c9e9ef" style={style.button} key={option} label={option} primary={flag} style={style.button} onClick={this.props.addFilterTags(option)} />); })} </Row>
                    </CardMedia>
                    <CardActions>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </CardActions>
                </Card>
            );
        } else if (data.Type === 'MultiCheckbox') {
            return (
                <Card style={style.card}>
                    <CardHeader />
                    <CardMedia>
                        <Row>
                            <strong style={style.words}> {data.Text} </strong>
                        </Row>
                        <Row center="xs"> {data.Options.map(option => <Checkbox style={{textAlign:"left", marginLeft:"100"}} key={option} label={option} checked={_.includes(filterProps.filterCriteria, option)} onCheck={this.props.addFilterTags(option)} />)} </Row>
                    </CardMedia>
                    <CardActions>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </CardActions>
                </Card>
            );
        } else {
            return (
                <Card style={style.card}>
                    <CardHeader />
                    <CardMedia>
                        <Row>
                            <strong style={style.words}> {data.Text} </strong>
                        </Row>
                        <Row center="xs"> {data.Options.map(option => <RaisedButton backgroundColor="#c9e9ef" style={style.button} key={option} label={option} primary={filterProps[`${filterProps.filterCount}|${option}`]} style={style.button} onClick={this.props.addFilterTags(option)} />)} </Row>
                    </CardMedia>
                    <CardActions>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </CardActions>
                </Card>
            );
        }

    }

    selectCardToDisplay = (count) => {
        switch(count) {
            case 0: return ({
                Type: 'Landing',
                Image: 'https://allidoiscook.files.wordpress.com/2015/07/609341_orig.jpg',
            });
            case 1: return ({
                Type: 'MultiSelect',
                Text: 'Any particular type of dish in mind (Select all that apply)',
                Options: ['Breakfast', 'Appetizers', 'Main Course', 'Finger Food', 'Snacks', 'Desserts'],
            });
            case 2: return ({
                Type: 'MultiCheckbox',
                Text: 'Which cusine are you in the mood for (Select all that apply)',
                Options: ['Italian', 'Indian', 'American', 'Thai', 'Southern', 'Middle Eastern'],
            });
            case 3: return ({
                Type: 'SingleSelect',
                Text: 'In the mood for something hot or cold',
                Options: ['Hot', 'Cold'],
            });
            case 4: return ({
                Type: 'SingleSelect',
                Text: 'How much time do you have (Select closest match - including prep time)',
                Options: ['< 15 mins', '15 mins - 30 mins', '30 mins - 1 hour', '1 hour - 2 hours', '> 2 hours'],
            });
            case 5: return ({
                Type: 'MultiSelect',
                Text: 'Do any of these categories sound good (Select all that apply)',
                Options: ['Game Day', 'Weeknight Dinners', 'Office Lunch', 'Quick Eats', 'Slow Cook', 'Meal Prep'],
            });
            case 6: return ({
                Type: 'Restart',
                Image: 'http://cdn.makeuseof.com/wp-content/uploads/2013/12/reboot-computer-errors.jpg',
            });
        }
    }

    render() {
        const data = this.selectCardToDisplay(this.props.filterProps.filterCount);
        return (
            <Row middle="xs">{this.renderCard(data)}</Row>
        );
    }
}

class ShowResults extends Component {
    renderRecipe = (recipe) => {
        const usedIngredients = _.intersection(this.props.filterCriteria, recipe.IngredientsName);
        const missingItems = recipe.Substitutions ? Object.keys(recipe.Substitutions) : '';
        const overlayCardTitle = !!recipe.Substitutions ? `Substitutions available for: ${missingItems}` : 'You have all ingredients';
        return (
            <Col xs={4} key={recipe.Name}>
                <Card>
                    <CardHeader title={recipe.Name} />
                    <CardMedia
                        overlay={<CardTitle subtitle={overlayCardTitle} /> }
                    >
                    <img src={recipe.Image} alt="" />
                    </CardMedia>
                    <CardText>
                        {`This recipe uses your: ${usedIngredients}`}
                    </CardText>
                    <CardActions>
                        <FlatButton backgroundColor="#d7dcdd" label="View Full Recipe" onClick={this.props.openRecipe(recipe.id)}/>
                    </CardActions>
                </Card>
            </Col>
        );
    }

    render() {
        return (
            <div>
                <Row center="xs">
                    <Col xs={10}>
                        <ChipsArray chipData={this.props.filterCriteria} handleChips={this.props.handleChips} />
                    </Col>
                    <Col xs={2}>
                        <RaisedButton label="Modify" secondary={true}
                                      icon={<MapsLocalDining />} onClick={this.props.modifyIngredients}
                                      />
                    </Col>
                </Row>
                <Row>
                    {this.props.recipes.map(recipe => this.renderRecipe(recipe))}
                </Row>
            </div>
        );
    }
}