# YouTube Thumbnail Generator

An AI-powered YouTube thumbnail generator built with **Next.js 15**, **Vercel AI SDK**, and **Tailwind CSS**. Generate eye-catching thumbnails by simply describing your idea.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![AI SDK](https://img.shields.io/badge/AI%20SDK-5.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── image/
│           └── route.ts      # AI image generation API
├── components/
│   ├── ThumbnailGenerator.tsx   # Main thumbnail generator component
│   ├── ai-elements/             # AI-specific UI components
│   │   ├── conversation.tsx     # Chat-like conversation UI
│   │   ├── prompt-input.tsx     # Rich prompt input with attachments
│   │   └── loader.tsx           # Animated loading spinner
│   └── ui/                      # Base UI components (shadcn/ui style)
│       ├── button.tsx
│       ├── empty.tsx
│       ├── input-group.tsx
│       └── ...
└── lib/
    ├── utils.ts              # Utility functions (cn, etc.)
    └── request-utils.ts      # API response helpers
```

---

## 🧩 Key Components

### 1. `ThumbnailGenerator.tsx` (Main Component)

The core component that orchestrates the entire thumbnail generation flow.

**Key Features:**
- Chat-style UI for prompt/response display
- Image attachment support
- Loading states and error handling

**Important Functions:**

| Function | Description |
|----------|-------------|
| `handleSubmit()` | Handles form submission, sends prompt to API, updates conversation state |
| `EmptyState` | Displays initial state with example prompts |

**State Management:**
```tsx
const [prompt, setPrompt] = useState("...");  // User input
const [conversations, setConversations] = useState<ConversationEntry[]>([]);  // Chat history
```

---

### 2. API Route: `/api/image/route.ts`

Handles AI image generation using the **Vercel AI SDK**.

**Key Highlights:**

| Feature | Description |
|---------|-------------|
| **Model** | `google/gemini-2.5-flash-image-preview` |
| **Input** | Text prompt + optional image attachments |
| **Output** | Base64 encoded generated image |

**System Prompt:**
> "Generate bold, high-contrast YouTube thumbnails with minimal text, clear focal subjects, vibrant colors, and strong visual hierarchy."

**Core Function:**
```typescript
const result = await generateText({
    model: "google/gemini-2.5-flash-image-preview",
    messages: [{ role: "user", content: messageParts }],
    system: "..."
});
```

---

### 3. AI Elements Components

#### `conversation.tsx`
Chat-like scrollable conversation container.

| Component | Purpose |
|-----------|---------|
| `Conversation` | Main wrapper with auto-scroll behavior |
| `ConversationContent` | Container for messages |
| `ConversationEmptyState` | Placeholder when no messages |
| `ConversationScrollButton` | Button to scroll to bottom |

Uses `use-stick-to-bottom` library for smart auto-scrolling.

---

#### `prompt-input.tsx`
Rich input component with file attachment support.

| Component | Purpose |
|-----------|---------|
| `PromptInput` | Form wrapper with state management |
| `PromptInputTextarea` | Auto-resizing text input |
| `PromptInputAttachments` | Display attached files |
| `PromptInputSubmit` | Submit button with loading states |
| `PromptInputButton` | Action buttons (attach, etc.) |

**Custom Hooks:**
- `usePromptInputAttachments()` - Access file attachment functionality
- `usePromptInputController()` - Access input state from anywhere

---

#### `loader.tsx`
Animated SVG spinner for loading states.

---

### 4. Empty State Components (`ui/empty.tsx`)

Composable empty state display with variants.

| Component | Purpose |
|-----------|---------|
| `Empty` | Container with dashed border |
| `EmptyHeader` | Title section |
| `EmptyMedia` | Icon/image display (supports variants) |
| `EmptyTitle` | Main heading |
| `EmptyDescription` | Subtext |
| `EmptyContent` | Additional content |

---

## 🔧 Utility Functions

### `lib/utils.ts`
- `cn()` - Merge Tailwind classes (clsx + tailwind-merge)

### `lib/request-utils.ts`
- `createErrorResponse()` - Standardized error responses
- `createSuccessResponse()` - Standardized success responses

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `ai` (v5.0) | Vercel AI SDK for image generation |
| `next` (v15.5) | React framework with App Router |
| `use-stick-to-bottom` | Auto-scroll behavior for chat |
| `lucide-react` | Icon library |
| `class-variance-authority` | Component variants |
| `tailwind-merge` | Merge Tailwind classes |
| `nanoid` | Unique ID generation |
| `@radix-ui/*` | Headless UI primitives |

---

## 🔄 Data Flow

```
User Input → ThumbnailGenerator.handleSubmit()
                    ↓
            POST /api/image
                    ↓
         generateText() (AI SDK)
                    ↓
            Base64 Image Response
                    ↓
         Update conversations state
                    ↓
            Render generated image
```

---

## 🎨 UI Features

- **Dark mode support** via Tailwind CSS
- **Responsive design** with max-width constraints
- **Loading indicators** during generation
- **Image attachments** as reference for AI
- **Chat-style conversation** history

---

## 💡 Example Prompts

- "Tech review with shocked face and iPhone"
- "Gaming thumbnail with neon Fortnite style"
- "Cooking video with delicious pizza"
- "How to solve a Rubik's cube tutorial"

---

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📝 License

MIT
