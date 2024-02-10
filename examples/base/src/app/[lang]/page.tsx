import LocaleSelect from '../../components/LocaleSelect'
import Nav from '../../components/Nav'
import Intro from '../../components/Intro'
import HomeContent from '../../components/HomeContent'
import Additional from '../../components/Additional'
import NextTranlationProvider from 'next-translation/NextTranlationProvider'
import createTranslation from 'next-translation/createTranslation'

export default async function Home({ params }: { params: { lang: string } }) {
  return (
    <NextTranlationProvider lang={params.lang} clientTerms={[]}>
      <main>
        <LocaleSelect />
        <Nav />
        <Intro page="home" />
        <HomeContent />
        <Additional page="home" />
      </main>
    </NextTranlationProvider>
  )
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { t } = await createTranslation(params.lang);

  return {
    title: t('homePage.meta.title'),
  }
}
