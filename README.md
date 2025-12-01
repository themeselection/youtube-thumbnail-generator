# YouTube Thumbnail Generator

An AI-powered YouTube thumbnail generator built with **Next.js 15**, **Vercel AI SDK**, and **Tailwind CSS**. Generate eye-catching thumbnails by simply describing your idea.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![AI SDK](https://img.shields.io/badge/AI%20SDK-5.3-blue)
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

```mermaid
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

---

## 🔄 Data Flow

```marmaid
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

## 💡 Example Prompts

- "Tech review with shocked face and iPhone"
- "Gaming thumbnail with neon Fortnite style"
- "Cooking video with delicious pizza"
- "How to solve a Rubik's cube tutorial"


## 📝 License

MIT
