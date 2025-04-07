// Implementation of AI services using Google's Generative AI (Gemini)
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Generate task assignments based on task requirements and team member profiles
 * @param {Object} taskData - Information about the task
 * @param {Array} teamMembers - Array of team member profiles
 * @returns {Promise<Object>} - AI-generated task assignments
 */
export const generateTaskAssignments = async (taskData, teamMembers) => {
  console.log("Generating AI task assignments for:", taskData.title);

  try {
    // Create a structured prompt for Gemini
    const prompt = `
    Task Assignment Request:
    I need to assign the following task to the most appropriate team member(s).
    
    Task Details:
    - Title: ${taskData.title}
    - Description: ${taskData.description}
    - Required Skills: ${taskData.requiredSkills.join(", ")}
    - Priority: ${taskData.priority}
    - Deadline: ${taskData.deadline}
    - Estimated Hours: ${taskData.estimatedHours}
    
    Team Members Information:
    ${teamMembers.map(member => `
    - Name: ${member.name}
    - Role: ${member.role}
    - Skills: ${member.skills.join(", ")}
    - Current Tasks: ${member.currentTasks.length}
    - Availability: ${member.availability ? member.availability.join(", ") : "Not specified"}
    `).join("\n")}
    
    Please analyze the task requirements and team members' profiles to determine the best assignment.
    Return your response in the following JSON format:
    {
      "assignedTo": ["user_id1", "user_id2"], // Array of user IDs who should be assigned to this task
      "reasoning": "Detailed explanation of why these members were selected",
      "suggestedTimeline": "Recommendation for how to approach the task timeline",
      "confidenceScore": 0.85 // A number between 0 and 1 indicating confidence in this assignment
    }
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    // Look for JSON pattern between curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          assignedTo: parsedResponse.assignedTo || [],
          reasoning: parsedResponse.reasoning || "No reasoning provided",
          suggestedTimeline: parsedResponse.suggestedTimeline || "No timeline suggested",
          confidenceScore: parsedResponse.confidenceScore || 0.7
        };
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        // Fall back to default assignment logic
      }
    }
    
    // Fallback logic if Gemini fails or returns invalid JSON
    // Find team members with matching skills
    const matchingMembers = teamMembers.filter((member) => {
      return member.skills.some(skill => taskData.requiredSkills.includes(skill));
    });

    // Sort by workload (fewer tasks is better)
    const sortedMembers = [...matchingMembers].sort(
      (a, b) => a.currentTasks.length - b.currentTasks.length
    );

    // Get the best match
    const bestMatch = sortedMembers.length > 0 ? sortedMembers[0] : teamMembers[0];

    // For complex tasks, add a second team member
    let assignedMembers = [bestMatch.id];
    if (taskData.estimatedHours > 8 && sortedMembers.length > 1) {
      assignedMembers.push(sortedMembers[1].id);
    }

    return {
      assignedTo: assignedMembers,
      reasoning: `${bestMatch.name} is the best match for this task because they have ${bestMatch.skills
        .filter((skill) => taskData.requiredSkills.includes(skill))
        .join(", ")} skills which are required for this task. They currently have ${bestMatch.currentTasks.length} tasks assigned, which means they have capacity to take on this work.${assignedMembers.length > 1
          ? ` Since this is a complex task requiring ${taskData.estimatedHours} hours, I've also assigned a second team member to collaborate.`
          : ""
      }`,
      suggestedTimeline: `Given the task complexity and deadline of ${taskData.deadline}, I recommend starting this task immediately and allocating ${Math.ceil(taskData.estimatedHours / assignedMembers.length)} hours per person over the next ${Math.min(5, Math.ceil(taskData.estimatedHours / 2))} days.`,
      confidenceScore: 0.8,
    };
  } catch (error) {
    console.error("Error generating task assignments with Gemini:", error);
    
    // Return a fallback response if the API call fails
    return {
      assignedTo: [teamMembers[0].id],
      reasoning: "Fallback assignment due to AI service error. Assigned to team lead as default.",
      suggestedTimeline: "Please reassess timeline manually.",
      confidenceScore: 0.5,
    };
  }
};

/**
 * Generate task recommendations for a specific user
 * @param {Object} userData - User profile data
 * @param {Array} availableTasks - Array of available tasks
 * @returns {Promise<Object>} - AI-recommended tasks for the user
 */
export const recommendTasksForUser = async (userData, availableTasks) => {
  console.log("Generating task recommendations for:", userData.name);

  try {
    // Create a structured prompt for Gemini
    const prompt = `
    Task Recommendation Request:
    I need to recommend tasks for a team member based on their skills and available tasks.
    
    Team Member Details:
    - Name: ${userData.name}
    - Role: ${userData.role}
    - Skills: ${userData.skills.join(", ")}
    - Specialization: ${userData.specialization || "Not specified"}
    - Current Tasks: ${userData.currentTasks ? userData.currentTasks.length : 0}
    - Availability: ${userData.availability ? userData.availability.join(", ") : "Not specified"}
    
    Available Tasks:
    ${availableTasks.map(task => `
    - Task ID: ${task.id}
    - Title: ${task.title}
    - Description: ${task.description}
    - Required Skills: ${task.requiredSkills.join(", ")}
    - Priority: ${task.priority}
    - Deadline: ${task.deadline}
    - Estimated Hours: ${task.estimatedHours}
    `).join("\n")}
    
    Please analyze the team member's skills and the available tasks to recommend the top 3 most suitable tasks.
    Return your response in the following JSON format:
    {
      "recommendedTasks": [
        {
          "taskId": "task1",
          "reasoning": "Detailed explanation of why this task is recommended",
          "fitScore": 0.95 // A number between 0 and 1 indicating how well the task fits the user
        },
        // Additional task recommendations...
      ]
    }
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        if (parsedResponse.recommendedTasks && Array.isArray(parsedResponse.recommendedTasks)) {
          return {
            recommendedTasks: parsedResponse.recommendedTasks.map(task => ({
              taskId: task.taskId,
              reasoning: task.reasoning || "No reasoning provided",
              fitScore: task.fitScore || 0.7
            }))
          };
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        // Fall back to default recommendation logic
      }
    }
    
    // Fallback logic if Gemini fails or returns invalid JSON
    // Find tasks that match the user's skills
    const matchingTasks = availableTasks.filter((task) => {
      return task.requiredSkills.some(skill => userData.skills.includes(skill));
    });

    // Sort by priority and deadline
    const sortedTasks = [...matchingTasks].sort((a, b) => {
      // First sort by priority
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Then sort by deadline
      return new Date(a.deadline) - new Date(b.deadline);
    });

    // Take top 3 tasks or fewer if not enough matches
    const recommendedTasks = sortedTasks.slice(0, 3).map((task, index) => {
      // Calculate a fit score based on position
      const fitScore = 0.95 - index * 0.08;

      // Find matching skills
      const matchingSkills = task.requiredSkills.filter((skill) =>
        userData.skills.includes(skill)
      );

      return {
        taskId: task.id,
        reasoning: `This task requires ${matchingSkills.join(", ")} which matches your skill set. ${task.priority} priority tasks should be addressed promptly, and your experience in ${userData.specialization || "your field"} makes you well-suited for this work.`,
        fitScore: fitScore,
      };
    });

    return {
      recommendedTasks:
        recommendedTasks.length > 0
          ? recommendedTasks
          : [
              {
                taskId: availableTasks[0]?.id || "task1",
                reasoning: "Although this task doesn't perfectly match your skills, it's a high priority item that needs attention.",
                fitScore: 0.65,
              },
            ],
    };
  } catch (error) {
    console.error("Error generating task recommendations with Gemini:", error);
    
    // Return a fallback response if the API call fails
    return {
      recommendedTasks: [
        {
          taskId: availableTasks[0]?.id || "task1",
          reasoning: "Fallback recommendation due to AI service error. This is a high priority task that needs attention.",
          fitScore: 0.7,
        }
      ]
    };
  }
};

