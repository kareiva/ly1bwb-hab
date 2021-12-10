import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Spots( {limit} ) {
  const { data, error } = useSWR('https://db1.wspr.live/?query= \
    SELECT max(time) as seen, tx_loc as location, tx_lat, tx_lon FROM wspr.rx \
    WHERE band=14 \
    AND tx_sign=\'LY1BWB\' \
    GROUP BY tx_lat, tx_lon, tx_loc \
    ORDER BY max(time) DESC \
    LIMIT ' + limit + ' FORMAT JSONCompact',
  fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  dayjs.extend(relativeTime)
  dayjs.extend(utc)

  return (
    <table>
      <tr key={"header"}>
        {data.meta.map((key) => (<th>{key.name}</th>))}
      </tr>
      {data.data.map((item) => (
        <tr key={item.id}>
          <td>{dayjs(item[0]).utc(true).fromNow()}</td>
          <td>{item[1]}</td>
          <td>{item[2]}</td>
          <td>{item[3]}</td>
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
          <Spots limit="5" />
        </p>
      </main>

      <Footer />
    </div>
  )
}
