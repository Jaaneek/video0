import Sidebar from "./components/Sidebar";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div style={{ display: "flex", minHeight: "100vh" }}>
			<Sidebar />
			<main style={{ flex: 1 }}>{children}</main>
		</div>
	);
}
