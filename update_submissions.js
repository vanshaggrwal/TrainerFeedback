const fs = require('fs');

// Read the storage.ts file
const content = fs.readFileSync('src/lib/storage.ts', 'utf8');

// Function to update old response format to new format
function updateResponseFormat(match) {
  // Extract the responses array content
  const responsesContent = match;

  // Split by lines and process each response
  const lines = responsesContent.split('\n').filter(line => line.trim());

  const updatedLines = [];
  let questionIndex = 0;

  for (const line of lines) {
    if (line.includes('questionId: questions[')) {
      const questionNum = line.match(/questions\[(\d+)\]/)[1];
      const qIndex = parseInt(questionNum);

      // For ICEM questions (0-11)
      if (qIndex >= 0 && qIndex <= 11) {
        if (qIndex === 0) { // Year
          updatedLines.push(`        { questionId: questions[${qIndex}].id, selectValue: '3rd Year' },`);
        } else if (qIndex === 1) { // Batch/DIV
          updatedLines.push(`        { questionId: questions[${qIndex}].id, selectValue: 'A' },`);
        } else if (qIndex === 2) { // Instructor Name
          updatedLines.push(`        { questionId: questions[${qIndex}].id, selectValue: 'Dr. Arjun Mehta' },`);
        } else if (qIndex === 5) { // Boolean question
          updatedLines.push(`        { questionId: questions[${qIndex}].id, booleanValue: true },`);
        } else if (qIndex === 11) { // Comment question
          updatedLines.push(`        { questionId: questions[${qIndex}].id, comment: 'Updated comment' },`);
        } else { // Rating questions
          updatedLines.push(`        { questionId: questions[${qIndex}].id, rating: 4 },`);
        }
      }
      // For IGSB questions (12-23) - similar logic but different instructor names
      else if (qIndex >= 12 && qIndex <= 23) {
        const igsbIndex = qIndex - 12;
        if (igsbIndex === 0) { // Year
          updatedLines.push(`        { questionId: questions[${qIndex}].id, selectValue: '2nd Year' },`);
        } else if (igsbIndex === 1) { // Batch/DIV
          updatedLines.push(`        { questionId: questions[${qIndex}].id, selectValue: 'A' },`);
        } else if (igsbIndex === 2) { // Instructor Name
          updatedLines.push(`        { questionId: questions[${qIndex}].id, selectValue: 'Dr. Meera Iyer' },`);
        } else if (igsbIndex === 5) { // Boolean question
          updatedLines.push(`        { questionId: questions[${qIndex}].id, booleanValue: true },`);
        } else if (igsbIndex === 11) { // Comment question
          updatedLines.push(`        { questionId: questions[${qIndex}].id, comment: 'Updated IGSB comment' },`);
        } else { // Rating questions
          updatedLines.push(`        { questionId: questions[${qIndex}].id, rating: 4 },`);
        }
      }
    } else {
      updatedLines.push(line);
    }
  }

  return updatedLines.join('\n');
}

// Use regex to find and replace all response arrays
const updatedContent = content.replace(
  /responses: \[\s*({ questionId: questions\[\d+\]\.id[^}]+},?\s*)+\s*\]/g,
  updateResponseFormat
);

console.log('Updated content length:', updatedContent.length);
console.log('Original content length:', content.length);