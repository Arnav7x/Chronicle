export function Card({ children, className }) {
  return (
    <div className={`rounded-2xl shadow-md border bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
