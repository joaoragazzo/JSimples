import { ConfigProvider } from "antd";
import { Main } from "./view/Main";

function App() {
  
  return (
      <ConfigProvider 
        theme={{
          token: {
            fontFamily: '"Montserrat", sans-serif'
          }
        }}
      >
        <Main />
      </ConfigProvider>
  );
}


export default App;
