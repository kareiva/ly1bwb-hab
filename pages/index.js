import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Spots( {limit} ) {
  const { data, error } = useSWR('https://db1.wspr.live/?query= \
    SELECT max(time) as datetime, max(tx_sign) as call, max(tx_lat) as lat, max(tx_lon) as lon, tx_loc FROM wspr.rx \
    WHERE band=14 \
    AND tx_sign=\'LY1BWB\' \
    GROUP BY tx_loc \
    ORDER BY max(time) DESC \
    LIMIT ' + limit + ' FORMAT JSONCompact',
  fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <table>
      <tr key={"header"}>
        {data.meta.map((key) => (<th>{key.name}</th>))}
      </tr>
      {data.data.map((item) => (
        <tr key={item.id}>
          {item.map((val) => (
            <td>{val}</td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export default function Home() {

  return (
    <div className="container">
      <Head>
        <title>LY1BWB flight data!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="LY1BWB flight data!" />
        <p className="description">
          <Spots limit="15" />
        </p>
      </main>

      <Footer />
    </div>
  )
}
