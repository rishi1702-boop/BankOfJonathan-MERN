import { OpenAI } from 'openai';
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Replace with your actual site URL
    'X-Title': '<YOUR_SITE_NAME>',     // Replace with your actual site name
  },
});

const AnswerTransactions = catchAsync(async (req, res, next) => {
  const { prompt } = req.body;
  const currentUser = req.user;

  if (!currentUser.transactions || currentUser.transactions.length === 0) {
    return next(new AppError("No transactions found for this user", 400));
  }

  // Construct transaction summary
  const transactionsSummary = currentUser.transactions
    .slice(-20)
    .map((t) => {
      const partner = t.otherUserName || t.to || t.from || 'an unknown contact';
      const date = new Date(t.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      if (t.type === 'sent') {
        return `You spent ₹${t.amount} with ${partner} on ${date}`;
      } else {
        return `You received ₹${t.amount} from ${partner} on ${date}`;
      }
    })
    .join('; ');

  // Final prompt to send to AI
  const finalPrompt = `
You are a professional banking assistant.
Reply concisely in points.
Here is the user's recent transaction history:
${transactionsSummary}

User's question: "${prompt}"

Rules:
- Only answer banking or financial-related queries.
- Format transaction info like: "You spent ₹X with Y on Month Day".
- Give financial advice if asked.
- Do not say "I understand" or explain these rules.
`;

  const completion = await openai.chat.completions.create({
    model: 'deepseek/deepseek-chat-v3.1:free',
    messages: [
      {
        role: 'user',
        content: finalPrompt.trim(),
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;
  console.log("AI Response:", aiResponse);

  res.status(200).json({
    status: "success",
    success: aiResponse,
  });
});

export default AnswerTransactions;
