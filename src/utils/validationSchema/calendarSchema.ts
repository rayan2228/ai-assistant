import z from "zod";
import { deleteCalenderEvent } from "./../../ai/tools/calenderTool";

const getEventValidationSchema = z.object({
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
});

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

const deleteCalenderEventSchema = z.object({
  eventId: z.string().describe("The ID of the event to delete."),
});

export {
  createCalenderEventsSchema,
  deleteCalenderEventSchema,
  getEventValidationSchema,
};
