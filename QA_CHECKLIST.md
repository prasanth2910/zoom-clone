# Browser QA Checklist

Run this checklist after starting both backend and frontend locally.

## Setup
- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Open `http://localhost:3000` in browser

---

## Dashboard (/)

### Data Loading
- [ ] Page loads without errors
- [ ] Navbar displays with logo and user profile
- [ ] Hero section shows current time and date
- [ ] "Good morning/afternoon/evening" greeting appears
- [ ] Upcoming Meetings section loads with real data
- [ ] Recent Meetings section loads with real data

### Action Tiles
- [ ] New Meeting tile visible and clickable
- [ ] Join tile visible and clickable
- [ ] Schedule tile visible and clickable
- [ ] My Meetings tile visible and clickable

### Upcoming Meetings
- [ ] Shows at least 5 meetings
- [ ] Each card displays: title, meeting code (grouped), date, time, duration
- [ ] "Start" button visible on each card
- [ ] "Copy Link" button visible on each card

### Recent Meetings
- [ ] Shows at least 4 ended meetings
- [ ] Each card displays: title, meeting code, date, time
- [ ] No "Start" button (read-only)

---

## New Meeting Flow

### Create Meeting
- [ ] Click "New Meeting" tile
- [ ] Loading spinner appears
- [ ] Redirected to meeting room
- [ ] Meeting room loads successfully

### Meeting Room
- [ ] Meeting title displays at top
- [ ] Meeting code displays (grouped format: XXX XXXX XXXX)
- [ ] Green "live" indicator shows
- [ ] "Copy Invite" button visible
- [ ] Participant grid shows local participant (host)
- [ ] Participants panel shows on right with 1 participant (host)
- [ ] Control bar at bottom with: Mute, Video, Share, Participants, Chat, Leave/End

### Copy Invite Link
- [ ] Click "Copy Invite" button
- [ ] Button text changes to "Copied!" with checkmark
- [ ] Text reverts after 2 seconds
- [ ] Link format: `http://localhost:3000/join?meetingId=XXXXXXXXXXX`

---

## Join Meeting Flow

### Join by Meeting ID
- [ ] Open new incognito/private window
- [ ] Go to `http://localhost:3000`
- [ ] Click "Join" tile
- [ ] Inline join panel appears
- [ ] Enter meeting code (e.g., "812 3456 7890" or "81234567890")
- [ ] Click "Continue"
- [ ] Meeting info card appears with title and host name
- [ ] Enter display name (e.g., "Test User")
- [ ] Click "Join Meeting"
- [ ] Redirected to meeting room
- [ ] Participant appears in original window's participant panel

### Join by Invite URL
- [ ] Copy invite link from first window
- [ ] Paste into address bar of incognito window
- [ ] Page loads join form with meeting info pre-filled
- [ ] Enter display name
- [ ] Click "Join Meeting"
- [ ] Participant appears in original window

### Join Error Handling
- [ ] Try invalid meeting ID (e.g., "00000000000")
- [ ] Error message: "Meeting not found. Check the ID and try again."
- [ ] Try ended meeting ID
- [ ] Error message: "This meeting has ended."
- [ ] Try empty display name
- [ ] "Join Meeting" button disabled until name entered

---

## Participant Management

### Participants Panel
- [ ] Shows count: "Participants (N)"
- [ ] Lists all active participants with initials
- [ ] Shows role (host/attendee) for each
- [ ] Shows mute status (red mic icon if muted)
- [ ] Host has shield icon

### Host Controls
- [ ] "Mute All" button visible (host only)
- [ ] Click "Mute All"
- [ ] All attendee participants show mute icon
- [ ] Remove participant button appears on hover (host only)
- [ ] Click remove button
- [ ] Participant disappears from list

### Leave Meeting
- [ ] Click "Leave" button (attendee)
- [ ] Redirected to dashboard
- [ ] Participant removed from host's participant list

