export const StatCard = ({
  title,
  value,
  subtext,
}: {
  title: string;
  value: string | number;
  subtext?: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">
      {title}
    </h3>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
    {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
  </div>
);
