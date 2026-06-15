import { MessageSquare } from "lucide-react";

export function PlaceholderModule({ title }: { title: string }) {
  return (
    <div className="placeholder-module">
      <MessageSquare size={42} />
      <h1>{title}</h1>
      <p>
        Future module placeholder. This is where specialty-specific synthetic EHR workflows can go.
      </p>
    </div>
  );
}
