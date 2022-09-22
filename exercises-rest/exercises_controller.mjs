import 'dotenv/config';
import * as exercises from '../exercises-rest/exercises_model.mjs';
import express from 'express';
import validator from 'express-validator';

const PORT = process.env.PORT;
const app = express();

const { body, validationResult } = validator;


function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

app.use(express.json());

app.post('/exercises',
    body('name').not().isEmpty().isLength({ min: 1 }),
    body('reps').not().isEmpty().isInt({ min: 1 }),
    body('weight').not().isEmpty().isInt({ min: 0 }),
    body('unit').not().isEmpty(),
    body('date').custom((date, { req }) => {
        if (isDateValid(req.body.date)) {
            return true
        }
        return false
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ Error: 'Invalid Request' });
        }
        else {
            exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
                .then(exercise => {
                    res.status(201).json(exercise);
                })
        }

    });


/**
 * Retrieve the movie corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });

});

/**
 * Retrieve movies. 
 * If the query parameters include a year, then only the movies for that year are returned.
 * Otherwise, all movies are returned.
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    // Is there a query parameter named name? If so add a filter based on its value.
    if (req.query.name !== undefined) {
        filter = { name: req.query.name };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });

});

/**
 * Update the movie whose id is provided in the path parameter and set
 * its title, year and language to the values provided in the body.
 */
app.put('/exercises/:_id',
    body('name').not().isEmpty().isLength({ min: 1 }),
    body('reps').not().isEmpty().isInt({ min: 1 }),
    body('weight').not().isEmpty().isInt({ min: 1 }),
    body('date').custom((date, { req }) => {
        if (isDateValid(req.body.date)) {
            return true
        }
        return false
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ Error: 'Invalid request' });
        }
        else {
            exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
                .then(numUpdated => {
                    if (numUpdated === 1) {
                        res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
                    } else {
                        res.status(404).json({ Error: 'Not found' });
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.status(400).json({ Error: 'Invalid Request' });
                });
        }
    });
/**
 * Delete the movie whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});