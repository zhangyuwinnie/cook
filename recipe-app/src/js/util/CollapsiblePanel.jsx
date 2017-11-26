import React, { Component } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import _ from 'lodash';
import { Col } from 'react-flexbox-grid';
import { Grid, Row, Cell } from 'react-inline-grid';


const rowstyle = {
  backgroundColor: "white",
  textAlign:"left",
  display: "flex",
  flexRlow: "wrap"
};
const headerstyle = {
  backgroundColor: "#b3b8bf",
  textAlign:"center",
};

const checkboxstyle = {

};

export default class CollapsiblePanel extends Component {

    renderCheckboxes = (item) => {
        return (
                <Cell is="5 tablet-6 phone-6">
                    <Checkbox style={{margin:'5px 5px 5px 5px'}}
                        key={item}
                        label={item}
                        checked={_.includes(this.props.selected, item)}
                        onCheck={this.updateCheck(item)}
                    />
                </Cell>


        );
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader style={headerstyle}
                        title={this.props.Category}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
                    <CardText style={rowstyle} expandable={true}>
                        <Grid>
                            <Row >
                            { this.props.data.map(item => this.renderCheckboxes(item)) }
                            </Row>
                        </Grid>
                    </CardText>
                </Card>
                <br/>
            </div>
        );


    }

    updateCheck = (item) => (event, isChecked) => {
        let eventType = 'remove';
        if(isChecked) {
            eventType = 'add';
        }
        this.props.handleCheckbox(eventType, item);
    }
}
