# Admin and Student Course Guide

This document explains:

1. How an admin creates a course
2. How an admin adds chapters and content items
3. What each button does
4. How students view their enrolled courses
5. What must happen before a student can access a course

## 1. Admin Flow Overview

For a student to view a course successfully, these steps must happen in order:

1. Admin logs in
2. Admin creates the course
3. Admin adds chapters
4. Admin adds content items inside each chapter
5. Admin enrolls the student into the course
6. Admin publishes the course
7. Student logs in and opens the course from the student dashboard

Important:

- A student can only see courses where they are enrolled as `student`
- A student can only see courses that are `published`

## 2. Admin Dashboard: Courses Section

After admin login:

1. Open the `Admin Dashboard`
2. In the left sidebar, click `Courses`
3. The course management screen will open

### Buttons available on the Courses screen

#### `Create Course`

Use this button to create a new course.

Steps:

1. Click `Create Course`
2. In the popup window, enter:
   - `Title`
   - `Description` (optional)
   - `Published` status if available in the form
3. Click `Create Course`
4. The new course card will appear in the course list

#### `Filters`

Use this button to filter courses by status:

- `All Courses`
- `Published`
- `Draft`

#### Grid/List view buttons

Use these buttons to change how course cards are displayed:

- `Grid view`
- `List view`

### Buttons available on each course card

Each course card has these action buttons:

#### `Content`

Opens the course content management page where chapters and topics are added.

#### `Enroll`

Opens the enrollment page for adding students or teachers to that course.

#### `course discussion` / `course discussions`

Opens the course discussion area.

#### `Draft` / `Published`

- If the course shows `Draft`, the course is not yet visible to students
- Click `Draft` to publish the course
- If the course shows `Published`, the course is already visible to enrolled students

#### Three-dot menu

The three-dot menu provides:

- `Update`
- `Delete`

### Updating a course

Steps:

1. Click the three-dot menu on the course card
2. Click `Update`
3. Edit the course title, description, or publish toggle
4. Click `Save`

### Deleting a course

Steps:

1. Click the three-dot menu on the course card
2. Click `Delete`
3. Confirm the delete action

Note:

- Deleting a course removes the course and its related content

## 3. How Admin Adds Course Content

To add course material:

1. Go to `Admin Dashboard`
2. Click `Courses`
3. Find the required course
4. Click the `Content` button on that course

This opens the Course Content screen.

## 4. Course Content Screen Layout

The Course Content page has two main sections:

### Left side

The left panel shows:

- Course chapters
- Topics/items inside each chapter
- Course progress bar
- `Add Chapter` button

### Right side

The right panel shows:

- The selected content item
- `Previous` button
- `Next` button

If no item is selected, the screen shows a message asking the user to select a chapter/topic.

## 5. How to Add a Chapter

At the bottom of the left panel there is an `Add Chapter` button.

Steps:

1. Click `Add Chapter`
2. A popup window opens with the title `Add Chapter`
3. Enter the chapter name in `Chapter title`
4. Click `Add`

Result:

- A new chapter is created in the left panel

### Chapter-level buttons

Each chapter has:

- Expand/collapse arrow
- Three-dot menu

### Chapter three-dot menu actions

#### `Rename`

Steps:

1. Click the chapter three-dot menu
2. Click `Rename`
3. Enter the new chapter name
4. Confirm

#### `Delete`

Steps:

1. Click the chapter three-dot menu
2. Click `Delete`
3. Confirm deletion

Important:

- Deleting a chapter also deletes the items inside that chapter

## 6. How to Add a Content Item

Inside each expanded chapter, there is a `+ Add Topic` button.

Steps:

1. Open the required course through the `Content` button
2. Expand the required chapter
3. Click `+ Add Topic`
4. The `Add Item` popup opens
5. Select the item type
6. Enter the topic name in `Topic Name`
7. Upload a file or enter a URL, depending on item type
8. Click `Add`

## 7. Content Item Types and Their Inputs

The system supports these item types:

- `Video`
- `Audio File`
- `PDF Document`
- `SCORM Package`
- `HTML Lesson`
- `Text File`
- `External Link`

### File upload item types

These item types require uploading a file:

- `Video`
- `Audio File`
- `PDF Document`
- `SCORM Package`
- `HTML Lesson`
- `Text File`

Admin steps for file-based items:

1. Select the item type
2. Enter `Topic Name`
3. Choose the file using the file upload field
4. Click `Add`

### URL-based item type

This item type requires a URL:

- `External Link`

Admin steps for link-based items:

1. Select `External Link`
2. Enter `Topic Name`
3. Enter the URL in `Enter external link (https://...)`
4. Click `Add`

## 8. Item-Level Buttons and Actions

Each topic/item inside a chapter has a three-dot menu.

This menu provides:

- `Rename`
- `Update`
- `Delete`

### `Rename`

Use this to change the topic title.

Steps:

1. Click the item three-dot menu
2. Click `Rename`
3. Enter the new topic name
4. Confirm

### `Update`

Use this to replace the file or change the item name.

Steps:

