import axios from 'axios';

class RecipeService {

  getRecipes(data){
    axios.get('http://localhost:4200/recipes',{
           params: {
            ingredients: data
           }
        })
        // .then(res => this.setState({ recipes: res.data }))
        .then(function (response) {
            console.log(response.data);
            return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
  }
  // getRecipes(data){
  //   axios.get('http://localhost:4200/recipes',{
  //          params: {
  //           ingredients: data
  //          }
  //       })
  //       .then(res => this.setState({ recipes: res.data }))
  //       .catch(err => console.log(err))
  // }

}

export default RecipeService;
