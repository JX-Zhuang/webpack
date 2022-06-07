import React from "react";
import Sliders from './Sliders';
const RemoteNewsList = React.lazy(() => import("remote/NewsList"));
const App = () => (
  <div>
    <h2>本地组件NewsList</h2>
    <Sliders />
    <React.Suspense fallback="Loading NewsList">
      <RemoteNewsList />
    </React.Suspense>

  </div>
);

export default App;