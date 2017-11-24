import gql from 'graphql-tag';
import { graphql, compose, withApollo } from 'react-apollo';
import { HomePage } from './HomePage';

// Define the graphql query to retrieve the exhaustive ingredients list
const allIngredientsQuery = gql`
    query AllIngredients {
        ingredients {
            Name
            Category
        }
    }
`;

// Use the graphql container to run the allIngredientsQuery query
const HomePageContainer = compose (
    withApollo,
    graphql(allIngredientsQuery, {
        options: (ownProps) => ({ variables: null }), name: 'allIngredients'
}))(HomePage);

export default HomePageContainer;