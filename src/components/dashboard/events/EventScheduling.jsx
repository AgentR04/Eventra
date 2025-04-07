import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaLightbulb,
  FaRobot
} from "react-icons/fa";

const EventScheduling = ({
  upcomingEvents = [
    {
      id: "event1",
      name: "Tech Conference",
      date: "2023-06-05",
      startTime: "09:00",
      endTime: "12:00",
      venue: "Main Auditorium",
      committee: "Technical",
      organizer: "John Smith",
      description:
        "Annual technology conference featuring industry speakers and workshops",
    },
    {
      id: "event2",
      name: "Cultural Night",
      date: "2023-06-07",
      startTime: "16:00",
      endTime: "20:00",
      venue: "Open Air Theater",
      committee: "Cultural",
      organizer: "Priya Sharma",
      description:
        "Evening of performances showcasing diverse cultural traditions",
    },
    {
      id: "event3",
      name: "Hackathon",
      date: "2023-06-10",
      startTime: "10:00",
      endTime: "17:00",
      venue: "CS Building",
      committee: "Technical",
      organizer: "Alex Johnson",
      description:
        "24-hour coding competition for students to build innovative solutions",
    },
    {
      id: "event4",
      name: "Career Fair",
      date: "2023-06-12",
      startTime: "11:00",
      endTime: "15:00",
      venue: "Main Hall",
      committee: "Placement",
      organizer: "Sarah Williams",
      description:
        "Networking event connecting students with potential employers",
    },
    {
      id: "event5",
      name: "Workshop: AI Basics",
      date: "2023-06-06",
      startTime: "14:00",
      endTime: "16:00",
      venue: "Lecture Hall 1",
      committee: "Technical",
      organizer: "David Chen",
      description: "Introductory workshop on artificial intelligence concepts",
    },
    {
      id: "event6",
      name: "Alumni Meet",
      date: "2023-06-09",
      startTime: "18:00",
      endTime: "20:00",
      venue: "Faculty Lounge",
      committee: "Alumni",
      organizer: "Michael Brown",
      description: "Annual gathering of alumni to network and reconnect",
    },
    {
      id: "event7",
      name: "Sports Tournament",
      date: "2023-06-11",
      startTime: "09:00",
      endTime: "18:00",
      venue: "Sports Complex",
      committee: "Sports",
      organizer: "Rahul Patel",
      description:
        "Inter-college sports competition across multiple disciplines",
    },
  ],
  schedulingConflicts = [
    {
      id: "conflict1",
      type: "venue",
      severity: "high",
      description:
        "Two events scheduled in Main Auditorium at the same time: Tech Conference and Department Meeting on June 5th, 10:00-11:00",
      aiSuggestion:
        "Reschedule Department Meeting to Lecture Hall 2 which is available during this time slot.",
    },
    {
      id: "conflict2",
      type: "resource",
      severity: "medium",
      description:
        "Projector equipment requested by both Workshop: AI Basics and Guest Lecture on June 6th, 14:00-15:00",
      aiSuggestion:
        "Move Guest Lecture to Lecture Hall 3 which has built-in projector equipment.",
    },
    {
      id: "conflict3",
      type: "organizer",
      severity: "low",
      description:
        "Sarah Williams is assigned to manage two events on June 12th: Career Fair and Resume Workshop",
      aiSuggestion:
        "Reassign Resume Workshop to available team member Jason Lee who has experience with similar events.",
    },
  ],
  venues = [
    {
      id: "venue1",
      name: "Main Auditorium",
      capacity: 500,
      resources: ["Projector", "Sound System", "Stage", "Lighting"],
      availability: [
        { date: "2023-06-05", slots: ["09:00-12:00"] },
        { date: "2023-06-07", slots: ["14:00-20:00"] },
        { date: "2023-06-10", slots: ["All Day"] },
      ],
    },
    {
      id: "venue2",
      name: "Open Air Theater",
      capacity: 300,
      resources: ["Sound System", "Lighting", "Seating"],
      availability: [
        { date: "2023-06-07", slots: ["16:00-20:00"] },
        { date: "2023-06-09", slots: ["All Day"] },
      ],
    },
    {
      id: "venue3",
      name: "CS Building",
      capacity: 150,
      resources: ["Computers", "Projector", "Whiteboards", "Internet"],
      availability: [
        { date: "2023-06-06", slots: ["09:00-18:00"] },
        { date: "2023-06-10", slots: ["09:00-20:00"] },
      ],
    },
    {
      id: "venue4",
      name: "Lecture Hall 1",
      capacity: 120,
      resources: ["Projector", "Whiteboard", "Microphone"],
      availability: [
        { date: "2023-06-05", slots: ["14:00-18:00"] },
        { date: "2023-06-06", slots: ["09:00-17:00"] },
        { date: "2023-06-08", slots: ["All Day"] },
      ],
    },
    {
      id: "venue5",
      name: "Main Hall",
      capacity: 250,
      resources: ["Tables", "Chairs", "Projector", "Sound System"],
      availability: [
        { date: "2023-06-12", slots: ["09:00-18:00"] },
        { date: "2023-06-13", slots: ["All Day"] },
      ],
    },
  ],
  aiSuggestions = [
    {
      id: "suggestion1",
      suggestion:
        "Based on past attendance data, consider moving the Tech Conference to the Main Hall which offers 50 more seats.",
      type: "venue optimization",
      confidence: "high",
    },
    {
      id: "suggestion2",
      suggestion:
        "Schedule the Workshop: AI Basics on Tuesday instead of Wednesday to increase student attendance based on class schedules.",
      type: "timing optimization",
      confidence: "medium",
    },
    {
      id: "suggestion3",
      suggestion:
        "Combine the Resume Workshop with the Career Fair to create a comprehensive career development event.",
      type: "event consolidation",
      confidence: "high",
    },
    {
      id: "suggestion4",
      suggestion:
        "The Sports Tournament could be split into two half-day events to better manage venue resources and participant energy levels.",
      type: "event restructuring",
      confidence: "medium",
    },
  ],
  isRoleHead = true,
}) => {
  const [schedulingView, setSchedulingView] = useState("calendar"); // 'calendar', 'conflicts', 'resources'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // Mock data for the calendar view
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Helper function to get events for a specific day
  const getEventsForDay = (dayIndex) => {
    // Map days of week to dates in June 2023
    // Monday = June 5, Tuesday = June 6, etc.
    const dayToDateMap = {
      0: "2023-06-05", // Monday
      1: "2023-06-06", // Tuesday
      2: "2023-06-07", // Wednesday
      3: "2023-06-08", // Thursday
      4: "2023-06-09", // Friday
      5: "2023-06-10", // Saturday
      6: "2023-06-11", // Sunday
    };

    // Filter events for this specific day
    return upcomingEvents.filter((event) => {
      return event.date === dayToDateMap[dayIndex];
    });
  };

  return (
    <div className="space-y-6 bg-gray-900 text-white p-4 rounded-lg">
      {/* Smart Scheduling Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl shadow-fancy p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <FaRobot className="text-white mr-2" />
              Smart Scheduling System
            </h3>
            <p className="text-white text-opacity-90 mt-1">
              AI-powered event scheduling with automatic conflict detection
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                schedulingView === "calendar"
                  ? "bg-white text-primary"
                  : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
              }`}
              onClick={() => setSchedulingView("calendar")}
            >
              <FaCalendarAlt className="mr-1" /> Calendar
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                schedulingView === "conflicts"
                  ? "bg-white text-primary"
                  : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
              }`}
              onClick={() => setSchedulingView("conflicts")}
            >
              <FaExclamationTriangle className="mr-1" /> Conflicts
              {schedulingConflicts.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {schedulingConflicts.length}
                </span>
              )}
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                schedulingView === "resources"
                  ? "bg-white text-primary"
                  : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
              }`}
              onClick={() => setSchedulingView("resources")}
            >
              <FaBuilding className="mr-1" /> Venues
            </button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-white bg-opacity-10 text-white hover:bg-opacity-20 flex items-center"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
            >
              <FaLightbulb className="mr-1 text-yellow-300" /> AI Suggestions
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-2 text-sm rounded-md flex items-center ${
            schedulingView === "calendar"
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setSchedulingView("calendar")}
        >
          <FaCalendarAlt className="mr-1" /> Calendar
        </button>
        <button
          className={`px-3 py-2 text-sm rounded-md flex items-center ${
            schedulingView === "conflicts"
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setSchedulingView("conflicts")}
        >
          <FaExclamationTriangle className="mr-1" /> Conflicts
          {schedulingConflicts.length > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {schedulingConflicts.length}
            </span>
          )}
        </button>
        <button
          className={`px-3 py-2 text-sm rounded-md flex items-center ${
            schedulingView === "resources"
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setSchedulingView("resources")}
        >
          <FaBuilding className="mr-1" /> Venues
        </button>
        <button
          className="px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
          onClick={() => setShowAISuggestions(!showAISuggestions)}
        >
          <FaLightbulb className="mr-1 text-yellow-500" /> AI Suggestions
        </button>
      </div>
      {/* AI Suggestions Panel */}
      {showAISuggestions && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <FaLightbulb className="text-yellow-500 mr-2" />
              AI-Powered Suggestions
            </h4>
            <button
              className="bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setShowAISuggestions(false)}
            >
              &times;
            </button>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    suggestion.confidence === "high"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  } flex-shrink-0`}
                ></div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {suggestion.suggestion}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {suggestion.type} • {suggestion.confidence} confidence
                  </p>
                </div>
                <button className="ml-auto text-primary dark:text-primary-300 text-sm hover:underline">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Scheduling Views */}
      {schedulingView === "calendar" && (
        <div
          className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700"
        >
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h4 className="font-medium text-gray-800">June 2023</h4>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Days of Week Header */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Time
                </div>
                {daysOfWeek.map((day, index) => (
                  <div
                    key={day}
                    className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time, timeIndex) => (
                <div
                  key={time}
                  className="grid grid-cols-8 border-b border-gray-200 hover:bg-gray-50"
                >
                  {/* Time Column */}
                  <div className="py-3 px-3 text-xs font-medium text-gray-500 border-r border-gray-200 flex items-center">
                    {time}
                  </div>

                  {/* Day Columns */}
                  {daysOfWeek.map((day, dayIndex) => {
                    // Get events for this day and time slot (simplified logic for demo)
                    const dayEvents = getEventsForDay(dayIndex).filter(
                      (e) => e.startTime <= time && e.endTime > time
                    );

                    return (
                      <div
                        key={`${day}-${time}`}
                        className="py-2 px-1 min-h-[60px] border-r border-gray-100 relative"
                      >
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`absolute left-0 right-0 mx-1 p-1 rounded text-xs ${
                              timeIndex === timeSlots.indexOf(event.startTime)
                                ? "rounded-t"
                                : ""
                            } ${
                              timeIndex === timeSlots.indexOf(event.endTime) - 1
                                ? "rounded-b"
                                : ""
                            } ${
                              event.committee === "Technical"
                                ? "bg-blue-100 text-blue-800 border-l-2 border-blue-500"
                                : event.committee === "Cultural"
                                ? "bg-purple-100 text-purple-800 border-l-2 border-purple-500"
                                : "bg-green-100 text-green-800 border-l-2 border-green-500"
                            }`}
                          >
                            {timeIndex ===
                              timeSlots.indexOf(event.startTime) && (
                              <div className="font-medium">{event.name}</div>
                            )}
                            {timeIndex ===
                              timeSlots.indexOf(event.startTime) && (
                              <div className="text-xs opacity-75">
                                {event.venue}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conflicts View */}
      {schedulingView === "conflicts" && (
        <div
          className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-white"
        >
          <h4 className="font-medium text-gray-800 mb-4 flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            Scheduling Conflicts
          </h4>

          {schedulingConflicts.length > 0 ? (
            <div className="space-y-4">
              {schedulingConflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className={`border-l-4 ${
                    conflict.severity === "high"
                      ? "border-red-500 bg-red-50"
                      : conflict.severity === "medium"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-blue-500 bg-blue-50"
                  } p-4 rounded-r-md`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-800 capitalize flex items-center">
                        {conflict.type} Conflict
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${
                            conflict.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : conflict.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {conflict.severity} severity
                        </span>
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {conflict.description}
                      </p>
                    </div>
                    <button className="text-primary hover:text-primary-dark text-sm">
                      View Events
                    </button>
                  </div>
                  <div className="mt-3 bg-white p-3 rounded-md border border-gray-200">
                    <div className="flex items-center">
                      <FaLightbulb className="text-yellow-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          AI Suggestion:
                        </p>
                        <p className="text-sm text-gray-600">
                          {conflict.aiSuggestion}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                        Ignore
                      </button>
                      <button className="px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary-dark">
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>No scheduling conflicts detected</p>
            </div>
          )}
        </div>
      )}

      {/* Venues/Resources View */}
      {schedulingView === "resources" && (
        <div
          className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-white"
        >
          <h4 className="font-medium text-gray-800 mb-4 flex items-center">
            <FaBuilding className="text-primary mr-2" />
            Venue Management
          </h4>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Venue Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Capacity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Resources
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Availability
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venues.map((venue) => (
                  <tr key={venue.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {venue.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {venue.capacity} people
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {venue.resources.map((resource) => (
                          <span
                            key={resource}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          venue.availability === "High"
                            ? "bg-green-100 text-green-800"
                            : venue.availability === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {venue.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark mr-3">
                        View Schedule
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {venues.length} venues
            </div>
            <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
          </div>
        </div>
      )}

      {/* Regular Events Table for non-head roles */}
      {!isRoleHead && (
        <div
          className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-white"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Events Management
            </h3>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Create New Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Event Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Committee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{event.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.committee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href="#"
                        className="text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200"
                      >
                        View
                      </a>
                      <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                        Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventScheduling;
