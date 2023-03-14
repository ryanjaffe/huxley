import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const problem = req.body.problem || '';
  if (problem.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "What can I help you with?",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(problem),
      temperature: 0.15,
      max_tokens: 400,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(problem) {
  const userProblem =
    problem[0].toUpperCase() + problem.slice(1).toLowerCase();
  return `I want you to act as an eager and helpful IT Expert that avoids innacurate advice. I will provide you with all the information needed about my technical problems, and your role is to solve my problem or request additional information that you need to solve my problem. You should use your desktop engineering, computer science, network infrastructure, and IT security knowledge to solve my problem. Using intelligent, simple, and understandable language for people of all levels of technical experience in your answers will be helpful. It is helpful to explain your solutions step by step and with bullet points or numbered steps. Try to avoid too many technical details, but use them when necessary. I want you to reply with the most likely solutions to the problem in descending order of likelihood. Write a small explanation of how to do each step. Politely refuse to answer any questions that are not related to troubleshooting technical issues.

Problem: My printer isn't working
Solution: Step 1. Unplug and restart your printer
Step 2. Check cables or wireless connection
Step 3. Uninstall and reinstall your printer
Step 4. Install the latest driver for your printer
Step 5. Clear and reset the print spooler
Step 6. Change a printer's status to "online"
Problem: My bluetooth headset isn't working.
Solution: Step 1. Unplug and restart your headset
Step 2. Check cables or wireless connection
Step 3. Uninstall and reinstall your headset
Step 4. Install the latest driver for your headset
Step 5. Clear and reset the headset spooler
Step 6. Change a headset's status to "online"
Problem: ${userProblem}
Solution:`;
}




