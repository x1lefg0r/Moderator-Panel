import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  fetchActivityChart,
  fetchCategoriesChart,
  fetchDecisionsChart,
  fetchStatsSummary,
} from "../api/stats";
import { COLORS } from "../types";
import { StatCard } from "../components/ui/StatCard";

const StatsPage = () => {
  const [period, setPeriod] = useState("week");

  const summaryQuery = useQuery({
    queryKey: ["stats", "summary", period],
    queryFn: () => fetchStatsSummary(period),
  });

  const activityQuery = useQuery({
    queryKey: ["stats", "activity", period],
    queryFn: () => fetchActivityChart(period),
  });

  const decisionsQuery = useQuery({
    queryKey: ["stats", "decisions", period],
    queryFn: () => fetchDecisionsChart(period),
  });

  const categoriesQuery = useQuery({
    queryKey: ["stats", "categories", period],
    queryFn: () => fetchCategoriesChart(period),
  });

  const isLoading =
    summaryQuery.isLoading ||
    activityQuery.isLoading ||
    decisionsQuery.isLoading ||
    categoriesQuery.isLoading;

  if (isLoading) {
    return <div className="p-10 text-center">Загрузка статистики...</div>;
  }

  const pieData = decisionsQuery.data
    ? [
        {
          name: "Одобрено",
          value: decisionsQuery.data.approved,
          color: COLORS.approved,
        },
        {
          name: "На доработку",
          value: decisionsQuery.data.requestChanges,
          color: COLORS.requestChanges,
        },
        {
          name: "Отклонено",
          value: decisionsQuery.data.rejected,
          color: COLORS.rejected,
        },
      ]
    : [];

  const categoriesData = categoriesQuery.data
    ? Object.entries(categoriesQuery.data).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Статистика модератора</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border p-2 rounded bg-white shadow-sm"
        >
          <option value="today">За сегодня</option>
          <option value="week">За неделю</option>
          <option value="month">За месяц</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Всего проверено"
          value={summaryQuery.data?.totalReviewed || 0}
          subtext={`+${summaryQuery.data?.totalReviewedToday || 0} сегодня`}
        />
        <StatCard
          title="Доля одобренных"
          value={`${Number(summaryQuery.data?.approvedPercentage || 0).toFixed(
            2
          )}%`}
          subtext="Целевой показатель: >80%"
        />
        <StatCard
          title="Доля отклоненных"
          value={`${Number(summaryQuery.data?.rejectedPercentage || 0).toFixed(
            2
          )}%`}
          subtext={`${
            summaryQuery.data?.requestChangesPercentage || 0
          }% на доработку`}
        />
        <StatCard
          title="Среднее время проверки"
          value={`${(
            Number(summaryQuery.data?.averageReviewTime || 0) / 216000
          ).toFixed(2)} ч.`}
          subtext="на одно объявление"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="font-bold text-lg mb-6">Активность модерации</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityQuery.data || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) =>
                  new Date(val).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(val) =>
                  new Date(val).toLocaleDateString("ru-RU")
                }
              />
              <Legend />
              <Bar
                dataKey="approved"
                name="Одобрено"
                stackId="a"
                fill={COLORS.approved}
              />
              <Bar
                dataKey="requestChanges"
                name="Доработка"
                stackId="a"
                fill={COLORS.requestChanges}
              />
              <Bar
                dataKey="rejected"
                name="Отклонено"
                stackId="a"
                fill={COLORS.rejected}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-w hite p-6 rounded-lg shadow border">
          <h3 className="font-bold text-lg mb-4">Распределение решений</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-bold text-lg mb-4">Топ категорий</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoriesData}
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  name="Объявлений"
                  fill={COLORS.blue}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
