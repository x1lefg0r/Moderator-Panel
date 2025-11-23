import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const ListPage = lazy(() => import("./pages/ListPage"));
const ItemPage = lazy(() => import("./pages/ItemPage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/list" replace />,
  },
  {
    path: "list",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ListPage />
      </Suspense>
    ),
  },
  {
    path: "item/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ItemPage />
      </Suspense>
    ),
  },
  {
    path: "stats",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <StatsPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
