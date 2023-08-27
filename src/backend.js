const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/math_operations', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const calculationSchema = new mongoose.Schema({
  question: String,
  answer: Number,
});

const Calculation = mongoose.model('Calculation', calculationSchema);

let history = []; // Array to store calculation history

app.get('/:calculation', async (req, res) => {
  const { calculation } = req.params;
  const result = calculate(calculation);

  try {
    const newCalculation = new Calculation({
      question: calculation,
      answer: result,
    });
    await newCalculation.save();

    // Add the calculation to history array
    history.push({ question: calculation, answer: result });
  } catch (error) {
    console.error('Error saving calculation:', error);
    return res.status(500).json({ error: 'Error saving calculation' });
  }

  res.json({ question: calculation, answer: result });
});

app.get('/calculation', async (req, res) => {
  const { calculation } = req.params;
  const result = calculate(calculation);

  try {
    const newCalculation = new Calculation({
      question: calculation,
      answer: result, // Make sure result is a number
    });
    await newCalculation.save();
  } catch (error) {
    console.error('Error saving calculation:', error);
    return res.status(500).json({ error: 'Error saving calculation' });
  }

  res.json({ question: calculation, answer: result });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function calculate(expression) {
  // Implement your calculation logic here
  const sanitizedExpression = expression.replace(/plus/g, '+').replace(/minus/g, '-').replace(/into/g, '*');
  return eval(sanitizedExpression);
}



