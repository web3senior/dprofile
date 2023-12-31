import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './index.scss'
import './styles/global.scss'

console.log(`%c MINTDID`, 'color:#12AAFF')

import ErrorPage from './error-page'
const Layout = lazy(() => import('./routes/layout.jsx'))
import SplashScreen, { loader as splashScreenLoader } from './routes/splashScreen.jsx'
import Tour, { loader as tourLoader } from './routes/tour.jsx'
import Contact from './routes/contact.jsx'
import Home, { loader as homeLoader } from './routes/home.jsx'
import Record, { loader as recordLoader } from './routes/record.jsx'
import Feedback from './routes/feedback.jsx'
import New from './routes/new.jsx'
import About from './routes/about.jsx'
import FAQ from './routes/faq.jsx'
import Loading from './routes/components/LoadingSpinner'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: splashScreenLoader,
        element: <SplashScreen title={`Welcome`} />,
      },
      {
        path: 'tour',
        loader: tourLoader,
        element: <Tour title={`Features`} />,
      },
      {
        path: 'home',
        errorElement: <ErrorPage />,
        loader: homeLoader,
        element: <Home title={`Home`} />,
      },
      {
        path: 'record',
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/" replace />,
          },
          {
            path: ':recordId',
            loader: recordLoader,
            element: <Record />,
          },
        ],
      },
      {
        path: 'new',
        element: <New title={`New Profile`} />,
      },
      {
        path: 'about',
        element: <About title={`About`} />,
      },
      {
        path: 'feedback',
        element: <Feedback title={`Feedback`} />,
      },
      {
        path: 'card',
        element: (
          <AuthProvider>
            <>card</>
          </AuthProvider>
        ),
      },

      {
        path: 'faq',
        loader: () => {
          return true
        },
        element: <FAQ />,
      },
      {
        path: 'contact',
        loader: () => {
          return true
        },
        element: <Contact />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)
