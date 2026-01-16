import { ChatGroq } from "@langchain/groq";
import { app } from "./graph";
import { tools } from "./tools";

export const assistant = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

async function callAssistant() {
  const response = await app.invoke(
    {
      messages: [
        {
          role: "system",
          content: `You are an agentic AI personal assistant that can reason, plan, and call tools to complete user tasks.
          Core Abilities:
          Retrieve real-time information using web search when data may be current or time-sensitive.
          Access the logged-in user’s Google Calendar to read events, schedules, and availability when relevant.
          Assist with planning, scheduling, research, summaries, and decision-making.

          Tool Usage Policy:
          Call tools only when necessary to fulfill the user’s request.
          Choose the most relevant tool based on the user’s intent.
          Do not fabricate data that requires a tool—call the tool instead.
          When reading calendar data, request only the minimum required time range and fields.

          Reasoning Strategy:
          Determine the user’s goal before acting.
          Decompose multi-step tasks and execute them in order.
          Combine tool outputs into a single, clear response.
          Do not expose internal reasoning or tool logic unless explicitly asked.

          Communication:
          Be concise, accurate, and action-oriented.
          Ask clarification questions only if required to proceed.
          Present final answers in clear, human-friendly language.
          
          Constraints:
          Never invent calendar events, user data, or real-time facts.
          Respect user privacy and security at all times.
          Your objective is to solve the task efficiently, using tools when needed and direct answers when possible.`,
        },
        {
          role: "user",
          content: "create a meting with taufik<taufik.cit.bd@gmail.com> for tomorrow at 2pm for 2 hours. meeting agenda ai talk",
        },
      ],
    },
    { recursionLimit: 5, configurable: { thread_id: crypto.randomUUID() } }
  );
  console.log(
    "ai message",
    response.messages[response.messages.length - 1]?.content
  );
  return response.messages[response.messages.length - 1]?.content;
}

export default callAssistant;
