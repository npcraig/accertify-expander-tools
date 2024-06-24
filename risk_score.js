// risk_score.js

let model;

async function loadModel() {
    try {
        model = await tf.loadLayersModel(chrome.runtime.getURL('model.json'));
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading the model:', error);
    }
}

function preprocessInput(firstName, lastName, email) {
    firstName = firstName || '';
    lastName = lastName || 'Unknown';
    const emailHandle = email.split('@')[0] || '';
    const emailDomain = email.split('@')[1] || '';
    
    const nameLength = firstName.length + lastName.length;
    const emailHandleLength = emailHandle.length;
    const firstNameEmailDiff = Math.abs(firstName.length - emailHandle.length);
    const lastNameEmailDiff = Math.abs(lastName.length - emailHandle.length);
    
    const digitCount = (emailHandle.match(/\d/g) || []).length;
    const specialCharCount = (emailHandle.match(/[^a-zA-Z0-9]/g) || []).length;
    const digitPercentage = emailHandleLength > 0 ? digitCount / emailHandleLength : 0;
    const specialCharPercentage = emailHandleLength > 0 ? specialCharCount / emailHandleLength : 0;
    
    const topLevelDomain = emailDomain.split('.').pop() || '';
    
    const nameSimilarity = calculateJaccardSimilarity(firstName.toLowerCase(), emailHandle.toLowerCase());
    
    const firstNameInEmail = emailHandle.toLowerCase().includes(firstName.toLowerCase()) ? 1 : 0;
    const lastNameInEmail = emailHandle.toLowerCase().includes(lastName.toLowerCase()) ? 1 : 0;
    
    const vowelCount = (emailHandle.match(/[aeiou]/gi) || []).length;
    const consonantCount = emailHandle.replace(/[^a-z]/gi, '').length - vowelCount;
    const vowelConsonantRatio = consonantCount > 0 ? vowelCount / consonantCount : 0;
    
    const levenshteinDistance = calculateLevenshteinDistance(firstName.toLowerCase(), emailHandle.toLowerCase());

    return [
        nameLength, emailHandleLength, firstNameEmailDiff, lastNameEmailDiff,
        digitCount, specialCharCount, digitPercentage, specialCharPercentage,
        nameSimilarity, firstNameInEmail, lastNameInEmail,
        vowelConsonantRatio, levenshteinDistance
    ];
}

function calculateJaccardSimilarity(str1, str2) {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

function calculateLevenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + 1
                );
            }
        }
    }

    return dp[m][n];
}

async function calculateRiskScore(firstName, lastName, email) {
    if (!model) {
        await loadModel();
    }

    if (!model) {
        console.error('Model not loaded');
        return 0.5; // Return a default score if the model isn't loaded
    }

    const inputFeatures = preprocessInput(firstName, lastName, email);
    const inputTensor = tf.tensor2d([inputFeatures]);
    
    const prediction = model.predict(inputTensor);
    const riskScore = prediction.dataSync()[0];

    // Clean up
    inputTensor.dispose();
    prediction.dispose();

    return riskScore;
}

// Load TensorFlow.js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js';
script.onload = loadModel;
document.head.appendChild(script);

// Make calculateRiskScore available globally
window.calculateRiskScore = calculateRiskScore;