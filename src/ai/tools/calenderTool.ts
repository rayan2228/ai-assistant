import { google } from "googleapis";
import { tool } from "langchain";
import * as z from "zod";
import { oauth2Client } from "../../services/auth.service";
oauth2Client.setCredentials({
  access_token:
    "ya29.a0AUMWg_L1em2HpoT9sxgoXpBM-3UpGTv7OxouzNAwmlLRvOttwUHNDxLZSHiY7P5Qkpi4M-Vvxwbr_du76EVvRgjf_U6yVZfaunlokEcFhLtlYdvAGayh5FvaFYLJOiHZSBNWFdH8W2aFUU1CN3w8ULqlM_vd4eRL9LPE75a7DvkrI_wTPkMSpFPRuFAFpdCNau78kGwaCgYKAXISARYSFQHGX2Miayst0ZAVlHJZiP8wGHg9DQ0206",
  refresh_token:
    "1//0ghrYuXdYVCzECgYIARAAGBASNwF-L9IrchL8vKJOWEh6W5jLwYmGRsj7JYyMz3JbB5moxlA4cDEvQ9EfYOJFZxToxtL_9sg8kuM",
});
const calender = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

export const getCalenderEvents = tool(
  async ({ q, timeMin, timeMax }) => {
    try {
      const response = await calender.events.list({
        calendarId: "primary",
        q,
        timeMin,
        timeMax,
      });
      const result = response.data.items?.map((event) => ({
        id: event.id,
        summary: event.summary,
        status: event.status,
        description: event.description,
        location: event.location,
        creator: event.creator,
        organizer: event.organizer,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
        meetingLink: event.hangoutLink,
        reminders: event.reminders,
        eventType: event.eventType,
      }));
      return JSON.stringify(result);
    } catch (error) {
      console.log("error", error);
    }
  },
  {
    name: "getCalenderEvents",
    description: "get calender events",
    schema: z.object({
      q: z
        .string()
        .describe(
          "A free-text search term used to filter events. This search matches across several fields such as event summary, description, location, organizer, and attendee names/emails. If provided, only events containing the query text in these fields will be returned."
        ),
      timeMin: z
        .string()
        .describe(
          "An RFC3339 timestamp representing the lower bound of the event’s end time. Only events that end after this time will be included. Must include timezone offset (e.g., 2026-01-16T00:00:00Z). If not provided, no lower time limit is applied."
        ),
      timeMax: z
        .string()
        .describe(
          "An RFC3339 timestamp for the upper bound of the event’s start time. Only events that start before this time will be included. Must include timezone offset. If not provided, no upper time limit is applied. If both timeMin and timeMax are used, timeMax must be later than timeMin."
        ),
    }),
  }
);
export const createCalenderEvents = tool(
  async ({ query }) => {
    const response = await calender.events.insert({
      requestBody: {
        summary: "test summary",
        description: "test description",
        start: {
          dateTime: new Date().toISOString(),
        },
        end: {
          dateTime: new Date().toISOString(),
        },
      },
    });
    return JSON.stringify(response.data);
  },
  {
    name: "createCalenderEvents",
    description: "create calender events from query",
    schema: z.object({
      query: z.string().describe("query to create calender events"),
    }),
  }
);
