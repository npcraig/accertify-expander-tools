// risk_score.js

// Load TensorFlow.js script
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js';
document.head.appendChild(script);

let model;

script.onload = async () => {
  try {
    model = await tf.loadLayersModel(chrome.runtime.getURL('model.json'));
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading the model:', error);
  }
};

function preprocessInput(firstName, lastName, email) {
  // Implement preprocessing steps based on your model's requirements
  // This is a placeholder implementation and should be adjusted according to your actual preprocessing logic
  const emailHandle = email.split('@')[0];
  const emailDomain = email.split('@')[1];
  const nameLength = firstName.length + lastName.length;
  const emailHandleLength = emailHandle.length;
  const firstNameEmailDiff = Math.abs(firstName.length - emailHandle.length);
  const lastNameEmailDiff = Math.abs(lastName.length - emailHandle.length);

  // Add more features as needed, matching the input shape of your model
  return tf.tensor2d([[
    nameLength,
    emailHandleLength,
    firstNameEmailDiff,
    lastNameEmailDiff,
    // Add more features here
  ]]);
}

async function calculateRiskScore(firstName, lastName, email) {
  if (!model) {
    console.error('Model not loaded yet');
    return 0.5; // Return a default score if the model isn't loaded
  }

  const input = preprocessInput(firstName, lastName, email);
  const prediction = model.predict(input);
  const riskScore = prediction.dataSync()[0];

  return riskScore;
}

// Export the calculateRiskScore function so it can be used in content.js
window.calculateRiskScore = calculateRiskScore;