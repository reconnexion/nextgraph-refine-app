import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayout,
  ErrorComponent,
  RefineThemes,
} from "@refinedev/antd";
import {
  DashboardOutlined,
} from "@ant-design/icons";

import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { App as AntdApp, ConfigProvider } from "antd";

import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";

import authProvider from "./providers/auth-provider";
import dataProvider from "./providers/data-provider";
import dataModels from "./shapes/data-models";
import liveProvider from "./providers/live-provider";
import AuthPage from "./components/AuthPage";
import { PostList, PostCreate, PostEdit, PostShow } from "../src/pages/posts";
import { DashboardPage } from "../src/pages/dashboard";

import "./utils/initNg";

const App: React.FC = () => (
  <BrowserRouter>
    <ConfigProvider theme={RefineThemes.Blue}>
      <AntdApp>
        <Refine
          authProvider={authProvider}
          dataProvider={dataProvider({ dataModels })}
          liveProvider={liveProvider}
          routerProvider={routerProvider}
          resources={[
            {
              name: "dashboard",
              list: "/",
              meta: {
                label: "Dashboard",
                icon: <DashboardOutlined />,
              },
            },
            {
              name: "posts",
              list: "/posts",
              create: "/posts/create",
              show: "/posts/show/:id",
              edit: "/posts/edit/:id",
              meta: {
                canDelete: true,
              },
            },
          ]}
          notificationProvider={useNotificationProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            liveMode: "auto",
            disableTelemetry: true,
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-routes"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayout>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route index element={<DashboardPage />} />

              <Route path="/posts">
                <Route index element={<PostList />} />
                <Route path="create" element={<PostCreate />} />
                <Route path="edit/:id" element={<PostEdit />} />
                <Route path="show/:id" element={<PostShow />} />
              </Route>
            </Route>

            <Route
              element={
                <Authenticated key="auth-pages" fallback={<Outlet />}>
                  <NavigateToResource resource="posts" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
            </Route>

            <Route
              element={
                <Authenticated key="catch-all">
                  <ThemedLayout>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </AntdApp>
    </ConfigProvider>
  </BrowserRouter>
);

export default App;