1. Click the item three-dot menu
2. Click `Update`
3. In the popup:
   - Edit `Item Name` if needed
   - Upload a new file in `Select New File` if needed
4. Click `Update`

Important:

- Uploading a different file type can automatically change the content type

### `Delete`

Use this to remove the topic from the chapter.

Steps:

1. Click the item three-dot menu
2. Click `Delete`
3. Confirm deletion

## 9. Previous and Next Buttons in Course Content

On the right side of the Course Content screen, the selected item can be viewed.

### `Previous`

- Opens the previous item in the content order

### `Next`

- Opens the next item in the content order
- For student users, moving to the next item also marks the current item as completed

## 10. How Admin Enrolls Students or Teachers

To enroll users:

1. Go to `Admin Dashboard`
2. Click `Courses`
3. Find the course
4. Click `Enroll`

This opens the Enroll Users screen.

### Left side buttons

- `Enroll student`
- `Enroll Teacher`
- `Back To Admin Dashboard`

### Right side top buttons

When a role is selected, the screen shows:

- `Add User`
- `Bulk Upload`

## 11. Enroll a Single Student or Teacher

Steps:

1. Click `Enroll student` or `Enroll Teacher`
2. Click `Add User`
3. Enter the user email
4. Click `Enroll`

Important:

- The user must already exist in the system
- If the user is already enrolled, the system will show an error

## 12. Bulk Upload Enrollment

Steps:

1. Click `Enroll student` or `Enroll Teacher`
2. Click `Bulk Upload`
3. Click `Download Sample` if you need the CSV format
4. Upload a CSV file with an `email` column
5. Click `Upload & Enroll`

## 13. Manage Existing Enrollments

Each enrolled user row has a three-dot menu.

Actions available:

- `Change Role`
- `Remove`

### `Change Role`

Changes the user between student and teacher for that course.

### `Remove`

Removes the user from the course.

## 14. Publishing the Course

This is one of the most important steps.

If the course remains in `Draft`, students will not see it in their dashboard even if they are enrolled.

Steps:

1. Go to `Admin Dashboard`
2. Click `Courses`
3. Find the course card
4. Click the `Draft` badge/button
5. A confirmation popup appears
6. Click `Yes, Publish`

After this:

- The course status becomes `Published`
- Enrolled students can see it in their dashboard

## 15. Student View: How Students See Enrolled Courses

After student login:

1. The student opens `Student Dashboard`
2. The default section is `Courses`
3. The screen shows `Active Courses`
4. Only published courses where the user is enrolled as a student are shown

If no course is available, the student will see:

- `You are not enrolled in any courses yet.`

### Course card button for students

Each student course card contains:

- Course title
- Course description
- `View Course` button

## 16. How Student Opens a Course

Steps:

1. Student logs in
2. On the dashboard, locate the required course
3. Click `View Course`

This opens the student course view page.

## 17. Student Course View Layout

The student course page has two sections.

### Left panel

The left panel shows:

- Course title area
- Progress bar
- Chapter list
- Topics/items under each chapter
- `Back to My Courses`

### Right panel

The right panel shows:

- Course title
- Current chapter and content title
- `Previous` button
- `Next` button
- Content viewer

## 18. How Student Uses the Course

Steps:

1. Student clicks a chapter to expand it
2. Student clicks a topic/item inside the chapter
3. The selected content opens on the right side
4. Student can move using:
   - `Previous`
   - `Next`

### Completion behavior

- When a student clicks `Next`, the current item is marked as completed
- Completed items show a check mark in the left panel
- The progress bar updates based on completed items

## 19. How Each Content Type Appears to the Student

The content viewer supports:

- `video` as video player
- `audio` as audio player
- `pdf` as PDF viewer
- `scorm` as SCORM player
- `link` as external content viewer
- `html` as HTML viewer
- `text` as text viewer

## 20. Full End-to-End Example

Example workflow:

1. Admin logs in
2. Admin opens `Courses`
3. Admin clicks `Create Course`
4. Admin enters course title and description
5. Admin clicks `Create Course`
6. Admin clicks `Content`
7. Admin clicks `Add Chapter`
8. Admin creates Chapter 1
9. Admin expands Chapter 1
10. Admin clicks `+ Add Topic`
11. Admin selects `PDF Document`
12. Admin enters topic name
13. Admin uploads the PDF
14. Admin clicks `Add`
15. Admin adds more videos, SCORM, links, or text items the same way
16. Admin returns to the course list
17. Admin clicks `Enroll`
18. Admin selects `Enroll student`
19. Admin clicks `Add User`
20. Admin enters the student email
21. Admin clicks `Enroll`
22. Admin goes back to the course list
23. Admin clicks `Draft`
24. Admin confirms by clicking `Yes, Publish`
25. Student logs in
26. Student opens `Student Dashboard`
27. Student sees the course under `Active Courses`
28. Student clicks `View Course`
29. Student expands the chapter
30. Student opens the topic and starts learning

## 21. Quick Checklist for Admin

Before telling a student to open a course, confirm all items below:

- Course is created
- Course content is added
- Student is enrolled with role `student`
- Course is published

If any one of these is missing, the student may not be able to view the course.
