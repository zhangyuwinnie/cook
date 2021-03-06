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

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterCount: 0, recipes: [], filterCriteria: [],
            filterIngredients: [], filteredRecipes: [], filterTags: [], filterChanged: false
        };
        this.recipeResults = [];
        this.handleChips = this.handleChips.bind(this);
        this.filterNames = ['Breakfast', 'Appetizers', 'Main Course', 'Finger Food', 'Snacks',
                            'Desserts','Italian', 'Indian', 'American', 'Thai', 'Southern',
                            'Middle Eastern','Hot', 'Cold','< 15 mins', '15 mins - 30 mins',
                            '30 mins - 1 hour', '1 hour - 2 hours', '> 2 hours','Game Day',
                            'Weeknight Dinners', 'Office Lunch', 'Quick Eats', 'Slow Cook', 'Meal Prep'];
        this.filterTags = ['Tags', 'Cusine', 'Type', 'TimeToCook'];
    }

    componentDidMount() {
        // route from homepage
        let query = null;
        let selected = this.props.location.state.ingredientsSelected;
        if (selected != null){
            query = selected;
            this.setState({filterCriteria: selected});
            this.setState({filterIngredients: selected});
        }
        // console.log(this.state.filterCriteria);

        // route from recipe details
        let criteria = this.props.location.state.filterCriteria;
        console.log(criteria);
        let ingredients = this.props.location.state.filterIngredients;
        if (criteria != null){
            query = ingredients;
            this.setState({filterCriteria: criteria,filterIngredients: ingredients});
        }


        console.log(query);

        axios.get('http://localhost:4200/recipes',{
           params: {
            ingredients: query
           }
        })
        .then(response => {
          console.log(response.data);
          this.setState({ recipes: response.data, filteredRecipes: response.data });
          this.recipeResults = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    changeFilter = () => {
        const currentCount = this.state.filterCount;
        const newCount = (currentCount === 6) ? 1 : currentCount + 1;
        this.setState({
            filterCount: newCount, filterChanged: true, filterTags: []
        });
    }

    addFilterTags = (option) => () => {
        let newFilters = [];
        const buttonHighlightId = `${this.state.filterCount}|${option}`;
        let hightlightFlag;
        let filteredList = [];
        let newFilterTags = [];
        if (this.state.filterChanged) {
            this.setState({ recipes: this.state.filteredRecipes})
            this.recipeResults = this.state.filteredRecipes;
        }
        if (_.includes(this.state.filterCriteria, option)) {
            const tagToDelete = this.state.filterCriteria.indexOf(option);
            this.state.filterCriteria.splice(tagToDelete, 1);
            newFilters = this.state.filterCriteria;
            hightlightFlag = false;
            if (_.includes(this.state.filterTags, option)) {
                const tagToDelete = this.state.filterTags.indexOf(option);
                this.state.filterTags.splice(tagToDelete, 1);
                newFilterTags = this.state.filterTags;
            }
        } else {
            newFilters = this.state.filterCriteria.concat(option);
            newFilterTags = this.state.filterTags.concat(option);
            hightlightFlag = true;
        }
        filteredList = this.recipeResults.filter(recipe => {
            return this.filterTags.some(someTag => {
                if (recipe[someTag]) {
                    const tags = recipe[someTag].split(',');
                    const a = _.intersection(tags, newFilterTags).length > 0;
                    return (_.intersection(tags, newFilterTags).length > 0);
                } else {
                    return false;
                }
            })
        })
        if (newFilterTags.length === 0) {
            filteredList = this.recipeResults;
        }
        this.setState({
            filterCriteria: newFilters, [buttonHighlightId]: [hightlightFlag],
            filteredRecipes: filteredList, filterTags: newFilterTags, filterChanged: false });
    }

    handleChips = (arrayValue, chipDeleted) => {
        const buttonHighlightId = `${this.state.filterCount}|${chipDeleted}`;
        const newFilterTags = _.intersection(this.filterNames, arrayValue);
        let filteredList = [];
        filteredList = this.recipeResults.filter(recipe => {
            return this.filterTags.some(someTag => {
                if (recipe[someTag]) {
                    const tags = recipe[someTag].split(',');
                    const a = _.intersection(tags, newFilterTags).length > 0;
                    return (_.intersection(tags, newFilterTags).length > 0);
                } else {
                    return false;
                }
            })
        })
        if (newFilterTags.length === 0) {
            filteredList = this.recipeResults;
        }
        this.setState({ filterCriteria: arrayValue, [buttonHighlightId]: false,
                        filterTags: newFilterTags, filteredRecipes: filteredList });
        // new request if ingredients deleted

        if (this.filterNames.find((name) => name === chipDeleted)){
            return;
        } else {
            let previous = this.state.filterIngredients;
            _.pull(previous, chipDeleted);
            this.setState({filterIngredients : previous});
            // query with new selected ingredients if not empty
            if (previous.length > 0){
                axios.get('http://localhost:4200/recipes',{
                   params: {
                    ingredients: previous
                   }
                })
                .then(response => {
                    this.setState({ recipes: response.data});
                    this.recipeResults = response.data;
                })
                .catch(function (error) {
                  console.log(error);
                });
            } else {
                this.setState({ recipes: []});
                this.recipeResults = []
            }
        }
    }

    modifyIngredients = () => {
        // alert('route back to homepage, but with state');
        // TODO: router - pass the state
        this.props.history.push({pathname: '/', state: {...this.state}});
    }

    openRecipe = (recipeName) => () => {
        this.props.history.push({ pathname: `/recipe/${recipeName}`, state: {...this.state} });
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
                                         recipes={this.recipeResults} filteredRecipes={this.state.filteredRecipes}
                                         openRecipe={this.openRecipe} modifyIngredients={this.modifyIngredients}/>
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
                fontSize: '35px',
                color:'orange'
            },
            button: {
                margin: 20,
            },
            card: {
                display: 'block',
                height: '100vh',
                width:"100%",
                height:"600px",
                margin:'auto',
                align:'center',
                display:'inline-block',
                border:'0px',
                boxShadow:'none',
                // border:"2px solid blue"
            },
            cardheader:{
                width:"100%",
                height: "20px",
                // border:"2px solid red"
            },
            cardtitle:{
                height: "200px",
                width:"100%",
                // border:"2px solid red"
            },
            cardcontent:{
                height: "170px",
                width:"100%",
                // border:"2px solid blue"
            },
            cardaction:{
                marginTop:"30px",
                height: "170px",
                // border:"2px solid yellow"
            },
            cardimg:{
                height:"403px",
                // border:"2px solid green"
            },
            button:{

                margin: '15px',

            },
            img1:{
                height:"80%",
                width:"90%",
            },
            img2:{
                height:"85%",
                width:"100%",
            }

        };
        const filterProps = this.props.filterProps;
        if (data.Type === 'Landing') {
            return (
                <div  style={style.card}>

                    <div style={style.cardheader}>
                    </div>
                    <div style={style.cardimg}>
                        <img style={style.img1} src={data.Image} alt="" />
                    </div>
                    <div style={style.cardaction}>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </div>

                </div>
            );
        } else if (data.Type === 'Restart') {
            return (
                <div  style={style.card}>
                    <div style={style.cardheader}>
                    </div>
                    <div style={style.cardimg}>
                        <img style={style.img2} src={data.Image} alt="" />
                    </div>
                    <div style={style.cardaction}>
                        <FlatButton backgroundColor="#d7dcdd" label="Let's start again" onClick={this.props.changeFilter} />
                    </div>

                </div>
            );
        } else if (data.Type === 'MultiSelect') {
            return (
                <div  style={style.card}>
                    <div style={style.cardheader}>
                    </div>
                    <div style={style.cardtitle}>
                        <Row >
                            <strong style={style.words}> {data.Text} </strong>
                        </Row>
                    </div>
                    <div style={{height:"30px"}}>
                    </div>
                    <div style = {style.cardcontent}>
                        <Row center="xs"> {data.Options.map(option => { const flag = (`${filterProps.filterCount}|${option}` in filterProps) ? filterProps[`${filterProps.filterCount}|${option}`][0] : false; return (<RaisedButton backgroundColor="#c9e9ef" style={style.button} key={option} label={option} primary={flag} style={style.button} onClick={this.props.addFilterTags(option)} />); })} </Row>
                     </div>
                    <div style={style.cardaction}>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </div>

                </div>
            );
        } else if (data.Type === 'MultiCheckbox') {
            return (
                <div  style={style.card}>
                    <div style={style.cardheader}>
                    </div>
                    <div style={style.cardtitle}>
                        <Row >
                            <strong style={style.words}> {data.Text} </strong>
                        </Row>
                    </div>
                    <div style={{height:"30px"}}>
                    </div>
                    <div style = {style.cardcontent}>
                        <Row center="xs"> {data.Options.map(option => <Checkbox style={{textAlign:"left", marginLeft:"100"}} key={option} label={option} checked={_.includes(filterProps.filterCriteria, option)} onCheck={this.props.addFilterTags(option)} />)} </Row>
                    </div>
                    <div style={style.cardaction}>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </div>

                </div>
            );
        } else {
            return (
                <div  style={style.card}>
                    <div style={style.cardheader}>
                    </div>
                    <div style={style.cardtitle}>
                        <Row >
                            <strong style={style.words}> {data.Text} </strong>
                        </Row>
                    </div>
                    <div style={{height:"30px"}}>
                    </div>
                    <div style = {style.cardcontent}>
                        <Row center="xs"> {data.Options.map(option => <RaisedButton backgroundColor="#c9e9ef" style={style.button} key={option} label={option} primary={filterProps[`${filterProps.filterCount}|${option}`]} style={style.button} onClick={this.props.addFilterTags(option)} />)} </Row>
                    </div>
                    <div style={style.cardaction}>
                        <FlatButton backgroundColor="#d7dcdd" label="I don't see anything I like" onClick={this.props.changeFilter} />
                    </div>
                </div>
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
        const missingItems = _.difference(recipe.IngredientsName, this.props.filterCriteria);
        const recipeSubs = recipe.Substitutions;
        const substitutionItemReqd = recipeSubs.length > 0 ? _.intersection(Object.keys(recipeSubs[0]), missingItems) : [];
        const substitutionItems = [];
        substitutionItemReqd.forEach(item => {
          const substitutes = recipeSubs[0][item];
          if (_.intersection(substitutes, this.props.filterCriteria).length > 0) {
            substitutionItems.push(item);
          }
        });
        let overlayCardTitle = '';
        if (missingItems.length === 0) {
          overlayCardTitle = 'You have all ingredients';
        } else {
          overlayCardTitle = substitutionItems.length > 0 ? `Substitutions available for: ${substitutionItems}` : 'Nothing available to substitute missing ingredients';
        }
        return (
            <Col xs={4} key={recipe.Name}>
                <Card style={{height:"350px",position:"relative"}}>
                    <CardHeader title={recipe.Name} />
                    <CardMedia
                        overlay={<CardTitle subtitle={overlayCardTitle} /> }
                    >
                    <img style={{height:"173px"}} src={recipe.Image} alt="" />
                    </CardMedia>
                    <CardText>
                        {`This recipe uses your: ${usedIngredients}`}
                    </CardText>
                    <CardActions style={{position:"absolute", bottom:"5px"}}>
                        <FlatButton backgroundColor="#d7dcdd" label="View Full Recipe" onClick={this.props.openRecipe(recipe.Name)}/>
                    </CardActions>

                </Card>
                <Row style={{height:"20px"}}>
                </Row>
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
                {this.props.filteredRecipes.length > 0
                    ?
                    <Row>
                        {this.props.filteredRecipes.map(recipe => this.renderRecipe(recipe))}
                    </Row>
                    :
                    <h3> {'Oops, sorry no result found. Try removing some filters'} </h3>
                }
            </div>
        );
    }
}
