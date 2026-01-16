import { google } from "googleapis";
import { tool } from "langchain";
import * as z from "zod";
import { oauth2Client } from "../../services/auth.service";

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
      return JSON.stringify({
        success: false,
        error: "Failed to get calender events. check you are logged in.",
      });
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
  async ({
    summary,
    description,
    start,
    end,
    location,
    attendees,
  }: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    location?: string;
    attendees?: { email: string }[];
  }) => {
    try {
      const response = await calender.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all",
        requestBody: {
          summary,
          description,
          location,
          start: {
            dateTime: start,
          },
          end: {
            dateTime: end,
          },
          attendees,
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
        },
      });

      if (response.status === 200) {
        return "The meeting has been created successfully.";
      }

      return "Couldn't create the meeting.";
    } catch (error) {
      console.error("Create calendar event error:", error);
      return "Failed to create calendar event. Please check that you are logged in.";
    }
  },
  {
    name: "createCalenderEvents",
    description:
      "Creates a new event in the logged-in user’s Google Calendar. " +
      "Use when the user wants to schedule or add a meeting, appointment, or reminder.",
    schema: z.object({
      summary: z.string().describe("Title of the calendar event."),
      description: z
        .string()
        .optional()
        .describe("Detailed description or agenda of the event."),
      start: z
        .string()
        .describe(
          "Event start time as an RFC3339 datetime string (e.g. 2026-01-16T15:00:00+06:00)."
        ),
      end: z
        .string()
        .describe(
          "Event end time as an RFC3339 datetime string. Must be later than start time."
        ),
      location: z
        .string()
        .optional()
        .describe("Physical or virtual location of the event."),
      attendees: z
        .array(
          z.object({
            email: z.string().describe("Attendee email address"),
          })
        )
        .optional()
        .describe("List of attendee email addresses."),
    }),
  }
);