### End Meeting
- [ ] Click "End" button (host)
- [ ] Redirected to dashboard
- [ ] Meeting appears in Recent Meetings
- [ ] Meeting no longer in Upcoming Meetings

---

## Schedule Meeting Flow

### Open Schedule Form
- [ ] Click "Schedule" tile
- [ ] Modal appears with form
- [ ] Fields: Topic, Description, Date, Time, Duration

### Fill Form
- [ ] Enter topic: "Test Meeting"
- [ ] Enter description: "QA test"
- [ ] Select future date
- [ ] Select time
- [ ] Select duration (e.g., 45 minutes)
- [ ] Click "Schedule"

### Verification
- [ ] Modal closes
- [ ] New meeting appears immediately in Upcoming Meetings
- [ ] No page refresh needed
- [ ] Meeting shows correct title, date, time, duration

### Validation
- [ ] Try past date → error message
- [ ] Try zero duration → error message
- [ ] Try empty topic → error message
- [ ] Try future date with past time → error message

---

## Meeting Controls

### Mute/Unmute
- [ ] Click Mute button
- [ ] Button highlights (active state)
- [ ] Label changes to "Unmute"
- [ ] Click again to unmute

### Video On/Off
- [ ] Click Video button
- [ ] Camera preview appears (if camera available)
- [ ] Button highlights when video is off
- [ ] Label changes to "Start Video"

### Participants Panel Toggle
- [ ] Click Participants button
- [ ] Panel appears/disappears
- [ ] Chat panel closes when Participants opens

### Chat Panel Toggle
- [ ] Click Chat button
- [ ] Chat panel appears
- [ ] Type message and press Enter
- [ ] Message appears with sender name
- [ ] Participants panel closes when Chat opens

### Share Screen
- [ ] Share Screen button visible
- [ ] Button highlights when active (visual only, no actual sharing)

---

## Responsive Design

### Mobile (375px width)
- [ ] Dashboard tiles stack vertically
- [ ] Navbar collapses to hamburger menu
- [ ] Meeting room controls fit on screen
- [ ] Participants panel accessible via toggle
- [ ] No horizontal scrolling

### Tablet (768px width)
- [ ] Dashboard shows 2 columns
- [ ] Navbar shows full navigation
- [ ] Meeting room readable
- [ ] Participants panel visible

### Desktop (1024px+ width)
- [ ] Dashboard shows 4 action tiles
- [ ] Full navbar with all options
- [ ] Meeting room optimal layout
- [ ] Participants panel always visible

---

## Visual Zoom Similarity

### Colors
- [ ] Primary blue: #0B5CFF (action buttons, links)
- [ ] Dark meeting room: #1C1C1C
- [ ] Light background: #F7F8FA
- [ ] White cards with subtle borders

### Typography
- [ ] Consistent font sizing
- [ ] Clear hierarchy (headings > body > labels)
- [ ] Readable on all screen sizes

### Spacing
- [ ] Generous whitespace
- [ ] Consistent padding/margins
- [ ] No cramped layouts

### Icons
- [ ] Lucide React icons used consistently
- [ ] Appropriate icon sizes
- [ ] Clear visual meaning

### Rounded Corners
- [ ] Action tiles: rounded-2xl
- [ ] Cards: rounded-xl
- [ ] Buttons: rounded-lg
- [ ] Consistent border radius

---

## Error Handling

### Network Errors
- [ ] Backend offline → clear error message
- [ ] Invalid API response → error toast
- [ ] CORS error → helpful message

### Validation Errors
- [ ] Empty fields → disabled buttons
- [ ] Invalid input → error messages
- [ ] Past dates → rejected with message

### Edge Cases
- [ ] Very long meeting titles → truncated with ellipsis
- [ ] Many participants → scrollable list
- [ ] Rapid button clicks → debounced/disabled
- [ ] Browser back button → handled gracefully

---

## Final Sign-Off

- [ ] All checks passed
- [ ] No console errors
- [ ] No TypeScript warnings
- [ ] Responsive on mobile/tablet/desktop
- [ ] Ready for deployment
