import { google } from "googleapis";
import { tool } from "langchain";
import type { CreateEventData, GetEventData } from "../../../types/type";
import { oauth2Client } from "../../services/auth.service";
import {
  createCalenderEventsSchema,
  deleteCalenderEventSchema,
  getEventValidationSchema,
} from "../../utils/validationSchema/calendarSchema";

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
  async ({ q, timeMin, timeMax }: GetEventData) => {
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
    schema: getEventValidationSchema,
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
  }: CreateEventData) => {
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
      return JSON.stringify({
        success: false,
        error:
          "Failed to create calendar event. Please check that you are logged in.",
      });
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

export const deleteCalenderEvent = tool(
  async ({ eventId }: { eventId: string }) => {
    try {
      const response = await calendar.events.delete({
        calendarId: "primary",
        eventId,
      });
      if (response.status === 204) {
        return "The meeting has been deleted successfully.";
      }
      return "Couldn't delete the meeting.";
    } catch (error) {
      return JSON.stringify({
        success: false,
        error:
          "Failed to delete calendar event. Please check that you are logged in.",
      });
    }
  },
  {
    name: "deleteCalenderEvent",
    description:
      "Deletes an event from the logged-in user’s Google Calendar. " +
      "Use when the user wants to cancel a meeting, appointment, or reminder.",
    schema: deleteCalenderEventSchema,
  }
);
