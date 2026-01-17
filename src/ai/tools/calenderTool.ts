import { google } from "googleapis";
import { tool } from "langchain";
import * as z from "zod";
import { oauth2Client } from "../../services/auth.service";

oauth2Client.setCredentials({
  access_token:
    "ya29.a0AUMWg_L_1bzh4Ib3voYIb6sbt88vJBecP7HgPYypAHkGWkC-NW7EAgHDHihRhlbMJ4HBj5IgtJ0IKMWsoWuJ35FgpLQi7oGmpZ4sksY-rZ9FK0WAYazhx-JkuSx5bAjZX0kyAiLW03ZNfHLzDzxR5YIBEKeoqUh_ocDFgEDOvX9Kjp1S7UVyfTjkfujBBl0nuezxB4oaCgYKAd4SARYSFQHGX2Mi4b-f5fCSOIzZ254u2RKNiw0206",
  refresh_token:
    "1//0gc6OikJ1LJeqCgYIARAAGBASNwF-L9Irq1GYuQcmKQp3YKeI62buoto_0uv1yYnDOiFBv1sMBn8nBL29H4L7ptcemhHfWI-7E5w",
});
const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

export const getCalenderEvents = tool(
  async ({ q, timeMin, timeMax }) => {
    try {
      const response = await calendar.events.list({
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

const createCalenderEventsSchema = z.object({
  summary: z.string().describe("Title of the calendar event."),
  description: z
    .string()
    .optional()
    .describe("Detailed description or agenda of the event."),
  start: z.object({
    dateTime: z.string().describe("The date time of start of the event."),
    timeZone: z.string().describe("User's IANA timezone"),
  }),
  end: z.object({
    dateTime: z.string().describe("The date time of end of the event."),
    timeZone: z.string().describe("User's IANA timezone"),
  }),
  location: z
    .string()
    .optional()
    .describe("Physical or virtual location of the event."),
  attendees: z
    .array(
      z.object({
        email: z.string().describe("The email of the attendee"),
        displayName: z.string().describe("Then name of the attendee."),
      })
    )
    .optional()
    .describe("List of attendee email addresses."),
});
type EventData = z.infer<typeof createCalenderEventsSchema>;
export const createCalenderEvents = tool(
  async (eventData) => {
    const { summary, description, start, end, location, attendees } =
      eventData as EventData;
    console.log(summary, description, start, end, location, attendees);

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all",
        requestBody: {
          summary,
          description,
          location,
          start: {
            dateTime: start.dateTime,
            timeZone: start.timeZone,
          },
          end: {
            dateTime: end.dateTime,
            timeZone: end.timeZone,
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
    schema: createCalenderEventsSchema,
  }
);
