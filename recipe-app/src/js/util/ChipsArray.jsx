import React, {Component} from 'react';
import Chip from 'material-ui/Chip';

export default class ChipsArray extends Component {

    constructor(props) {
        super(props);
        this.styles = {
            chip: { margin: 4 },
            wrapper: { display: 'flex', flexWrap: 'wrap' },
        };
    }

    handleRequestDelete = (key) => {
        this.chipData = this.props.chipData;
        const chipToDelete = this.chipData.indexOf(key);
        this.chipData.splice(chipToDelete, 1);
        this.props.handleChips(this.chipData);
    };

    renderChip(data) {
        return (
            <Chip
                key={data}
                onRequestDelete={() => this.handleRequestDelete(data)}
                style={this.styles.chip}
            >
                {data}
            </Chip>
        );
    }

    render() {
        return (
          <div style={this.styles.wrapper}>
                {this.props.chipData.map(item => this.renderChip(item))}
          </div>
        );
    }
}