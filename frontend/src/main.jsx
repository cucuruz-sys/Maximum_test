import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Mainpage from './mainpage/mainpage.jsx'



const router = createBrowserRouter([
    {
        path: "/",
        element: <Mainpage />,
    }
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)


