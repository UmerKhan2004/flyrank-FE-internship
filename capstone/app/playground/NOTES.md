# NOTES.md — shadcn/ui vs Hand-built Components

## Modal Dialog
**What I missed:**
- shadcn uses Radix UI under the hood which handles focus trap 
  with a proper FocusScope — my version only focuses the close 
  button but doesn't fully trap Tab/Shift+Tab inside the modal
- shadcn adds aria-describedby automatically for the description
- shadcn handles scroll lock on the body when modal is open
- My version doesn't prevent Tab from leaving the modal

## Tabs
**What I missed:**
- shadcn's tabs automatically handle orientation (horizontal/vertical)
- Radix manages roving tabIndex more robustly than my manual ref array
- shadcn adds data-state attributes for styling active/inactive states
  which is cleaner than className conditionals

## Disclosure
**What I missed:**
- shadcn's Accordion uses AnimatePresence for smooth open/close animation
- My version uses hidden attribute which is abrupt with no transition
- shadcn handles multiple open panels and single-open mode out of the box

## Summary
The two biggest gaps in my hand-built versions:
1. **Focus trap in modal** — Tab key can escape my modal; 
   shadcn's FocusScope prevents this completely
2. **Animation** — shadcn components animate smoothly; 
   my components appear/disappear instantly which feels jarring