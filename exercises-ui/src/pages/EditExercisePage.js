import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const EditExercisePage = ({ exerciseToEdit }) => {

    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);

    const history = useHistory();

    const editExercise = async () => {
        //const editedMovie = {title, year, language}; // create a new movie and collect the variables
        const response = await fetch(`/exercises/${exerciseToEdit._id}`, {    // returns a promise which resolves to this object
            method: 'PUT',
            body: JSON.stringify({ name: name, reps: reps, weight: weight, unit: unit, date: date }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            alert("Successfully edited the exercise");
        } else {
            alert(`Failed to edit exercise, status code = ${response.status}`);
        }
        history.push("/");
    };

    return (
        <div>
            <input
                type="name"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input
                type="reps"
                value={reps}
                onChange={e => setReps(e.target.value)} />
            <input
                type="weight"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select name="weight" id="weight-select" onChange={e => setUnit(e.target.value)}>
                <option value="prompt">Pick a value below</option>
                <option value="lbs">lbs</option>
                <option value="kgs">kgs</option>
            </select>
            <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)} />
            <button
                onClick={editExercise}
            >Save</button>
        </div>
    );
}

export default EditExercisePage;