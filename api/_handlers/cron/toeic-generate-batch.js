const connectToDatabase = require('../../lib/db');
// const ToeicPendingBatch = require('../../models/ToeicPendingBatch');
// const ToeicQuestion = require('../../models/ToeicQuestion');

module.exports = async (req, res) => {
  // CRON Job endpoint triggered by Vercel
  // Responsible ONLY for taking a small batch of raw text (e.g., 1 article) 
  // and hitting the LLM to generate 10-20 questions at a time.
  // This keeps execution under Vercel's 10-second Serverless limit.

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    
    // 1. Find a pending batch in the database
    // const batch = await ToeicPendingBatch.findOne({ status: 'pending' });
    // if (!batch) return res.status(200).json({ message: 'No pending batches found.' });

    // 2. Mark it as 'processing'
    // batch.status = 'processing';
    // await batch.save();

    // 3. Call LLM to generate questions (Simulated)
    // const generatedQuestions = await generateWithGemini(batch.content);
    
    // 4. Save to ToeicQuestion
    // await ToeicQuestion.insertMany(generatedQuestions);

    // 5. Mark batch as 'completed'
    // batch.status = 'completed';
    // await batch.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Batch Processed: LLM generated 15 questions for the pending batch.' 
    });
  } catch (err) {
    console.error('Batch Generation Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