/**
 * Generate insights about team workload and task distribution
 * @param {Array} teamMembers - Array of team member profiles
 * @param {Array} allTasks - Array of all tasks
 * @returns {Promise<Object>} - AI-generated insights
 */
export const generateTeamWorkloadInsights = async (teamMembers, allTasks) => {
  console.log("Generating team workload insights");

  try {
    // Create a structured prompt for Gemini
    const prompt = `
    Team Workload Analysis Request:
    I need to analyze the workload distribution across team members and identify potential task redistributions.
    
    Team Members and Their Tasks:
    ${teamMembers.map(member => {
      // Only count non-completed tasks for workload analysis
      const assignedTasks = allTasks.filter(task => 
        task.assignedTo.includes(member.id) && 
        task.status !== "Completed"
      );
      const totalHours = assignedTasks.reduce((total, task) => total + (task.estimatedHours || 5), 0);
      
      return `
      - Name: ${member.name}
      - ID: ${member.id}
      - Role: ${member.role}
      - Skills: ${member.skills.join(", ")}
      - Assigned Tasks: ${assignedTasks.length}
      - Total Estimated Hours: ${totalHours}
      - Task Details: ${assignedTasks.map(task => `${task.title} (${task.status}, ${task.estimatedHours} hours)`).join(", ")}
      `;
    }).join("\n")}
    
    All Tasks:
    ${allTasks.map(task => `
    - Task ID: ${task.id}
    - Title: ${task.title}
    - Status: ${task.status}
    - Required Skills: ${task.requiredSkills.join(", ")}
    - Estimated Hours: ${task.estimatedHours}
    - Assigned To: ${task.assignedTo.length > 0 ? task.assignedTo.join(", ") : "Unassigned"}
    `).join("\n")}
    
    Please analyze the workload distribution and suggest task redistributions to balance the team's workload.
    Return your response in the following JSON format:
    {
      "workloadAnalysis": {
        "overloadedMembers": ["user1", "user2"], // IDs of members with too many tasks
        "underutilizedMembers": ["user3", "user4"], // IDs of members with too few tasks
        "balancedMembers": ["user5", "user6"] // IDs of members with appropriate workload
      },
      "redistributionSuggestions": [
        {
          "taskId": "task1",
          "currentAssignee": "user1",
          "suggestedAssignee": "user3",
          "reasoning": "Detailed explanation for this suggestion"
        }
      ],
      "generalInsights": "Overall analysis of the team's workload distribution and recommendations"
    }
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          workloadAnalysis: parsedResponse.workloadAnalysis || {
            overloadedMembers: [],
            underutilizedMembers: [],
            balancedMembers: []
          },
          redistributionSuggestions: parsedResponse.redistributionSuggestions || [],
          generalInsights: parsedResponse.generalInsights || "No insights provided by AI"
        };
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        // Fall back to default workload analysis logic
      }
    }
    
    // Fallback logic if Gemini fails or returns invalid JSON
    // Analyze workload distribution
    const memberWorkloads = teamMembers.map((member) => {
      // Count assigned tasks (excluding completed ones)
      const assignedTasks = allTasks.filter((task) =>
        task.assignedTo.includes(member.id) &&
        task.status !== "Completed"
      );

      // Calculate workload score (0-10) based on number of tasks and their estimated hours
      const workloadScore =
        assignedTasks.reduce(
          (total, task) => total + (task.estimatedHours || 5),
          0
        ) / 10;

      return {
        id: member.id,
        name: member.name,
        taskCount: assignedTasks.length,
        workloadScore: workloadScore,
      };
    });

    // Categorize members based on workload
    const overloadedMembers = memberWorkloads
      .filter((member) => member.workloadScore > 7 || member.taskCount > 3)
      .map((member) => member.id);

    const underutilizedMembers = memberWorkloads
      .filter((member) => member.workloadScore < 3 && member.taskCount < 2)
      .map((member) => member.id);

    const balancedMembers = memberWorkloads
      .filter(
        (member) =>
          !overloadedMembers.includes(member.id) &&
          !underutilizedMembers.includes(member.id)
      )
      .map((member) => member.id);

    // Generate redistribution suggestions
    const redistributionSuggestions = [];

    // For each overloaded member, suggest moving a task to an underutilized member
    overloadedMembers.forEach((memberId) => {
      const member = teamMembers.find((m) => m.id === memberId);
      if (!member) return;

      // Find tasks assigned to this member
      const memberTasks = allTasks.filter(
        (task) =>
          task.assignedTo.includes(memberId) && task.status !== "Completed"
      );

      if (memberTasks.length > 0 && underutilizedMembers.length > 0) {
        // Find a suitable task to reassign
        const taskToReassign = memberTasks[0];

        // Find a suitable member to reassign to
        const potentialAssignees = teamMembers.filter(
          (m) =>
            underutilizedMembers.includes(m.id) &&
            m.skills.some((skill) =>
              taskToReassign.requiredSkills.includes(skill)
            )
        );

        if (potentialAssignees.length > 0) {
          const newAssignee = potentialAssignees[0];

          redistributionSuggestions.push({
            taskId: taskToReassign.id,
            currentAssignee: memberId,
            suggestedAssignee: newAssignee.id,
            reasoning: `${member.name} is currently overloaded with ${memberTasks.length} tasks. ${newAssignee.name} has capacity and the necessary skills to take on the "${taskToReassign.title}" task.`,
          });
        }
      }
    });

    return {
      workloadAnalysis: {
        overloadedMembers,
        underutilizedMembers,
        balancedMembers,
      },
      redistributionSuggestions,
      generalInsights: `The team currently has ${
        overloadedMembers.length
      } overloaded members and ${
        underutilizedMembers.length
      } underutilized members. ${
        redistributionSuggestions.length > 0
          ? "I recommend redistributing tasks as suggested to balance the workload."
          : "The current workload distribution is relatively balanced, but could be optimized further."
      }`,
    };
  } catch (error) {
    console.error("Error generating team workload insights with Gemini:", error);
    
    // Return a fallback response if the API call fails
    return {
      workloadAnalysis: {
        overloadedMembers: [],
        underutilizedMembers: [],
        balancedMembers: teamMembers.map(member => member.id)
      },
      redistributionSuggestions: [],
      generalInsights: "Unable to analyze workload distribution due to an AI service error. Please try again later."
    };
  }
};
