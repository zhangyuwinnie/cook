import React, { Component } from 'react';
import '../css/App.css';
import '../css/style.css';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import AutoComplete from 'material-ui/AutoComplete';
import {MapsLocalDining} from 'material-ui/svg-icons';
import ChipsArray from './util/ChipsArray';
import CollapsiblePanel from './util/CollapsiblePanel';
// import RecipeService from './RecipeService';
import axios from 'axios';

export class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {ingredientsByCategory: {}, ingredientsWithoutCategory: []};
    }

    componentDidMount() {
        let results = [];

        axios.get('http://localhost:4200/')
        // .then(res => this.setState({ recipes: res.data }))
        .then(response => {
          console.log(response.data);
          results = response.data;
          const allIngredients = results;
            console.log(allIngredients);
            const ingredientsByCategory = {};
            let ingredientsWithoutCategory = [];
            allIngredients.forEach(ingredient => {
                const category = ingredient.Category;
                if(ingredientsByCategory.hasOwnProperty(category)) {
                    const values = ingredientsByCategory[category];
                    const newValues = _.concat(values, ingredient.Name);
                    ingredientsByCategory[category] = newValues;
                } else {
                    ingredientsByCategory[category] = ingredient.Name;
                }
                ingredientsWithoutCategory.push(ingredient.Name);
            })

            this.setState({
                ingredientsByCategory,
                ingredientsWithoutCategory
            })
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    render() {
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
                        <div id="description">
                            <span id="description">Let's see what ingredients you have</span>
                        </div>
                    </Row>
                    <InputIngredients allIngredients={this.state.ingredientsByCategory}
                                      ingredientsName={this.state.ingredientsWithoutCategory}
                                      history={this.props.history}/>

                 </Grid>

            </div>
        );
    }
}

class InputIngredients extends Component {

    constructor(props) {
        super(props);
        this.state = {showTextInput: false, initial: true, ingredientsSelected: []};
        // this.recipeService = new RecipeService();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props)return;

        if(nextProps.ingredientsSelected) {
            this.setState({ ingredientsSelected: nextProps.ingredientsSelected });
        }
    }

    render() {
        const text = "Let's see what ingredients you have";

        const buttonStyle = {
            margin: 60,
        };

        const renderContent = () => {
            return (
                <div>
                    {this.state.ingredientsSelected.length > 0
                        ? <RaisedButton label="Let's Start" secondary={true} icon={<MapsLocalDining />}
                            onClick={this.showRecipes} />
                        : <div />
                    }
                    <div>
                       <br/>
                    </div>
                    {this.state.showTextInput
                        ? <TypeIngredients ingredientsSelected={this.state.ingredientsSelected} allIngredients={this.props.ingredientsName} handleTextInput={this.handleTextInput}/>
                        : <SelectIngredients ingredientsSelected={this.state.ingredientsSelected} allIngredients={this.props.allIngredients} handleCheckbox={this.handleCheckbox} />
                    }
                </div>
            );
        }

        return (
            <Grid fluid>
                <Row>
                </Row>
                <Row center="xs">
                    <Col xs={12}>
                        <RaisedButton backgroundColor="#c9e9ef" id={"type"} label="Type Ingredients" primary={this.state.showTextInput} style={buttonStyle} onClick={this.selectInputMethod("type")} />
                        <RaisedButton backgroundColor="#c9e9ef" id={"select"} label="Select from list" primary={this.state.initial ? false : !this.state.showTextInput} style={buttonStyle} onClick={this.selectInputMethod("select")} />
                    </Col>
                </Row>
                <Row center="xs">
                    <Col xs={12} lg={6}>
                        { this.state.initial ? <div /> :  renderContent()  }
                    </Col>
                </Row>
            </Grid>
        );
    }

    handleCheckbox = (eventType, item) => {
        let ingredientsSelected = this.state.ingredientsSelected;
        if(eventType === 'add') {
            ingredientsSelected = [...ingredientsSelected, item];
        } else {
            _.remove(ingredientsSelected, toBeRemoved =>  item === toBeRemoved);
        }
        this.setState({ ingredientsSelected });
    }

    handleTextInput = (text) => {
        this.setState({
            ingredientsSelected: [...this.state.ingredientsSelected, text]
        });
    }

    selectInputMethod = (id) => () => {
        const showTextInput = (id === "type");
        this.setState({ showTextInput, initial: false });
    }

    showRecipes = () => {
        // TODO: router here - pass the state
        // console.log(this.props);
        this.props.history.push({pathname: '/recipes', state: {...this.state}});
    }
}

class TypeIngredients extends Component {

    constructor(props) {
        super(props);
        this.state = {searchText: ''};
    }

    render () {
        const ingredientsAvailable = this.props.ingredientsSelected;
        const allIngredients = this.props.allIngredients;
        const ingredientsList = _.difference(allIngredients, ingredientsAvailable);

        return (
            <div>
                <Row center="xs">
                    <Col xs={12}>
                        <AutoComplete
                            floatingLabelText="Type Ingredients"
                            searchText={this.state.searchText}
                            filter={AutoComplete.caseInsensitiveFilter}
                            dataSource={ingredientsList}
                            onNewRequest={this.handleAutoComplete}
                            onUpdateInput={this.handleUpdateInput}
                            ref={(input) => {this.autoCompleteInput = input;}}
                        />
                    </Col>
                </Row>
                <Row center="xs">
                    <Col xs={12}>
                        <ChipsArray chipData={this.props.ingredientsSelected} handleChips={this.handleChips} />
                    </Col>
                </Row>
            </div>
        );
    }

    componentDidMount(){
        this.autoCompleteInput.refs.searchTextField.input.focus();
    }

    handleChips = (arrayValue) => {
        this.setState({ ingredientsSelected: arrayValue });
    }

    handleUpdateInput = (searchText) => {
        this.setState({ searchText });
    }

    handleAutoComplete = (chosenRequest, index) => {
        this.setState({ searchText: '' });
        let item = chosenRequest;
        if(index === -1) {
            item = _.startCase(chosenRequest);
        }
        this.props.handleTextInput(item);
        this.autoCompleteInput.refs.searchTextField.input.focus();
    }
}



class SelectIngredients extends Component {
    renderContent = (key) => {
        return (
            <Col xs={6}>
                <CollapsiblePanel  key={key} Category={key}
                                  data={this.props.allIngredients[key]}
                                  selected={this.props.ingredientsSelected}
                                  handleCheckbox={this.props.handleCheckbox}/>
            </Col>
        )
    }



    render () {
        return (
            <Row >
                { Object.keys(this.props.allIngredients).map(key => this.renderContent(key)) }
            </Row>
        );
    }
}
