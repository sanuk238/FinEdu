# TODO: Shrink Chat Popup Vertically

## Plan
Reduce the chat popup size to fit in 100vh without scrolling by:
1. Reduce popup height from 640px to ~500px
2. Reduce font sizes throughout (header, messages, welcome screen, suggestions)
3. Reduce padding in all sections
4. Ensure content fits without scrolling

## Files to Edit
- `frontend/styles/pages/chatbot.css`

## Changes Required
1. `.chat-popup` - Reduce height and max-height
2. `.chat-popup-header` - Reduce padding
3. `.chat-popup-header h2` - Reduce font size
4. `.welcome-screen` - Reduce padding
5. `.welcome-card` - Reduce padding
6. `.welcome-card h2` - Reduce font size
7. `.welcome-card p` - Reduce font size
8. `.suggestion-grid` - Reduce gap
9. `.suggestion-card` - Reduce padding
10. `.chat-body` - Reduce padding
11. `.message-content` - Reduce padding and font size
12. `.message-avatar` - Reduce size
13. `.chat-composer` - Reduce padding
14. `.chat-input-wrapper` - Reduce padding
15. `#chatInput` - Reduce font size

## Follow-up Steps
- Test the popup to ensure it fits within 100vh without scrolling

