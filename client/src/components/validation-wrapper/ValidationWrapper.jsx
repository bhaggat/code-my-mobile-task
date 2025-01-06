export default function ValidationWrapper({ error }) {
  if (!error) return null;
  return <div className="text-red-500 text-sm">{error}</div>;
}
