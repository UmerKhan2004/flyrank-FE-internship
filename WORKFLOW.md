# WORKFLOW.md — Prompt Quality Comparison

## What I Built
A settings form with name, email, and bio fields.

## Round One — Vague Prompt
**Prompt used:** "build me a settings form"

**What I got:**
- Basic HTML form with no validation
- No error messages
- No styling applied
- Uncontrolled inputs

**Problems:**
- Would need heavy manual fixing to use in production
- No feedback to user on wrong input
- Not styled at all

## Round Two — Precise Prompt
**Prompt used:** "Build a React settings form component using 
react-hook-form and zod for validation. The form should have: 
full name field (required, min 2 chars), email field (required, 
valid email format), bio textarea (optional, max 200 chars). 
Show inline error messages below each field in red. On submit, 
log the form data to console. Use Tailwind CSS for styling. 
Mobile-first layout. After writing the code, write a simple test 
to verify the form shows an error when name is empty."

**What I got:**
- React component with react-hook-form and zod validation
- Inline red error messages for each field
- Tailwind CSS styling applied
- A test file included (SettingsForm.test.jsx)

## Specific Diffs
- Round one used uncontrolled inputs, round two used react-hook-form
- Round one had zero validation, round two had zod schema validation
- Round one had no styling, round two used Tailwind CSS
- Round one had no tests, round two included a test file

## AI Mistake I Caught
Round two generated package.json and package-lock.json which were 
not needed since this is not a standalone project. These files 
should not have been included in the repo.

## Time Comparison
- Round one: 2 mins prompting + 20 mins fixing needed = slow
- Round two: 5 mins prompting + 2 mins reviewing = fast end-to-end
Round two felt slower to prompt but was much faster overall.

## What I Learned
Precise prompts with constraints, file references, and verification 
steps produce near production-ready code. Vague prompts produce 
a rough starting point that needs heavy manual fixing. The extra 
time spent writing a good prompt saves much more time in review.