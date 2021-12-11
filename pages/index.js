import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Spots( {limit, callsign='LY1BWB'} ) {
  var query = ''
  if (callsign == 'LY1BWB') {
    query = 'https://db1.wspr.live/?query= \
      SELECT max(time) as seen, tx_loc as location, tx_lat, tx_lon FROM wspr.rx \
      WHERE band=14 \
      AND tx_sign LIKE \'' + callsign +'\' \
      GROUP BY tx_lat, tx_lon, tx_loc \
      ORDER BY max(time) DESC \
      LIMIT ' + limit + ' FORMAT JSONCompact'
  }
  else {
    query = 'https://db1.wspr.live/?query= \
    SELECT max(time) as seen, tx_sign as tele1, tx_loc as tele2, power as tele3 FROM wspr.rx \
    WHERE band=14 \
    AND tx_sign LIKE \'' + callsign +'\' \
    AND modulo(EXTRACT(MINUTE FROM time), 10) = 2 \
    GROUP BY tx_sign, tx_loc, power \
    ORDER BY max(time) DESC \
    LIMIT ' + limit + ' FORMAT JSONCompact'
  }
  const { data, error } = useSWR(query, fetcher)
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
        <Header title="LY1BWB flight data:" />
        <p className="description">
          <Spots limit="5" callsign='LY1BWB'/>
        </p>
        <Header title="LY1BWB telemetry:" />
        <p className="description">
          <Spots limit="5" callsign='Q_0___'/>
        </p>
      </main>

      <Footer />
    </div>
  )
}
