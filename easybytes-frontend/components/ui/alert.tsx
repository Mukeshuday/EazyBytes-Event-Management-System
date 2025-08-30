"use client";

export function Alert({
  kind = "info",
  children,
}: {
  kind?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const styles =
    kind === "success"
      ? "bg-green-50 text-green-700"
      : kind === "error"
      ? "bg-red-50 text-red-700"
      : "bg-blue-50 text-blue-700";
  return <div className={`rounded-md p-3 ${styles}`}>{children}</div>;
}
