import React from "react";
import {
  Switch,
  Route,
  useParams,
  useHistory,
  useRouteMatch
} from "react-router-dom";
import { lazily } from "react-lazily";
import {
  TopBarWrapperStyle,
  SidebarWrapperStyle,
  WorkspaceWrapperStyle
} from "./Workspace.style";

// import { GeneralLoading } from "../../../components";

const { Sidebar, TopBar } = lazily(() =>
  import("../../../components/Protected")
);

export default function Index() {
  const { workspaceId } = useParams();
  const history = useHistory();
  const match = useRouteMatch(`/workspace/${workspaceId}`);

  React.useEffect(() => {
    window.dispatchEvent(new Event("zuri-plugin-load"));
    match.isExact &&
      history.replace(`/workspace/${workspaceId}/plugin-chat/all-dms`);
  }, []);
  // Temporary
  React.useEffect(() => {
    document.title = "Workspace";
    localStorage.setItem("currentWorkspace", workspaceId);
  }, [workspaceId]);

  return (
    <>
      <TopBarWrapperStyle>
        <TopBar />
      </TopBarWrapperStyle>

      <SidebarWrapperStyle>
        <Sidebar />
      </SidebarWrapperStyle>

      <WorkspaceWrapperStyle>
        <div id="zuri-plugin-load-section"></div>
        <Switch>
          <Route exact path="/workspace/:workspaceId">
            <h1>Welcome to your Workspace</h1>
          </Route>

          {/* <Route
            exact
            path="/workspace/:workspaceId/marketplace"
            component={() => <h1>MarketPlace</h1>}
          /> */}

          {/* All other routes not by control go to Single SPA */}
          {/* <Route path="/workspace/:workspaceId/*">
            <div id="zuri-plugin-load-section">
              <p>SHOULD SHOW PLUGINS</p>
            </div>
          </Route> */}
        </Switch>
      </WorkspaceWrapperStyle>
    </>
  );
}
