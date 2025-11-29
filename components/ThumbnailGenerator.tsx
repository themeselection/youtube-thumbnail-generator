"use client";

import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
    PromptInput,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputButton,
    PromptInputFooter,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
    usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ImageIcon, PaperclipIcon, SparklesIcon } from "lucide-react";
import { type FormEvent, useState } from "react";

const EmptyState = () => (
    <Empty className="mx-auto max-w-2xl">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <div className="-space-x-1 flex">
                    <div className="mt-1 flex size-12 items-center justify-center rounded-full border bg-white p-1 shadow-sm dark:bg-card">
                        <ImageIcon className="size-6" />
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-full border bg-white p-1 shadow-sm dark:bg-card">
                        <SparklesIcon className="size-6" />
                    </div>
                </div>
            </EmptyMedia>
            <EmptyTitle>YouTube Thumbnail Generator</EmptyTitle>
            <EmptyDescription>
                Create eye-catching thumbnails for your videos in seconds. Just describe
                your idea and let AI do the rest.
            </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
            <div className="space-y-2">
                <p className="font-medium text-sm">Try something like:</p>
                <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>Tech review with shocked face and iPhone</li>
                    <li>Gaming thumbnail with neon Fortnite style</li>
                    <li>Cooking video with delicious pizza</li>
                </ul>
            </div>
        </EmptyContent>
    </Empty>
);

type ConversationEntry = {
    id: string;
    prompt: string;
    attachments?: { url: string; filename?: string; mediaType?: string }[];
    imageData?: string;
    isLoading: boolean;
};

export function ThumbnailGenerator() {
    const [prompt, setPrompt] = useState("Create a YouTube thumbnail for video of how to solve a Rubik's cube");
    const [conversations, setConversations] = useState<ConversationEntry[]>([]);

    const handleSubmit = async (
        message: PromptInputMessage,
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        if (!message.text?.trim()) return;

        const entryId = crypto.randomUUID();
        const newEntry: ConversationEntry = {
            id: entryId,
            prompt: message.text.trim(),
            attachments: message.files?.map((file) => ({
                url: file.url || "",
                filename: file.filename,
                mediaType: file.mediaType,
            })),
            isLoading: true,
        };

        setConversations((prev) => [...prev, newEntry]);
        setPrompt("");

        try {
            // Prepare files data for API
            const filesData = message.files?.map((file) => ({
                url: file.url,
                mediaType: file.mediaType,
                filename: file.filename,
            }));

            const response = await fetch("/api/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: message.text.trim(),
                    files: filesData,
                }),
            });

            const data = await response.json();

            setConversations((prev) =>
                prev.map((entry) =>
                    entry.id === entryId
                        ? { ...entry, imageData: data.imageUrl, isLoading: false }
                        : entry
                )
            );
        } catch {
            setConversations((prev) =>
                prev.map((entry) =>
                    entry.id === entryId ? { ...entry, isLoading: false } : entry
                )
            );
        }
    };

    const isAnyLoading = conversations.some((entry) => entry.isLoading);

    return (
        <div className="relative mx-auto size-full h-screen max-w-2xl p-6 pt-12">
            <div className="flex h-full flex-col">
                <Conversation className="flex-1">
                    <ConversationContent>
                        {conversations.length === 0 ? (
                            <ConversationEmptyState>
                                <EmptyState />
                            </ConversationEmptyState>
                        ) : (
                            conversations.map((entry) => (
                                <div key={entry.id} className="space-y-4">
                                    {/* User prompt */}
                                    <div className="flex justify-end">
                                        <div className="max-w-[80%] space-y-2">
                                            {/* Show attached images */}
                                            {entry.attachments && entry.attachments.length > 0 && (
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    {entry.attachments.map((attachment, idx) =>
                                                        attachment.mediaType?.startsWith("image/") ? (
                                                            <img
                                                                key={idx}
                                                                src={attachment.url}
                                                                alt={attachment.filename || "Attached image"}
                                                                className="max-h-24 rounded-lg border object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm"
                                                            >
                                                                <PaperclipIcon className="size-4" />
                                                                {attachment.filename || "Attachment"}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                            <div className="rounded-2xl bg-primary px-4 py-2 text-primary-foreground">
                                                <p className="text-sm">{entry.prompt}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generated image or loading */}
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%]">
                                            {entry.isLoading ? (
                                                <div className="flex items-center gap-2 rounded-2xl border bg-muted px-4 py-3">
                                                    <Loader />
                                                    <span className="text-muted-foreground text-sm">
                                                        Generating image...
                                                    </span>
                                                </div>
                                            ) : entry.imageData ? (
                                                <div className="overflow-hidden rounded-2xl border">
                                                    <img
                                                        src={`data:image/jpeg;base64,${entry.imageData}`}
                                                        alt={`Generated: ${entry.prompt}`}
                                                        className="max-w-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="rounded-2xl border bg-muted px-4 py-2 text-muted-foreground">
                                                    <p className="text-sm">Failed to generate image</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                <PromptInput
                    className="relative mt-4 w-full"
                    onSubmit={handleSubmit}
                    accept="image/*"
                    multiple
                >
                    <PromptInputAttachments>
                        {(attachment) => <PromptInputAttachment data={attachment} />}
                    </PromptInputAttachments>
                    <PromptInputTextarea
                        onChange={(e) => setPrompt(e.currentTarget.value)}
                        placeholder="Describe the image you want to generate..."
                        value={prompt}
                    />
                    <PromptInputFooter>
                        <PromptInputTools>
                            <AttachImageButton />
                        </PromptInputTools>
                        <PromptInputSubmit
                            disabled={!prompt.trim()}
                            status={isAnyLoading ? "submitted" : "ready"}
                        />
                    </PromptInputFooter>
                </PromptInput>
            </div>
        </div>
    );
}

// Separate component to use the usePromptInputAttachments hook inside PromptInput
function AttachImageButton() {
    const attachments = usePromptInputAttachments();

    return (
        <PromptInputButton
            onClick={() => attachments.openFileDialog()}
            aria-label="Attach image"
        >
            <PaperclipIcon className="size-4" />
        </PromptInputButton>
    );
}
