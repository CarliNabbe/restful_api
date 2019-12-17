const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     veganRecipe: {
        type: String,
        required: true
     },
     ingredients: {
        type: String,
        required: true
     }
})

recipeSchema.set('toObject', {
   virtuals: true
})

recipeSchema.set('toJSON', {
   virtuals: true
})


// Add virtual properties

recipeSchema.virtual('_links').get(function() {
   return {
       "self": {
           "href": 'http://145.24.222.82:8000/recipes/' + this._id
       },
       "collection": {
           "href": 'http://145.24.222.82:8000/recipes'
       }
   };
});

module.exports = mongoose.model('Recipe', recipeSchema)