import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaBalanceScale,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaRobot,
  FaUserCog,
  FaUserFriends,
} from "react-icons/fa";
import {
  generateTaskAssignments,
  generateTeamWorkloadInsights,
  recommendTasksForUser,
} from "../../services/ai/generativeAI";
import Button from "../common/Button";

/**
 * TaskAI component that provides AI-powered task allocation and insights
 * using Google's Generative AI
 */
const TaskAI = ({ tasks, teamMembers, currentUser, onAssignTask }) => {
  const [activeTab, setActiveTab] = useState("assign");
  const [selectedTask, setSelectedTask] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workloadInsights, setWorkloadInsights] = useState(null);
  const [personalRecommendations, setPersonalRecommendations] = useState(null);

  // Reset state when changing tabs
  useEffect(() => {
    setSelectedTask(null);
    setAiResponse(null);
    setError(null);
  }, [activeTab]);

  // Generate AI task assignments
  const handleGenerateAssignments = async (task) => {
    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const result = await generateTaskAssignments(task, teamMembers);
      setAiResponse(result);
    } catch (err) {
      setError("Failed to generate AI assignments. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate personal task recommendations
  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const unassignedTasks = tasks.filter(
        (task) =>
          // Only consider tasks that are not completed and either unassigned or have no assignees
          task.status !== "Completed" &&
          (!task.assignedTo || task.assignedTo.length === 0)
      );
      const result = await recommendTasksForUser(
        teamMembers.find((member) => member.id === currentUser.uid),
        unassignedTasks
      );
      setPersonalRecommendations(result);
    } catch (err) {
      setError("Failed to generate task recommendations. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate team workload insights
  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateTeamWorkloadInsights(teamMembers, tasks);
      setWorkloadInsights(result);
    } catch (err) {
      setError("Failed to generate workload insights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply AI-suggested assignments
  const handleApplyAssignments = () => {
    if (!aiResponse || !selectedTask) return;

    onAssignTask(selectedTask.id, aiResponse.assignedTo);
    setAiResponse(null);
    setSelectedTask(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <FaRobot className="text-primary text-2xl mr-3" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            AI Task Assistant
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "assign"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaUserCog className="inline mr-2" />
            Smart Assignment
          </button>
          <button
            onClick={() => setActiveTab("recommend")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "recommend"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaLightbulb className="inline mr-2" />
            Personal Recommendations
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "insights"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaBalanceScale className="inline mr-2" />
            Workload Insights
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Smart Assignment Tab */}
        {activeTab === "assign" && (
          <div>
            <p className="text-gray-600 mb-4 dark:text-gray-400">
              Let AI suggest the best team members for each task based on
              skills, availability, and workload.
            </p>

            {/* Task selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a task to assign:
              </label>
              <select
                value={selectedTask ? selectedTask.id : ""}
                onChange={(e) => {
                  const task = tasks.find((t) => t.id === e.target.value);
                  setSelectedTask(task);
                  setAiResponse(null);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">-- Select a task --</option>
                {tasks
                  .filter(
                    (task) =>
                      // Only show tasks that are not completed and either unassigned or have no assignees
                      task.status !== "Completed" &&
                      (!task.assignedTo || task.assignedTo.length === 0)
                  )
                  .map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title} ({task.priority} priority)
                    </option>
                  ))}
              </select>
            </div>

            {/* Task details */}
            {selectedTask && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                <h3 className="font-medium text-gray-800 mb-2 dark:text-gray-200">
                  {selectedTask.title}
                </h3>
                <p className="text-gray-600 mb-2 dark:text-gray-400">
                  {selectedTask.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Required Skills:</span>{" "}
                    {selectedTask.requiredSkills.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Deadline:</span>{" "}
                    {selectedTask.deadline}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Hours:</span>{" "}
                    {selectedTask.estimatedHours}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>{" "}
                    <span
                      className={`font-medium ${
                        selectedTask.priority === "High"
                          ? "text-red-600"
                          : selectedTask.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Generate button */}
            <div className="mt-4">
              <Button
                onClick={() => handleGenerateAssignments(selectedTask)}
                disabled={!selectedTask || loading}
                isLoading={loading}
                variant="primary"
                leftIcon={<FaRobot />}
                fullWidth
              >
                Generate AI Assignments
              </Button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <h3 className="font-medium text-blue-800 mb-2 dark:text-gray-200">
                  AI Recommendation
                </h3>

                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    Assigned To:
                  </span>{" "}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {aiResponse.assignedTo.map((member) => (
                      <span
                        key={member}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {teamMembers.find((m) => m.id === member)?.name ||
                          member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    Reasoning:
                  </span>
                  <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">
                    {aiResponse.reasoning}
                  </p>
                </div>

                <div className="mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    Suggested Timeline:
                  </span>
                  <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">
                    {aiResponse.suggestedTimeline}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    Confidence Score:
                  </span>{" "}
                  <span
                    className={`font-medium ${
                      aiResponse.confidenceScore > 0.8
                        ? "text-green-600"
                        : aiResponse.confidenceScore > 0.6
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.round(aiResponse.confidenceScore * 100)}%
                  </span>
                </div>

                <Button
                  onClick={handleApplyAssignments}
                  variant="primary"
                  size="sm"
                  leftIcon={<FaCheckCircle />}
                >
                  Apply This Assignment
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Personal Recommendations Tab */}
        {activeTab === "recommend" && (
          <div>
            <p className="text-gray-600 mb-4">
              Get personalized task recommendations based on your skills,
              interests, and current workload.
            </p>

            <div className="mb-4">
              <Button
                onClick={handleGenerateRecommendations}
                disabled={loading}
                isLoading={loading}
                variant="primary"
                leftIcon={<FaLightbulb />}
                fullWidth
              >
                Generate Recommendations
              </Button>
            </div>

            {personalRecommendations && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Recommended Tasks For You
                </h3>

                {personalRecommendations.recommendedTasks.map((rec, index) => {
                  const task = tasks.find((t) => t.id === rec.taskId);
                  if (!task) return null;

                  return (
                    <div
                      key={rec.taskId}
                      className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          {task.title}
                        </h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {Math.round(rec.fitScore * 100)}% match
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">
                        {task.description}
                      </p>

                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Deadline:</span>{" "}
                          {task.deadline}
                        </div>
                        <div>
                          <span className="font-medium">Estimated Hours:</span>{" "}
                          {task.estimatedHours}
                        </div>
                      </div>

                      <div className="mt-2 dark:text-gray-400">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                          Why it's a good fit:
                        </span>
                        <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">
                          {rec.reasoning}
                        </p>
                      </div>

                      <div className="mt-3">
                        <Button
                          onClick={() =>
                            onAssignTask(task.id, [currentUser.uid])
                          }
                          variant="outline"
                          size="sm"
                        >
                          Take This Task
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}

        {/* Workload Insights Tab */}
        {activeTab === "insights" && (
          <div>
            <p className="text-gray-600 mb-4">
              Get AI-powered insights about team workload distribution and
              optimization suggestions.
            </p>

            <div className="mb-4">
              <Button
                onClick={handleGenerateInsights}
                disabled={loading}
                isLoading={loading}
                variant="primary"
                leftIcon={<FaUserFriends />}
                fullWidth
              >
                Generate Team Insights
              </Button>
            </div>

            {workloadInsights && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                  <h3 className="font-medium text-gray-800 mb-3 dark:text-gray-200">
                    Workload Analysis
                  </h3>

                  {workloadInsights.workloadAnalysis.overloadedMembers.length >
                    0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-red-600 dark:text-gray-400">
                        Overloaded Members:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {workloadInsights.workloadAnalysis.overloadedMembers.map(
                          (member) => (
                            <span
                              key={member}
                              className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs dark:bg-red-600 dark:text-white"
                            >
                              {teamMembers.find((m) => m.id === member)?.name ||
                                member}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {workloadInsights.workloadAnalysis.underutilizedMembers
                    .length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-green-600 dark:text-gray-400">
                        Underutilized Members:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {workloadInsights.workloadAnalysis.underutilizedMembers.map(
                          (member) => (
                            <span
                              key={member}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs dark:bg-green-600 dark:text-white"
                            >
                              {teamMembers.find((m) => m.id === member)?.name ||
                                member}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {workloadInsights.workloadAnalysis.balancedMembers.length >
                    0 && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-600 dark:text-gray-400">
                        Balanced Members:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {workloadInsights.workloadAnalysis.balancedMembers.map(
                          (member) => (
                            <span
                              key={member}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs dark:bg-blue-600 dark:text-white"
                            >
                              {teamMembers.find((m) => m.id === member)?.name ||
                                member}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {workloadInsights.redistributionSuggestions.length > 0 && (
                  <div className="p-4 bg-white border border-gray-200 rounded-md">
                    <h3 className="font-medium text-gray-800 mb-3 dark:text-gray-200">
                      Redistribution Suggestions
                    </h3>

                    <div className="space-y-3">
                      {workloadInsights.redistributionSuggestions.map(
                        (suggestion, index) => {
                          const task = tasks.find(
                            (t) => t.id === suggestion.taskId
                          );
                          if (!task) return null;

                          return (
                            <div
                              key={index}
                              className="p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            >
                              <div className="font-medium text-gray-800 dark:text-gray-200">
                                {task.title}
                              </div>
                              <div className="text-sm mt-1">
                                <span className="font-medium">
                                  Current Assignee:
                                </span>{" "}
                                {teamMembers.find(
                                  (m) => m.id === suggestion.currentAssignee
                                )?.name || suggestion.currentAssignee}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">
                                  Suggested Assignee:
                                </span>{" "}
                                {teamMembers.find(
                                  (m) => m.id === suggestion.suggestedAssignee
                                )?.name || suggestion.suggestedAssignee}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {suggestion.reasoning}
                              </div>

                              <div className="mt-2">
                                <Button
                                  onClick={() =>
                                    onAssignTask(task.id, [
                                      suggestion.suggestedAssignee,
                                    ])
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Apply Change
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                  <h3 className="font-medium text-gray-800 mb-2 dark:text-gray-200">
                    General Insights
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {workloadInsights.generalInsights}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskAI;
