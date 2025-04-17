"use client";

import { useChat } from "@ai-sdk/react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import type { UIMessage } from "ai";
import { AnimatePresence } from "framer-motion";
import { SendHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MouseEventGlow } from "@/components/MouseEventGlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useUser } from "./AuthProvider/AuthProvider";
import { ChatMessages } from "./ChatMessages";
import { ImageInput } from "./ImageInput";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export const Chat = ({
	id,
	initialMessages,
	initialTransformedImages = [],
}: {
	id: string;
	initialMessages: Array<UIMessage>;
	initialTransformedImages: string[];
}) => {
	const [transformedImages, setTransformedImages] = useState<string[]>(
		initialTransformedImages,
	);

	const { data: generatedAssets } =
		api.chats.getChatGeneratedAssetsByChatId.useQuery(
			{ chatId: id },
			{ enabled: !!id },
		);

	const hasGeneratedAssets =
		typeof generatedAssets !== "undefined" && generatedAssets.length > 0;

	if (hasGeneratedAssets) {
		return <GeneratedAssets generatedAssets={generatedAssets} />;
	}

	if (transformedImages.length > 0) {
		return (
			<ChatContent
				id={id}
				initialMessages={initialMessages}
				transformedImages={transformedImages}
			/>
		);
	}

	return <ImageInput chatId={id} onImagesUploaded={setTransformedImages} />;
};

export function ChatContent({
	id,
	initialMessages,
	transformedImages,
}: {
	id: string;
	initialMessages: Array<UIMessage>;
	transformedImages: string[];
}) {
	const { user } = useUser();
	const { data: availableTokens } = api.tokens.get.useQuery(undefined, {
		enabled: !!user,
	});

	const { mutateAsync: checkout } = api.tokens.checkout.useMutation();

	const trpcUtils = api.useUtils();
	const { messages, handleSubmit, input, setInput, isLoading, status } =
		useChat({
			id,
			body: { id, transformedImages },
			initialMessages,
			experimental_throttle: 100,
			sendExtraMessageFields: true,
			generateId: () => crypto.randomUUID(),
			onFinish: () => {
				trpcUtils.chats.getChatGeneratedAssetsByChatId.invalidate({
					chatId: id,
				});
				trpcUtils.chats.getChatMessagesByChatId.invalidate({
					chatId: id,
				});
				trpcUtils.chats.getChats.invalidate();
				trpcUtils.tokens.get.invalidate();
			},
			onError: () => {
				toast.error("An error occurred, please try again!");
			},
		});
	const submitInput = () => {
		if (typeof availableTokens === "number" && availableTokens <= 0) {
			toast.error("You have no tokens left!");
			checkout({ chatId: id }).then((checkout) => {
				PolarEmbedCheckout.create(checkout.url, "dark");
			});

			return;
		}
		window.history.replaceState({}, "", `/chat/${id}`);
		handleSubmit();
	};

	return (
		<AnimatePresence>
			<div className="flex flex-col min-w-0 h-dvh bg-black text-white font-archivo relative overflow-x-hidden">
				<MouseEventGlow />
				<div className="relative z-10 flex-1 overflow-hidden">
					<ChatMessages status={status} messages={messages} />
				</div>
				<form
					className="sticky bottom-0 left-0 right-0 flex items-center gap-2 border-t border-purple-700/30 bg-black p-3 md:p-4 z-10"
					onSubmit={(e) => {
						e.preventDefault();
						if (status !== "ready") {
							toast.error("Please wait for the model to finish its response!");
						} else {
							submitInput();
						}
					}}
				>
					<Input
						placeholder="Type your message..."
						className="flex-1 bg-black/80 border-purple-700/30 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-12 md:h-auto"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(event) => {
							if (
								event.key === "Enter" &&
								!event.shiftKey &&
								!event.nativeEvent.isComposing
							) {
								event.preventDefault();
								if (status !== "ready") {
									toast.error(
										"Please wait for the model to finish its response!",
									);
								} else {
									submitInput();
								}
							}
						}}
					/>

					<Button
						type="submit"
						size="icon"
						disabled={!input.trim()}
						className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 w-12 md:h-10 md:w-10"
					>
						<SendHorizontalIcon className="h-5 w-5 md:h-4 md:w-4" />
						<span className="sr-only">Send</span>
					</Button>
				</form>
			</div>
		</AnimatePresence>
	);
}

interface GeneratedAsset {
	id: string;
	type: "birthdaySong" | "birthdayVideo";
	data: {
		songUrl: string;
		lyrics: string;
		videoUrl?: string;
		imagesUrl?: string[];
	};
}

interface GeneratedAssetsProps {
	generatedAssets: GeneratedAsset[];
}

export function GeneratedAssets({ generatedAssets }: GeneratedAssetsProps) {
	return (
		<ScrollArea className="flex-1 h-full">
			<div className="flex gap-4 z-50 w-full flex-wrap justify-center p-4">
				{generatedAssets.map((asset) => (
					<Card
						key={asset.id}
						className="max-w-[500px] w-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 hover:from-purple-700/10 hover:to-pink-700/10 border-purple-700/30"
					>
						<CardContent>
							{asset.type === "birthdaySong" && (
								<audio
									src={asset.data.songUrl}
									className="w-full max-w-[500px]"
								>
									<track kind="captions" />
								</audio>
							)}
							{asset.type === "birthdayVideo" && asset.data.videoUrl && (
								<div className="flex justify-center flex-col gap-2">
									<video
										src={asset.data.videoUrl}
										controls
										className="max-w-[500px] w-full rounded-lg"
									>
										<track kind="captions" />
										Your browser does not support the video element.
									</video>
									<Button
										className="text-sm text-gray-400"
										onClick={() => {
											const url = new URL(
												`/happy-birthday/${asset.id}`,
												window.location.origin,
											);
											navigator.clipboard.writeText(url.toString());
											toast.success("Link copied to clipboard");
										}}
									>
										Copy link
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</ScrollArea>
	);
}
