import WidgetChatbot from "@/components/WidgetChatbot";

export default function ChatWidgetPage() {
  return (
    <main className="flex h-screen w-screen items-end justify-start overflow-hidden bg-transparent p-3">
      <div className="h-[min(540px,calc(100vh-24px))] w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <WidgetChatbot />
      </div>
    </main>
  );
}
