import NextTranlationProvider from 'next-translation/NextTranlationProvider'
import LocaleSelect from '../../components/LocaleSelect'

export default async function Home() {
  return (
    <NextTranlationProvider lang='en' clientTerms={[]}>
      <main>
        <h1>Root page</h1>
        <LocaleSelect />
      </main>
    </NextTranlationProvider>
  )
}
