import '@styles/globals.css'
import { SWRConfig } from 'swr'

function Application({ Component, pageProps }) {
  return (
    <SWRConfig value={{
        dedupingInterval: 120000,
        refreshInterval: 120000,
        revalidateOnFocus: false
      }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default Application
