const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipe')
const cors = require('cors')


// Getting all 
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
        res.json({
            "items": recipes, 
            "_links": {
                "self": {
                    "href": "http://145.24.222.82:8000/recipes"
                }
            },
            "pagination": {
            "currentpage": 1,
            "currentItems": 3,
            "totalPages": "",
            "totalItems": "",
            "_links": {
                "first": {
                    "page": "http://145.24.222.82:8000/recipes",
                    "href": "http://145.24.222.82:8000/recipes/page/1"
                },
                "last": {
                    "page": "http://145.24.222.82:8000/recipes",
                    "href": "http://145.24.222.82:8000/recipes/page/1"
                },
                "previous": {
                    "page": "http://145.24.222.82:8000/recipes",
                    "href": `http://145.24.222.82:8000/recipes/page/1`
                },
                "next": {
                    "page": "http://145.24.222.82:8000/recipes",
                    "href": `http://145.24.222.82:8000/recipes/page/2`
                }
            }
        }
    })
    } catch (err) {
        res.status(500).json({ message: err.message })
        if (req.headers.accept != 'application/json') {
            res.sendStatus(400);
        }
    }
})



// Getting one
router.get('/:id', getRecipe, (req, res) => {
    // res.json(res.recipe)

    Recipe.findById(req.params.id)
        .then(recipe => {
            if (!recipe) {
                return res.status(404).send({
                    message: "recipe not found with id " + req.params.id
                });
            }

            res.set('Access-Control-Allow-Origin', '*')
            res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

            res.status(200).send(recipe);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "recipe not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving recipe with id " + req.params.id
            });
        });

})
// Creating one
router.post('/', async (req, res) => {
    const recipe = new Recipe({
        name: req.body.name,
        veganRecipe: req.body.veganRecipe,
        ingredients: req.body.ingredients
    })

    try {
        const newRecipe = await recipe.save()
        res.status(201).json(newRecipe)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
// Updating one
router.put('/:id', getRecipe, async (req, res) => {
    if (req.body.name != null) {
        res.recipe.name = req.body.name
    }
    if (req.body.veganRecipe != null) {
        res.recipe.veganRecipe = req.body.veganRecipe
    }
    if (req.body.ingredients != null) {
        res.recipe.ingredients = req.body.ingredients
    }
    try {
        const updatedRecipe = await res.recipe.save()
        res.json(updatedRecipe)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating all
// router.put('/:id', getRecipe, async (req, res) => {
//     if (req.body.name != null) {
//         res.recipe.name = req.body.name
//     }
//     if (req.body.veganRecipe != null) {
//         res.recipe.veganRecipe = req.body.veganRecipe
//     }
//     if (req.body.ingredients != null) {
//         res.recipe.ingredients = req.body.ingredients
//     }
//     try {
//         const updatedRecipe = await res.recipe.save()
//         res.json(updatedRecipe)
//     } catch (err) {
//         res.status(400).json({ message: err.message })
//     }
// })

router.options('/', function(req, res) {

    
    
    let headers = {};

    headers['Access-Control-Allow-Origin'] = '*';
    headers['Content-Type'] = 'Content-Type', 'text/html; charset=UTF-8';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    headers['Allow'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Content-Length'] = '0';
    headers["Access-Control-Max-Age"] = '86400';
    
    res.writeHead(200, headers);
    
    res.send();          
})

// Options
router.options('/:id', function(req, res) {

    
    
    let headers = {};

    headers['Access-Control-Allow-Origin'] = '*';
    headers['Content-Type'] = 'Content-Type', 'text/html; charset=UTF-8';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    headers['Allow'] = 'GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Methods'] = 'GET, PUT, DELETE, OPTIONS';
    headers['Content-Length'] = '0';
    headers["Access-Control-Max-Age"] = '86400';
    
    res.writeHead(200, headers);
    
    res.send();          
})

// Deleting one
router.delete('/:id', getRecipe, async (req, res) => {
    try {
        await res.recipe.remove()
        res.status(204).json({ message: 'Deleted recipe' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getRecipe(req, res, next) {
    let recipe
    try {
        recipe = await Recipe.findById(req.params.id)
        if (recipe == null) {
            return res.status(404).json({ message: 'Cannot find recipe' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.recipe = recipe
    next()
}

module.exports = router